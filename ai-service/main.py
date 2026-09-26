import json
import logging
import os
from typing import Literal

import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, HttpUrl

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
