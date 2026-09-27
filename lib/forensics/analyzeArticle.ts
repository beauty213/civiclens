import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { computeArticleScore } from '@/lib/scoring/engine';
import { isSpecificHttpsSourceUrl } from '@/lib/forensics/sourceLinks';
import type { EvidenceStatus, NewsCategory } from '@/types';

const EVIDENCE_STATUSES: EvidenceStatus[] = [
  'Well-supported',
  'Supported with context',
  'Needs verification',
  'Conflicting reports',
  'Insufficient evidence',
  'Contradicted by available evidence',
];

interface AssessedClaim {
  claim_text: string;
  speaker_or_source: string;
  status: EvidenceStatus;
  status_explanation: string;
  evidence_ids: string[];
  missing_information: string[];
  generated_questions: string[];
}

export interface ArticleAssessmentInput {
  title: string;
  sourceName: string;
  sourceUrl: string;
  articleText: string;
  summary?: string;
  imageUrl?: string;
  imageCaption?: string;
  imageCredit?: string;
  author: string;
  category: NewsCategory;
  intakeMethod: 'manual' | 'auto';
}

export type ArticleAssessmentResult =
  | { ok: true; articleId: string; claimCount: number; score: number; assessmentStatus: 'complete' | 'in_progress' }
  | { ok: false; status: number; error: string };

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function parseClaims(value: unknown, sourceIds: Set<string>): AssessedClaim[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) return null;
  const claims: AssessedClaim[] = [];

  for (const item of value) {
    const row = asObject(item);
    if (!row) return null;
    const claimText = asString(row.claim_text)?.trim();
    const status = asString(row.status) as EvidenceStatus | undefined;
    const statusExplanation = asString(row.status_explanation)?.trim();
    if (!claimText || !status || !EVIDENCE_STATUSES.includes(status) || !statusExplanation) return null;

    const evidenceIds = [...new Set(asStringList(row.evidence_ids))].filter((id) => sourceIds.has(id));
    let resolvedStatus = status;
    let resolvedExplanation = statusExplanation;
    if (evidenceIds.length === 0 && [
      'Well-supported',
      'Supported with context',
      'Conflicting reports',
      'Contradicted by available evidence',
    ].includes(status)) {
      resolvedStatus = 'Needs verification';
      resolvedExplanation = 'No supplied source record could be linked to this claim. Additional primary documentation is needed.';
    }

    claims.push({
      claim_text: claimText.slice(0, 2000),
      speaker_or_source: (asString(row.speaker_or_source) || 'Unspecified source').slice(0, 200),
      status: resolvedStatus,
      status_explanation: resolvedExplanation.slice(0, 4000),
      evidence_ids: evidenceIds,
      missing_information: asStringList(row.missing_information).slice(0, 20).map((text) => text.slice(0, 1000)),
      generated_questions: asStringList(row.generated_questions).slice(0, 20).map((text) => text.slice(0, 1000)),
    });
  }

  return claims;
}

export async function analyzeAndStoreArticle(
  supabase: SupabaseClient,
  input: ArticleAssessmentInput,
): Promise<ArticleAssessmentResult> {
  if (!isSpecificHttpsSourceUrl(input.sourceUrl)) {
    return { ok: false, status: 400, error: 'Provide a specific HTTPS article URL, not a publisher homepage.' };
  }

  const aiServiceUrl = process.env.AI_SERVICE_URL;
  if (!aiServiceUrl) {
    return { ok: false, status: 503, error: 'Claim assessment is not configured. Set AI_SERVICE_URL on the server.' };
  }

  let aiResponse: Response;
  try {
    aiResponse = await fetch(new URL('/extract-claims', aiServiceUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: input.title,
        source_name: input.sourceName,
        source_url: input.sourceUrl,
        article_text: input.articleText,
        // Existing evidence records belong to other claims and must not be reused here.
        source_documents: [],
      }),
      signal: AbortSignal.timeout(65000),
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Claim assessment service request failed:', error);
    return { ok: false, status: 503, error: 'Claim assessment service is unavailable. Please try again.' };
  }

  if (!aiResponse.ok) {
    const errorPayload = asObject(await aiResponse.json().catch(() => null));
    const message = asString(errorPayload?.detail) || 'Claim assessment failed.';
    console.error('Claim assessment service returned an error:', aiResponse.status, message);
    return { ok: false, status: aiResponse.status === 503 ? 503 : 502, error: message };
  }

  const result = asObject(await aiResponse.json().catch(() => null));
  const claims = parseClaims(result?.claims, new Set());
  if (!claims) {
    return { ok: false, status: 502, error: 'The assessment service returned no valid claim breakdown.' };
  }

  const assessedClaims = claims.map((claim, index) => ({
    id: `claim-${index}`,
    claimText: claim.claim_text,
    speakerOrSource: claim.speaker_or_source,
    status: claim.status,
    statusExplanation: claim.status_explanation,
    evidence: [],
    missingInformation: claim.missing_information,
    generatedQuestions: claim.generated_questions,
  }));
  const score = computeArticleScore(assessedClaims);
  const assessmentStatus = claims.some((claim) =>
    claim.evidence_ids.length === 0 ||
    claim.status === 'Needs verification' ||
    claim.status === 'Insufficient evidence',
  ) ? 'in_progress' : 'complete';

  const articleId = crypto.randomUUID();
  const paragraphs = input.articleText.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const { error: articleError } = await supabase.from('articles').insert({
    id: articleId,
    title: input.title,
    summary: input.summary?.slice(0, 500) || (paragraphs[0] ?? input.articleText).slice(0, 240),
    body_paragraphs: paragraphs,
    source_name: input.sourceName,
    source_url: input.sourceUrl,
    image_url: input.imageUrl ?? null,
    image_caption: input.imageCaption ?? null,
    image_credit: input.imageCredit ?? null,
    author: input.author,
    published_at: new Date().toISOString(),
    category: input.category,
    is_demo: false,
    intake_method: input.intakeMethod,
    assessment_status: assessmentStatus,
  });

  if (articleError) {
    console.error('Unable to persist analyzed article:', articleError.message);
    return { ok: false, status: 500, error: 'Could not save this story to Supabase.' };
  }

  try {
    const { data: claimRows, error: claimError } = await supabase
      .from('claims')
      .insert(claims.map((claim) => ({
        article_id: articleId,
        claim_text: claim.claim_text,
        speaker_or_source: claim.speaker_or_source,
        status: claim.status,
        status_explanation: claim.status_explanation,
        missing_information: claim.missing_information,
        generated_questions: claim.generated_questions,
      })))
      .select('id');

    if (claimError || !claimRows || claimRows.length !== claims.length) {
      throw new Error(claimError?.message ?? 'Claim records could not be saved.');
    }

  } catch (error) {
    console.error('Unable to persist the full claim assessment:', error);
    const { error: rollbackError } = await supabase.from('articles').delete().eq('id', articleId);
    if (rollbackError) console.error('Unable to clean up incomplete article:', rollbackError.message);
    return { ok: false, status: 500, error: 'The claim assessment could not be saved completely. Please retry.' };
  }

  return {
    ok: true,
    articleId,
    claimCount: claims.length,
    score: score.score,
    assessmentStatus,
  };
}
