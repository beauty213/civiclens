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

export type PublishIntent =
  | 'article'
  | 'witnessed'
  | 'saw'
  | 'ask'
  | 'opinion';

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
  sourceUrl?: string;
  publisherOrWitness: string;
  date: string;
  relationshipToClaim: string;
}

export interface Claim {
  id: string;
  statement: string;
  assessmentStatus: EvidenceStatus;
  statusExplanation: string;
  sources: string[];
  evidence: EvidenceItem[];
  conflictingInformation?: string;
  missingInformation?: string;
  openQuestions: string[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string[];
  sourceName: string;
  author: string;
  publishedAt: string;
  category: NewsCategory;
  location: LocationHierarchy;
  claimsCount: number;
  unresolvedQuestionsCount: number;
  citizenReportsCount: number;
  imageUrl?: string;
  claims?: Claim[];
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