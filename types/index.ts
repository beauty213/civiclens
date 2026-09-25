// types/index.ts

export type GeographicScope = 'Area' | 'District' | 'State' | 'Country' | 'World';

export type PublishIntent =
  | 'witnessed'
  | 'saw'
  | 'ask'
  | 'article'
  | 'opinion'
  | 'write_article'
  | 'witnessed_something'
  | 'ask_community'
  | 'share_opinion';

export type NewsCategory =
  | 'Politics'
  | 'Education'
  | 'Technology'
  | 'Business'
  | 'Environment'
  | 'Science'
  | 'Sports'
  | 'Sports & Media Ethics'
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

export type CommentCategory =
  | 'Opinion'
  | 'Question'
  | 'Evidence'
  | 'Firsthand experience'
  | 'Correction';

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

export interface ClaimComment {
  id: string;
  claimId: string;
  category: CommentCategory;
  authorPseudonym: string;
  content: string;
  timestamp: string;
  upvotes: number;
  attachedEvidenceTitle?: string;
}

export interface ClaimDiscussionSummary {
  commonPoints: string[];
  differentAccounts: string[];
  evidenceShared: string[];
  unansweredQuestions: string[];
}

export interface ArticleCorrection {
  id: string;
  timestamp: string;
  originalText: string;
  correctedText: string;
  reason: string;
  editorNote: string;
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
  comments?: ClaimComment[];
  discussionSummary?: ClaimDiscussionSummary;
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
  bodyParagraphs?: string[];
  content?: string[];
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
  corrections?: ArticleCorrection[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface WitnessAccount {
  id: string;
  witnessPseudonym: string;
  timestamp: string;
  distanceFromEvent: string;
  directlyObserved: string;
  unconfirmedOrHearsay: string;
  statedUncertainty: string;
}

export interface WitnessSynthesis {
  commonDetails: string[];
  differentDetails: string[];
  conflictingAccounts: string[];
  unknownDetails: string[];
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
  witnesses?: WitnessAccount[];
  witnessSynthesis?: WitnessSynthesis;
}

export interface CivicQuestion {
  id: string;
  targetClaim: string;
  questionText: string;
  contextSource: string;
  communityAnswersCount: number;
}
