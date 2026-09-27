import json
import ipaddress
import logging
import os
import re
import socket
from typing import Literal
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit

import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, HttpUrl, ValidationError

logger = logging.getLogger("civiclens.ai")
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))

app = FastAPI(title="CivicLens Claim Assessment API", version="1.0.0")

EvidenceStatus = Literal[
    "Well-supported",
    "Supported with context",
    "Needs verification",
    "Conflicting reports",
    "Insufficient evidence",
    "Contradicted by available evidence",
]


class SourceDocument(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=500)
    description: str = Field(default="", max_length=12000)
    source_url: HttpUrl
    provenance_note: str = Field(default="", max_length=3000)
    type: str = Field(default="External source", max_length=50)


class AnalyzeRequest(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    source_name: str = Field(min_length=1, max_length=200)
    source_url: HttpUrl
    article_text: str = Field(min_length=80, max_length=50000)
    source_documents: list[SourceDocument] = Field(default_factory=list, max_length=50)


class ExtractedClaim(BaseModel):
    claim_text: str = Field(min_length=1, max_length=2000)
    speaker_or_source: str = Field(default="Unspecified", max_length=200)
    status: EvidenceStatus
    status_explanation: str = Field(min_length=1, max_length=4000)
    evidence_ids: list[str] = Field(default_factory=list, max_length=20)
    missing_information: list[str] = Field(default_factory=list, max_length=20)
    generated_questions: list[str] = Field(default_factory=list, max_length=20)


class AnalyzeResponse(BaseModel):
    claims: list[ExtractedClaim]
    model: str


class TrendingRequest(BaseModel):
    region: str = Field(min_length=1, max_length=100)
    categories: list[str] = Field(min_length=1, max_length=12)


class TrendingStory(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    source_name: str = Field(min_length=1, max_length=150)
    source_url: HttpUrl
    category: str = Field(min_length=1, max_length=50)
    summary: str = Field(min_length=1, max_length=1000)
    article_text: str = Field(min_length=80, max_length=12000)
    image_url: HttpUrl | None = None
    image_caption: str | None = Field(default=None, max_length=500)
    image_credit: str | None = Field(default=None, max_length=150)


class TrendingResponse(BaseModel):
    stories: list[TrendingStory]
    model: str


def build_prompt(payload: AnalyzeRequest) -> str:
    documents = [
        {
            "id": document.id,
            "title": document.title,
            "description": document.description,
            "source_url": str(document.source_url),
            "provenance_note": document.provenance_note,
            "type": document.type,
        }
        for document in payload.source_documents
    ]

    return f"""
You are assisting CivicLens with forensic review of public-news claims.
Extract only individually testable factual claims stated in the article. Do not
invent events, facts, sources, evidence IDs, or conclusions. Do not assess
opinions as factual claims.

Assess each claim only using the supplied source-document metadata and
descriptions below. A description is a stored source note, not the full
document. A URL alone is not proof that its contents support a claim. If the
available descriptions do not establish a direct relationship, use
"Needs verification" or "Insufficient evidence". Use "Well-supported" only
when a supplied source description directly supports the claim; use
"Contradicted by available evidence" only when a description directly
contradicts it. Use "Conflicting reports" only when two supplied sources
explicitly conflict. Never cite an ID not present in the supplied list.

Return JSON only, in this exact structure:
{{
  "claims": [
    {{
      "claim_text": "atomic factual claim",
      "speaker_or_source": "attributed source or Unspecified",
      "status": "one of the six allowed statuses",
      "status_explanation": "brief explanation limited to supplied information",
      "evidence_ids": ["IDs from the supplied source list only"],
      "missing_information": ["specific information needed"],
      "generated_questions": ["neutral question for further verification"]
    }}
  ]
}}

If no source documents are supplied, every claim must be "Insufficient evidence"
and evidence_ids must be empty. Limit the result to 1-20 claims.

ARTICLE TITLE: {payload.title}
PUBLISHER: {payload.source_name}
ARTICLE URL: {payload.source_url}

ARTICLE TEXT:
{payload.article_text}

SUPPLIED SOURCE DOCUMENTS:
{json.dumps(documents, ensure_ascii=False)}
""".strip()


def build_trending_prompt(payload: TrendingRequest) -> str:
    category_list = ", ".join(payload.categories)
    return f"""
Find up to seven current, genuinely published news stories from the last 72 hours
about civic issues in {payload.region}. Use Google Search to locate the original
publisher's article page. Prefer established local news publishers and official
public agencies. Exclude opinion, old stories, duplicate coverage of the same
event, social media posts, and pages that are only search result pages. Search
for all categories in this list: {category_list}.

Return JSON only with a "stories" array. Every object must contain:
"title" (the publisher's actual headline), "source_name" (publisher),
"source_url" (the original article URL), "category" (one exact value from this
list: {category_list}), "summary" (a brief attributed, neutral paraphrase),
and "article_text" (an 80-12000 character factual synopsis of the reported
story, preserving attribution and uncertainty; do not invent quotes or details).
Use "High Hoax Risk" only when the story concerns a viral factual claim whose
claim itself has clear warning characteristics, such as no named source,
misleadingly edited evidence, or a claim contradicted by reliable records. This
is a claim-based label, not a general topic category. Otherwise use the story's
main civic subject category.

Use only facts from the search results and cited publisher pages. Do not invent
URLs, headlines, or publication details. Include at most one story per category
and try to include one story for each category when a qualifying recent article
exists. Only include a story if Google Search returned its exact article URL as
a grounding source; omit a category if no qualifying real story is found.
""".strip()


class ArticlePageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, str] = {}
        self.article_depth = 0
        self.article_paragraphs: list[str] = []
        self.all_paragraphs: list[str] = []
        self.article_images: list[tuple[str, str]] = []
        self._paragraph_depth = 0
        self._paragraph_in_article = False
        self._paragraph_parts: list[str] = []
        self._h1_depth = 0
        self._h1_parts: list[str] = []
        self.headline = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {name.lower(): value or "" for name, value in attrs}
        if tag == "meta":
            key = (attributes.get("property") or attributes.get("name") or "").lower()
            content = attributes.get("content", "").strip()
            if key and content:
                self.meta.setdefault(key, content)
        if tag == "article":
            self.article_depth += 1
        elif tag == "p":
            self._paragraph_depth += 1
            self._paragraph_in_article = self.article_depth > 0
            if self._paragraph_depth == 1:
                self._paragraph_parts = []
        elif tag == "h1":
            self._h1_depth += 1
            self._h1_parts = []
        elif tag == "img" and self.article_depth > 0:
            image_url = attributes.get("src") or attributes.get("data-src") or attributes.get("data-original")
            if image_url:
                self.article_images.append((image_url.strip(), attributes.get("alt", "").strip()))

    def handle_endtag(self, tag: str) -> None:
        if tag == "article" and self.article_depth > 0:
            self.article_depth -= 1
        elif tag == "p" and self._paragraph_depth > 0:
            self._paragraph_depth -= 1
            if self._paragraph_depth == 0:
                paragraph = " ".join(" ".join(self._paragraph_parts).split())
                if len(paragraph) >= 40:
                    self.all_paragraphs.append(paragraph)
                    if self._paragraph_in_article:
                        self.article_paragraphs.append(paragraph)
                self._paragraph_parts = []
                self._paragraph_in_article = False
        elif tag == "h1" and self._h1_depth > 0:
            self._h1_depth -= 1
            headline = " ".join(" ".join(self._h1_parts).split())
            if headline and not self.headline:
                self.headline = headline

    def handle_data(self, data: str) -> None:
        if self._paragraph_depth > 0:
            self._paragraph_parts.append(data)
        if self._h1_depth > 0:
            self._h1_parts.append(data)


def is_safe_publisher_url(value: str) -> bool:
    try:
        parsed = urlsplit(value)
        if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            return False
        if parsed.port not in (None, 443):
            return False
        hostname = parsed.hostname.rstrip(".").lower()
        if hostname in {"localhost", "localhost.localdomain"} or hostname.endswith((".local", ".internal")):
            return False
        try:
            addresses = [ipaddress.ip_address(hostname)]
        except ValueError:
            addresses = [
                ipaddress.ip_address(item[4][0])
                for item in socket.getaddrinfo(hostname, 443, type=socket.SOCK_STREAM)
            ]
        return bool(addresses) and all(address.is_global for address in addresses)
    except (ValueError, OSError):
        return False


def is_specific_publisher_url(value: str) -> bool:
    try:
        return is_safe_publisher_url(value) and bool(urlsplit(value).path.strip("/"))
    except ValueError:
        return False


def is_usable_image_url(value: str, base_url: str) -> str | None:
    absolute = urljoin(base_url, value.strip())
    if not is_safe_publisher_url(absolute):
        return None
    return absolute


def extract_publisher_page(url: str) -> tuple[str | None, str | None, str | None, str | None, str | None]:
    current_url = url
    response_content: bytes | None = None
    response_encoding = "utf-8"

    for _ in range(4):
        if not is_safe_publisher_url(current_url):
            logger.info("Skipped unsafe publisher redirect URL")
            return None, None, None, None, None
        try:
            with requests.get(
                current_url,
                headers={"User-Agent": "CivicLensBot/1.0 (public article metadata and attribution)"},
                timeout=(5, 12),
                stream=True,
                allow_redirects=False,
            ) as response:
                if response.is_redirect:
                    location = response.headers.get("Location")
                    if not location:
                        return None, None, None, None, None
                    current_url = urljoin(current_url, location)
                    continue
                if response.status_code != 200 or "text/html" not in response.headers.get("Content-Type", "").lower():
                    return None, None, None, None, None
                content_length = response.headers.get("Content-Length")
                if content_length and int(content_length) > 2_000_000:
                    return None, None, None, None, None
                chunks = []
                size = 0
                for chunk in response.iter_content(chunk_size=16384):
                    size += len(chunk)
                    if size > 2_000_000:
                        return None, None, None, None, None
                    chunks.append(chunk)
                response_content = b"".join(chunks)
                response_encoding = response.encoding or "utf-8"
                current_url = response.url
                break
        except (requests.RequestException, ValueError) as error:
            logger.info("Publisher page metadata could not be read: %s", error)
            return None, None, None, None, None

    if response_content is None or not is_safe_publisher_url(current_url):
        return None, None, None, None, None

    parser = ArticlePageParser()
    try:
        parser.feed(response_content.decode(response_encoding, errors="replace"))
    except (LookupError, UnicodeError) as error:
        logger.info("Publisher article page could not be decoded: %s", error)
        return None, None, None, None, None

    raw_image = (
        parser.meta.get("og:image")
        or parser.meta.get("og:image:url")
        or parser.meta.get("twitter:image")
        or (parser.article_images[0][0] if parser.article_images else "")
    )
    image_url = is_usable_image_url(raw_image, current_url) if raw_image else None
    image_caption = parser.meta.get("og:image:alt") or parser.meta.get("twitter:image:alt")
    if not image_caption and parser.article_images:
        candidate_image = parser.article_images[0][0]
        if image_url and is_usable_image_url(candidate_image, current_url) == image_url:
            image_caption = parser.article_images[0][1] or None

    paragraphs = parser.article_paragraphs if len(" ".join(parser.article_paragraphs)) >= 80 else parser.all_paragraphs
    article_text = "\n\n".join(paragraphs)[:50000] if len(" ".join(paragraphs)) >= 80 else None
    return image_url, image_caption, article_text, parser.headline or None, parser.meta.get("og:site_name")


def parse_model_json(text: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.IGNORECASE)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start < 0 or end <= start:
        raise ValueError("No JSON object in provider response.")
    parsed = json.loads(cleaned[start:end + 1])
    if not isinstance(parsed, dict):
        raise ValueError("Provider response was not a JSON object.")
    return parsed


def gemini_generate(prompt: str, *, google_search: bool) -> tuple[dict, str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Claim assessment is not configured: GEMINI_API_KEY is missing.")

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    request_body: dict = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
    }
    if google_search:
        request_body["tools"] = [{"google_search": {}}]
    else:
        request_body["generationConfig"] = {"responseMimeType": "application/json"}

    try:
        response = requests.post(
            endpoint,
            headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
            json=request_body,
            timeout=60,
        )
        response.raise_for_status()
        candidate = response.json()["candidates"][0]
        response_text = candidate["content"]["parts"][0]["text"]
        parsed = parse_model_json(response_text)
        return {"result": parsed, "candidate": candidate}, model
    except requests.Timeout as error:
        logger.warning("Gemini request timed out")
        raise HTTPException(status_code=504, detail="Gemini request timed out. Please retry.") from error
    except requests.RequestException as error:
        logger.error("Gemini request failed: %s", error)
        raise HTTPException(status_code=502, detail="Gemini provider request failed.") from error
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError) as error:
        logger.error("Gemini returned an invalid response: %s", error)
        raise HTTPException(status_code=502, detail="Gemini returned an invalid response.") from error


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "civiclens-claim-assessment"}


