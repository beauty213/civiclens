// types/index.ts

export type GeographicScope = 'Area' | 'District' | 'State' | 'Country' | 'World';

export type NewsCategory =
  | 'Politics'
  | 'Education'
  | 'Technology'
  | 'Business'
  | 'Environment'
  | 'Science'
  | 'Sports'
  | 'Culture'
  | 'Public Safety'
  | 'Health'
  | 'Other';

export type EvidenceStatus =
  | 'Well-supported'
  | 'Supported with context'
  | 'Needs verification'
  | 'Conflicting reports'
  | 'Insufficient evidence'
  | 'Contradicted by available evidence';

export type EvidenceType =
  | 'Official document'
  | 'News source'
  | 'External source'
  | 'Photo'
  | 'Video'
  | 'Dataset'
  | 'Firsthand account';

export type TimelineStage =
  | 'Initial report'
  | 'Official statement'
  | 'New information'
  | 'Investigation update'
  | 'Correction'
  | 'Latest update';

export interface LocationHierarchy {
  area: string;
  district: string;
  state: string;
  country: string;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  sourceUrl?: string;
  date: string;
  uploaderPseudonym: string;
  provenanceNote: string;
}

export interface Claim {
  id: string;
  claimText: string;
  speakerOrSource: string;
  status: EvidenceStatus;
  statusExplanation: string;
  evidence: EvidenceItem[];
  missingInformation: string[];
  conflictingReports?: string;
  generatedQuestions: string[];
}

export interface TimelineMilestone {
  id: string;
  time: string;
  stage: TimelineStage;
  title: string;
  summary: string;
  sourceOrEntity: string;
  wasClarifiedOrCorrected?: boolean;
}

export interface SourceComparisonItem {
  sourceName: string;
  authorOrEntity: string;
  publicationDate: string;
  headline: string;
  keyClaimsHighlighted: string[];
  omittedOrUnmentioned: string[];
  framingFocus: string;
}

export interface StoryComparison {
  commonAgreedFacts: string[];
  divergentDetails: string[];
  sources: SourceComparisonItem[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  bodyParagraphs: string[];
  sourceName: string;
  author: string;
  publishedAt: string;
  category: NewsCategory;
  location: LocationHierarchy;
  claimsCount: number;
  unresolvedQuestionsCount: number;
  citizenReportsCount: number;
  claims: Claim[];
  timeline?: TimelineMilestone[];
  comparison?: StoryComparison;
}

export interface CitizenReport {
  id: string;
  title: string;
  generalLocation: string;
  timestamp: string;
  category: NewsCategory;
  isFirsthandObservation: boolean;
  witnessSummary: string;
  uncertainties: string;
  evidenceProvided: boolean;
  authorPseudonym: string;
}

export interface CivicQuestion {
  id: string;
  targetClaim: string;
  questionText: string;
  contextSource: string;
  communityAnswersCount: number;
}
