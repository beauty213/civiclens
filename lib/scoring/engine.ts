import { Claim, EvidenceStatus } from '@/types';

export interface ScoreWeights {
  'Well-supported': number;
  'Supported with context': number;
  'Needs verification': number;
  'Conflicting reports': number;
  'Insufficient evidence': number;
  'Contradicted by available evidence': number;
}

export const TIER_WEIGHTS: ScoreWeights = {
  'Well-supported': 1.0,
  'Supported with context': 0.75,
  'Needs verification': 0.40,
  'Conflicting reports': 0.20,
  'Insufficient evidence': 0.15,
  'Contradicted by available evidence': 0.0,
};

export type CivicAdvisoryGrade =
  | 'High Evidentiary Grounding'
  | 'Moderate Grounding (Context Needed)'
  | 'Unverified / Preliminary'
  | 'High Contradiction Risk'
  | 'No Testable Claims';

export interface ClaimTally {
  tier: EvidenceStatus;
  count: number;
  percentage: number;
}

export interface ForensicScoreResult {
  score: number; // 0 to 100
  grade: CivicAdvisoryGrade;
  colorClass: string;
  totalClaims: number;
  verifiedCount: number;
  unverifiedCount: number;
  contradictedCount: number;
  distribution: Record<EvidenceStatus, ClaimTally>;
  recommendation: string;
}

/**
 * Computes an aggregate forensic accountability score for an article based on its claims.
 */
export function computeArticleScore(claims: Claim[] = []): ForensicScoreResult {
  const totalClaims = claims.length;

  const initialTally: Record<EvidenceStatus, number> = {
    'Well-supported': 0,
    'Supported with context': 0,
    'Needs verification': 0,
    'Conflicting reports': 0,
    'Insufficient evidence': 0,
    'Contradicted by available evidence': 0,
  };

  if (totalClaims === 0) {
    return {
      score: 50,
      grade: 'No Testable Claims',
      colorClass: 'text-zinc-400 border-zinc-700 bg-zinc-800/40',
      totalClaims: 0,
      verifiedCount: 0,
      unverifiedCount: 0,
      contradictedCount: 0,
      distribution: Object.entries(initialTally).reduce((acc, [k, v]) => {
        acc[k as EvidenceStatus] = { tier: k as EvidenceStatus, count: v, percentage: 0 };
        return acc;
      }, {} as Record<EvidenceStatus, ClaimTally>),
      recommendation: 'This report does not contain discrete, empirical claims isolated for verification.',
    };
  }

  // Count claims per tier
  claims.forEach((c) => {
    if (c.status in initialTally) {
      initialTally[c.status]++;
    } else {
      initialTally['Needs verification']++;
    }
  });

  // Calculate weighted sum
  let weightedScoreSum = 0;
  for (const [tier, count] of Object.entries(initialTally)) {
    const weight = TIER_WEIGHTS[tier as EvidenceStatus] ?? 0.3;
    weightedScoreSum += count * weight;
  }

  const rawScore = Math.round((weightedScoreSum / totalClaims) * 100);
  const score = Math.max(0, Math.min(100, rawScore));

  const verifiedCount = initialTally['Well-supported'] + initialTally['Supported with context'];
  const unverifiedCount = initialTally['Needs verification'] + initialTally['Insufficient evidence'];
  const contradictedCount = initialTally['Conflicting reports'] + initialTally['Contradicted by available evidence'];

  // Assign civic advisory grades
  let grade: CivicAdvisoryGrade = 'Moderate Grounding (Context Needed)';
  let colorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  let recommendation = 'Key claims require supplementary official records before treating as settled fact.';

  if (contradictedCount > totalClaims / 3 || score < 30) {
    grade = 'High Contradiction Risk';
    colorClass = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    recommendation = 'Multiple assertions conflict with public documentation or lack foundational proof.';
  } else if (score >= 75) {
    grade = 'High Evidentiary Grounding';
    colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    recommendation = 'Strong documentation backing primary assertions via gazette records or research.';
  } else if (unverifiedCount >= totalClaims * 0.6) {
    grade = 'Unverified / Preliminary';
    colorClass = 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    recommendation = 'Assertions remain speculative; awaiting primary audit reports or municipal disclosures.';
  }

  // Distribution breakdown
  const distribution = Object.entries(initialTally).reduce((acc, [k, v]) => {
    acc[k as EvidenceStatus] = {
      tier: k as EvidenceStatus,
      count: v,
      percentage: Math.round((v / totalClaims) * 100),
    };
    return acc;
  }, {} as Record<EvidenceStatus, ClaimTally>);

  return {
    score,
    grade,
    colorClass,
    totalClaims,
    verifiedCount,
    unverifiedCount,
    contradictedCount,
    distribution,
    recommendation,
  };
}