@app.post("/extract-claims", response_model=AnalyzeResponse)
def extract_claims(payload: AnalyzeRequest) -> AnalyzeResponse:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Claim assessment is not configured: GEMINI_API_KEY is missing.")

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    request_body = {
        "contents": [{"role": "user", "parts": [{"text": build_prompt(payload)}]}],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    try:
        response = requests.post(
            endpoint,
            headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
            json=request_body,
            timeout=60,
        )
        response.raise_for_status()
        provider_result = response.json()
        response_text = provider_result["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(response_text)
        result = AnalyzeResponse.model_validate({"claims": parsed.get("claims"), "model": model})
    except requests.Timeout as error:
        logger.warning("Gemini claim assessment timed out")
        raise HTTPException(status_code=504, detail="Claim assessment timed out. Please retry.") from error
    except requests.RequestException as error:
        logger.error("Gemini request failed: %s", error)
        raise HTTPException(status_code=502, detail="Claim assessment provider request failed.") from error
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError) as error:
        logger.error("Gemini returned an invalid claim assessment response: %s", error)
        raise HTTPException(status_code=502, detail="Claim assessment provider returned an invalid response.") from error

    valid_document_ids = {document.id for document in payload.source_documents}
    for claim in result.claims:
        claim.evidence_ids = list(dict.fromkeys(
            evidence_id for evidence_id in claim.evidence_ids if evidence_id in valid_document_ids
        ))
        if not payload.source_documents:
            claim.status = "Insufficient evidence"
            claim.evidence_ids = []
        elif not claim.evidence_ids and claim.status in {
            "Well-supported",
            "Supported with context",
            "Conflicting reports",
            "Contradicted by available evidence",
        }:
            claim.status = "Needs verification"
            claim.status_explanation = (
                "No supplied source record could be linked to this assessment. "
                "Additional primary documentation is needed."
            )

    return result


@app.post("/trending-stories", response_model=TrendingResponse)
def find_trending_stories(payload: TrendingRequest) -> TrendingResponse:
    if len(set(payload.categories)) != len(payload.categories):
        raise HTTPException(status_code=400, detail="Categories must be unique.")

    generated, model = gemini_generate(build_trending_prompt(payload), google_search=True)
    candidate = generated["candidate"]
    allowed_categories = set(payload.categories)
    grounding_metadata = candidate.get("groundingMetadata", {})
    chunks = grounding_metadata.get("groundingChunks", []) if isinstance(grounding_metadata, dict) else []
    grounded_urls = {
        web["uri"]
        for chunk in chunks
        if isinstance(chunk, dict)
        and isinstance((web := chunk.get("web")), dict)
        and isinstance(web.get("uri"), str)
        and web["uri"].startswith("https://")
    }

    raw_stories = generated["result"].get("stories", [])
    if not isinstance(raw_stories, list):
        raise HTTPException(status_code=502, detail="Gemini returned an invalid story list.")

    stories = []
    seen_categories = set()
    for raw_story in raw_stories[:7]:
        try:
            story = TrendingStory.model_validate(raw_story)
        except (ValidationError, TypeError, ValueError) as error:
            logger.info("Skipping malformed Gemini trending result: %s", error)
            continue
        raw_source_url = raw_story.get("source_url") if isinstance(raw_story, dict) else None
        if (
            story.category not in allowed_categories
            or story.category in seen_categories
            or not isinstance(raw_source_url, str)
            or raw_source_url not in grounded_urls
            or not is_specific_publisher_url(raw_source_url)
        ):
            continue
        image_url, image_caption, page_text, page_headline, page_source_name = extract_publisher_page(raw_source_url)
        enriched_story = story.model_copy(update={
            "title": page_headline[:500] if page_headline and page_headline.strip() else story.title,
            "source_name": page_source_name[:150] if page_source_name and page_source_name.strip() else story.source_name,
            "article_text": page_text[:12000] if page_text and len(page_text.strip()) >= 80 else story.article_text,
            "image_url": image_url,
            "image_caption": image_caption,
            "image_credit": (
                page_source_name[:150] if page_source_name and page_source_name.strip()
                else story.source_name
            ) if image_url else None,
        })
        stories.append(enriched_story)
        seen_categories.add(story.category)

    return TrendingResponse(stories=stories, model=model)
