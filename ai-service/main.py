import json
import logging
import os
import re
from typing import Literal

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
Find up to six current, genuinely published news stories from the last 72 hours
about civic issues in {payload.region}. Use Google Search to locate the original
publisher's article page. Prefer established local news publishers and official
public agencies. Exclude opinion, old stories, duplicate coverage of the same
event, social media posts, and pages that are only search result pages.

Return JSON only with a "stories" array. Every object must contain:
"title" (the publisher's actual headline), "source_name" (publisher),
"source_url" (the original article URL), "category" (one exact value from this
list: {category_list}), "summary" (a brief attributed, neutral paraphrase),
and "article_text" (an 80-12000 character factual synopsis of the reported
story, preserving attribution and uncertainty; do not invent quotes or details).
Use only facts from the search results and cited publisher pages. Do not invent
URLs, headlines, or publication details. Include at most one story per category
and try to include one story for each category when a qualifying recent article
exists. Only include a story if Google Search returned its exact article URL as
a grounding source; omit a category if no qualifying real story is found.
""".strip()


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
    for raw_story in raw_stories[:6]:
        try:
            story = TrendingStory.model_validate(raw_story)
        except (ValidationError, TypeError, ValueError) as error:
            logger.info("Skipping malformed Gemini trending result: %s", error)
            continue
        if (
            story.category not in allowed_categories
            or story.category in seen_categories
            or str(story.source_url) not in grounded_urls
        ):
            continue
        stories.append(story)
        seen_categories.add(story.category)

    return TrendingResponse(stories=stories, model=model)
