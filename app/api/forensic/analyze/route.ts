import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { computeArticleScore } from '@/lib/scoring/engine';
import { EvidenceStatus, EvidenceType, NewsCategory } from '@/types';

export const runtime = 'nodejs';

const NEWS_CATEGORIES: NewsCategory[] = [
  'Politics',
  'Education',
  'Technology',
  'Business',
  'Environment',
  'Science',
  'Sports',
  'Sports & Media Ethics',
  'Culture',
  'Public Safety',
  'Health',
  'Other',
];

const EVIDENCE_STATUSES: EvidenceStatus[] = [
  'Well-supported',
  'Supported with context',
  'Needs verification',
  'Conflicting reports',
  'Insufficient evidence',
  'Contradicted by available evidence',
];

const EVIDENCE_TYPES: EvidenceType[] = [
  'Official document',
  'News source',
  'External source',
  'Photo',
  'Video',
  'Dataset',
  'Firsthand account',
];

interface SourceDocument {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  source_url: string;
  provenance_note: string;
  uploader_pseudonym: string;
}

interface AssessedClaim {
  claim_text: string;
  speaker_or_source: string;
  status: EvidenceStatus;
  status_explanation: string;
  evidence_ids: string[];
  missing_information: string[];
  generated_questions: string[];
}

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

function isPublicHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
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

export async function POST(request: Request) {
  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const body = asObject(requestBody);
  const title = asString(body?.title)?.trim();
  const sourceName = asString(body?.sourceName)?.trim();
  const sourceUrl = body?.sourceUrl;
  const articleText = asString(body?.articleText)?.trim();
  const author = (asString(body?.author)?.trim() || 'CivicLens Reader').slice(0, 150);
  const categoryValue = asString(body?.category) as NewsCategory | undefined;
  if (!title || title.length > 500 || !sourceName || sourceName.length > 150 ||
      !isPublicHttpsUrl(sourceUrl) || !articleText || articleText.length < 80 ||
      articleText.length > 50000 || !categoryValue || !NEWS_CATEGORIES.includes(categoryValue)) {
    return NextResponse.json(
      { error: 'Provide a title, publisher, HTTPS article URL, article text (80–50,000 characters), and valid category.' },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Server persistence is not configured. Set SUPABASE_SERVICE_ROLE_KEY in the server secret store.' },
      { status: 503 },
    );
  }
  const aiServiceUrl = process.env.AI_SERVICE_URL;
  if (!aiServiceUrl) {
    return NextResponse.json({ error: 'Claim assessment is not configured. Set AI_SERVICE_URL on the server.' }, { status: 503 });
  }

  const { data: evidenceRows, error: evidenceError } = await supabase
    .from('evidence_items')
    .select('id,type,title,description,source_url,provenance_note,uploader_pseudonym,is_demo')
    .eq('is_demo', false)
    .not('source_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(30);

  if (evidenceError) {
    console.error('Unable to load source records for claim assessment:', evidenceError.message);
    return NextResponse.json(
      { error: 'Could not load source records. Apply the forensic intake database migration and try again.' },
      { status: 503 },
    );
  }

  const sourceDocuments: SourceDocument[] = (evidenceRows ?? [])
    .filter((row) => row.is_demo !== true && isPublicHttpsUrl(row.source_url))
    .filter((row) => {
      const hostname = new URL(row.source_url).hostname.toLowerCase();
      return !hostname.startsWith('example.') && !hostname.includes('.example.');
    })
    .map((row) => {
      const type = row.type as EvidenceType;
      return {
        id: row.id,
        type: EVIDENCE_TYPES.includes(type) ? type : 'External source',
        title: row.title,
        description: row.description,
        source_url: row.source_url,
        provenance_note: row.provenance_note,
        uploader_pseudonym: row.uploader_pseudonym,
      };
    });

  let aiResponse: Response;
  try {
    const endpoint = new URL('/extract-claims', aiServiceUrl);
    aiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        source_name: sourceName,
        source_url: sourceUrl,
        article_text: articleText,
        source_documents: sourceDocuments,
      }),
      signal: AbortSignal.timeout(65000),
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Claim assessment service request failed:', error);
    return NextResponse.json({ error: 'Claim assessment service is unavailable. Please try again.' }, { status: 503 });
  }

  if (!aiResponse.ok) {
    const errorPayload = asObject(await aiResponse.json().catch(() => null));
    const message = asString(errorPayload?.detail) || 'Claim assessment failed.';
    console.error('Claim assessment service returned an error:', aiResponse.status, message);
    return NextResponse.json({ error: message }, { status: aiResponse.status === 503 ? 503 : 502 });
  }

  const result = asObject(await aiResponse.json().catch(() => null));
  const sourceIds = new Set(sourceDocuments.map((document) => document.id));
  const claims = parseClaims(result?.claims, sourceIds);
  if (!claims) {
    return NextResponse.json({ error: 'The assessment service returned no valid claim breakdown.' }, { status: 502 });
  }

  const articleId = crypto.randomUUID();
  const publishedAt = new Date().toISOString();
  const paragraphs = articleText.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const { error: articleError } = await supabase.from('articles').insert({
    id: articleId,
    title,
    summary: (paragraphs[0] ?? articleText).slice(0, 240),
    body_paragraphs: paragraphs,
    source_name: sourceName,
    source_url: sourceUrl,
    author,
    published_at: publishedAt,
    category: categoryValue,
    is_demo: false,
  });

  if (articleError) {
    console.error('Unable to persist analyzed article:', articleError.message);
    return NextResponse.json({ error: 'Could not save this story to Supabase.' }, { status: 500 });
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

    const evidenceInserts = claims.flatMap((claim, index) => {
      const claimId = claimRows[index].id;
      return claim.evidence_ids.flatMap((evidenceId) => {
        const source = sourceDocuments.find((document) => document.id === evidenceId);
        if (!source) return [];
        return [{
          claim_id: claimId,
          type: source.type,
          title: source.title,
          description: source.description,
          source_url: source.source_url,
          provenance_note: source.provenance_note,
          uploader_pseudonym: source.uploader_pseudonym,
          is_demo: false,
        }];
      });
    });

    if (evidenceInserts.length > 0) {
      const { error: evidenceInsertError } = await supabase.from('evidence_items').insert(evidenceInserts);
      if (evidenceInsertError) throw new Error(evidenceInsertError.message);
    }
  } catch (error) {
    console.error('Unable to persist the full claim assessment:', error);
    const { error: rollbackError } = await supabase.from('articles').delete().eq('id', articleId);
    if (rollbackError) console.error('Unable to clean up incomplete article:', rollbackError.message);
    return NextResponse.json({ error: 'The claim assessment could not be saved completely. Please retry.' }, { status: 500 });
  }

  const score = computeArticleScore(claims.map((claim, index) => ({
    id: `claim-${index}`,
    claimText: claim.claim_text,
    speakerOrSource: claim.speaker_or_source,
    status: claim.status,
    statusExplanation: claim.status_explanation,
    evidence: [],
    missingInformation: claim.missing_information,
    generatedQuestions: claim.generated_questions,
  })));

  return NextResponse.json({
    articleId,
    claimCount: claims.length,
    score: score.score,
    grade: score.grade,
  }, { status: 201 });
}
