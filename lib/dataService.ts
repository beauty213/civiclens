// lib/dataService.ts
import { Article, Claim, CitizenReport, CivicQuestion, EvidenceItem, EvidenceStatus, EvidenceType, LocationHierarchy } from '@/types';
import { MOCK_ARTICLES, MOCK_CITIZEN_REPORTS, MOCK_QUESTIONS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase/client';
import { isCivicNewsCategory } from './newsCategories';
import { isSpecificHttpsSourceUrl } from './forensics/sourceLinks';

// Keep local demo records available for explicitly local-only evidence interactions.
const localArticles: Article[] = MOCK_ARTICLES.map((article) => ({
  ...article,
  isDemo: true,
  claims: article.claims.map((claim) => ({
    ...claim,
    evidence: claim.evidence.map((evidence) => ({ ...evidence, isDemo: true })),
  })),
}));
let localReports: CitizenReport[] = [...MOCK_CITIZEN_REPORTS];
const localQuestions: CivicQuestion[] = [...MOCK_QUESTIONS];

type DataRecord = Record<string, unknown>;

function asRecord(value: unknown): DataRecord | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as DataRecord
    : undefined;
}

function asRecordList(value: unknown): DataRecord[] {
  if (!Array.isArray(value)) return [];
  return value.map(asRecord).filter((record): record is DataRecord => record !== undefined);
}

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asTextList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

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
  'official_record',
  'sensor_log',
  'eyewitness_account',
  'expert_analysis',
];

function mapEvidence(row: DataRecord): EvidenceItem {
  const type = asText(row.type) as EvidenceType;
  return {
    id: asText(row.id),
    type: EVIDENCE_TYPES.includes(type) ? type : 'External source',
    title: asText(row.title, 'Untitled record'),
    description: asText(row.description),
    sourceUrl: isSpecificHttpsSourceUrl(row.source_url ?? row.sourceUrl)
      ? asText(row.source_url ?? row.sourceUrl)
      : undefined,
    date: asText(row.created_at ?? row.date),
    uploaderPseudonym: asText(row.uploader_pseudonym ?? row.uploaderPseudonym, 'Civic contributor'),
    provenanceNote: asText(row.provenance_note ?? row.provenanceNote),
    isDemo: row.is_demo === true,
    isVerified: row.is_verified === true,
  };
}

function mapClaim(row: DataRecord): Claim {
  const status = asText(row.status) as EvidenceStatus;
  const evidenceRows = row.evidence_items ?? row.evidence;
  return {
    id: asText(row.id),
    claimText: asText(row.claim_text ?? row.claimText),
    extractedQuote: asText(row.extracted_quote ?? row.extractedQuote) || undefined,
    speakerOrSource: asText(row.speaker_or_source ?? row.speakerOrSource, 'Unspecified source'),
    status: EVIDENCE_STATUSES.includes(status) ? status : 'Needs verification',
    weight: typeof row.weight === 'number' ? row.weight : undefined,
    orderIndex: typeof row.order_index === 'number' ? row.order_index : undefined,
    statusExplanation: asText(row.status_explanation ?? row.statusExplanation),
    evidence: asRecordList(evidenceRows).map(mapEvidence),
    missingInformation: asTextList(row.missing_information ?? row.missingInformation),
    conflictingReports: asText(row.conflicting_reports ?? row.conflictingReports) || undefined,
    generatedQuestions: asTextList(row.generated_questions ?? row.generatedQuestions),
  };
}

function mapArticle(value: unknown): Article | undefined {
  const row = asRecord(value) ?? {};
  const categoryValue = row.category;
  if (!isCivicNewsCategory(categoryValue)) return undefined;

  const locationRow = asRecordList(row.locations ?? row.location)[0] ?? asRecord(row.location) ?? {};
  const location: LocationHierarchy = {
    area: asText(locationRow.area, 'Civic Region'),
    district: asText(locationRow.district, 'Local'),
    state: asText(locationRow.state, 'India'),
    country: asText(locationRow.country, 'India'),
  };
  const claimRows = asRecordList(row.claims).sort((left, right) => {
    const leftOrder = typeof left.order_index === 'number' ? left.order_index : 0;
    const rightOrder = typeof right.order_index === 'number' ? right.order_index : 0;
    return leftOrder - rightOrder;
  });
  return {
    id: asText(row.id),
    title: asText(row.title, 'Untitled article'),
    summary: asText(row.summary),
    bodyParagraphs: asTextList(row.body_paragraphs ?? row.bodyParagraphs ?? row.content),
    sourceName: asText(row.source_name ?? row.sourceName, 'CivicLens'),
    author: asText(row.author, 'Civic contributor'),
    publishedAt: asText(row.published_at ?? row.publishedAt),
    category: categoryValue,
    location,
    claimsCount: claimRows.length,
    unresolvedQuestionsCount: 0,
    citizenReportsCount: 0,
    claims: claimRows.map(mapClaim),
    imageUrl: asText(row.image_url ?? row.imageUrl) || undefined,
    imageCaption: asText(row.image_caption ?? row.imageCaption) || undefined,
    imageCredit: asText(row.image_credit ?? row.imageCredit) || undefined,
    sourceUrl: isSpecificHttpsSourceUrl(row.source_url ?? row.sourceUrl)
      ? asText(row.source_url ?? row.sourceUrl)
      : undefined,
    isDemo: row.is_demo === true,
    intakeMethod: row.intake_method === 'auto' ? 'auto' : 'manual',
    assessmentStatus: row.assessment_status === 'in_progress' ? 'in_progress' : 'complete',
  };
}

// --- Articles & Claims ---

export async function fetchArticles(): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*, claims(*, evidence_items(*)), locations(*)')
        .order('published_at', { ascending: false });
      if (error) {
        console.warn('Supabase article fetch failed; feed articles are unavailable.', error.message);
      }
      if (!error && data && data.length > 0) {
        const articles = data
          .map(mapArticle)
          .filter((article): article is Article => article !== undefined);
        if (articles.length > 0) {
          if (articles.length !== data.length) {
            console.warn('Ignoring articles with categories outside the current CivicLens taxonomy.', {
              ignoredCount: data.length - articles.length,
            });
          }
          return articles;
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed; feed articles are unavailable.', err);
    }
  }
  return localArticles;
}

export async function fetchArticleById(id: string): Promise<Article | undefined> {
  const articles = await fetchArticles();
  return articles.find((article) => article.id === id);
}

export function attachEvidenceToClaim(claimId: string, evidence: EvidenceItem): boolean {
  for (const article of localArticles) {
    const claim = article.claims.find((c) => c.id === claimId);
    if (claim) {
      claim.evidence = [evidence, ...claim.evidence];
      return true;
    }
  }
  return false;
}

// --- Citizen Reports & Incident Room ---

export async function fetchCitizenReports(): Promise<CitizenReport[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as unknown as CitizenReport[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local incidents.', err);
    }
  }
  return localReports;
}

export async function submitCitizenIncident(report: CitizenReport): Promise<boolean> {
  localReports = [report, ...localReports];

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('incidents').insert([
        {
          id: report.id,
          title: report.title,
          category: report.category,
          general_location: report.generalLocation,
          firsthand_observations: report.isFirsthandObservation
            ? [report.witnessSummary]
            : [],
          uncertainties: [report.uncertainties],
          author_pseudonym: report.authorPseudonym,
        },
      ]);
      if (error) {
        console.error('Failed to insert incident to Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase incident submission error:', err);
      return false;
    }
  }

  return true;
}

// --- Civic Questions ---

export async function fetchCivicQuestions(): Promise<CivicQuestion[]> {
  return localQuestions;
}
