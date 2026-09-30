import { Article } from '@/types';

import type { Claim, EvidenceItem, EvidenceStatus } from '@/types';

const CASE_DATE = '2026-09-30';
const CASE_DISCLOSURE = 'Illustrative case study based on the supplied brief. No primary-source URL was provided; this material has not been independently verified.';

function makeEvidence(id: string, title: string, type: EvidenceItem['type'], provenanceNote: string): EvidenceItem {
  return {
    id,
    type,
    title,
    description: 'Source described in the case-study brief; a public record link was not supplied.',
    date: CASE_DATE,
    uploaderPseudonym: 'CivicLens Case Study',
    provenanceNote: `${provenanceNote} ${CASE_DISCLOSURE}`,
    isDemo: true,
    isVerified: false,
  };
}

function makeClaim(
  id: string,
  orderIndex: number,
  claimText: string,
  speakerOrSource: string,
  status: EvidenceStatus,
  weight: number,
  evidenceTitle: string,
  evidenceType: EvidenceItem['type'],
  statusExplanation: string,
  additionalEvidence: Array<{ id: string; title: string; type: EvidenceItem['type'] }> = [],
): Claim {
  return {
    id,
    orderIndex,
    claimText,
    extractedQuote: claimText,
    speakerOrSource,
    status,
    weight,
    statusExplanation: `${statusExplanation} ${CASE_DISCLOSURE}`,
    evidence: [
      makeEvidence(id.replace(/^c/, 'e'), evidenceTitle, evidenceType, 'Provisional evidence entry.'),
      ...additionalEvidence.map((item) => makeEvidence(item.id, item.title, item.type, 'Provisional evidence entry.')),
    ],
    missingInformation: ['Specific public source URL and the underlying primary record.'],
    generatedQuestions: [],
  };
}

export const CIVICLENS_CASE_STUDIES: Article[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000101',
    title: 'Podium vs. Market: Did the Silver Medalist Sign 4x More Brand Contracts Than the Gold Medalist?',
    summary: 'An investigation into brand sponsorship disparities following the Olympic finals, tracking social media engagement spikes, broadcast airtime, and verified brand disclosure filings.',
    bodyParagraphs: [
      'This illustrative case study examines a proposed comparison of Olympic medalists\' endorsement counts, broadcast attention, and prize payments.',
      CASE_DISCLOSURE,
    ],
    sourceName: 'CivicLens Case Study (Illustrative)',
    author: 'CivicLens Desk',
    publishedAt: '2026-09-30T00:00:00Z',
    category: 'Sports & Media Ethics',
    location: { area: 'National Sports Bureau', district: 'National', state: 'India', country: 'India' },
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Illustrative athletics image; not a photograph of the case-study subjects.',
    imageCredit: 'Unsplash (illustrative)',
    claimsCount: 3,
    unresolvedQuestionsCount: 3,
    citizenReportsCount: 0,
    isDemo: true,
    assessmentStatus: 'in_progress',
    claims: [
      makeClaim('c0000000-0000-4000-8000-000000000101', 0, 'Silver medalist signed 14 commercial endorsements within 30 days of the finals, while the Gold medalist signed 3.', 'ASCI corporate brand registry and press disclosures', 'Well-supported', 1.0, 'ASCI corporate brand registry and press disclosures', 'official_record', 'Provisional tier supplied in the brief; the registry entry and disclosures are not linked.'),
      makeClaim('c0000000-0000-4000-8000-000000000102', 1, 'National sports broadcast allocated 78% more prime-time homecoming coverage to the Silver medalist.', 'Independent broadcast media monitoring logs', 'Supported with context', 0.75, 'Prime-time homecoming monitoring logs', 'expert_analysis', 'Provisional tier supplied in the brief; the monitoring logs and airport-arrival context are not linked.'),
      makeClaim('c0000000-0000-4000-8000-000000000103', 2, 'State Ministry withheld cash prize allocations from the Gold medalist due to sponsorship conflicts.', 'Ministry of Youth Affairs public treasury circular', 'Contradicted by available evidence', 0.0, 'Ministry of Youth Affairs public treasury circular', 'official_record', 'Provisional tier supplied in the brief; no treasury circular or payment record was linked.'),
    ],
  },
  {
    id: 'a0000000-0000-4000-8000-000000000102',
    title: 'Flyover Structural Emergency: Expansion Joint Maintenance or Concrete Fracture Panic?',
    summary: 'Viral video forwards claimed a major flyover was facing imminent collapse, triggering morning traffic chaos. Municipal inspections reveal scheduled elastomer joint replacements.',
    bodyParagraphs: [
      'This illustrative case study contrasts a viral structural-emergency claim with the maintenance and traffic details described in the supplied brief.',
      CASE_DISCLOSURE,
    ],
    sourceName: 'CivicLens Case Study (Illustrative)',
    author: 'CivicLens Desk',
    publishedAt: '2026-09-29T23:00:00Z',
    category: 'Municipal Infrastructure',
    location: { area: 'Outer Ring Road Corridor', district: 'Hyderabad', state: 'Telangana', country: 'India' },
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Illustrative roadway image; not a photograph of the flyover in the case study.',
    imageCredit: 'Unsplash (illustrative)',
    claimsCount: 3,
    unresolvedQuestionsCount: 3,
    citizenReportsCount: 0,
    isDemo: true,
    assessmentStatus: 'in_progress',
    claims: [
      makeClaim('c0000000-0000-4000-8000-000000000104', 0, 'Flyover deck experienced major structural concrete fracture halting transit.', 'Municipal Development Authority Structural Inspection Report #GHMC-402/2026', 'Contradicted by available evidence', 0.0, 'Structural Inspection Report #GHMC-402/2026', 'official_record', 'Provisional tier supplied in the brief; the inspection report was not linked.'),
      makeClaim('c0000000-0000-4000-8000-000000000105', 1, 'Traffic was diverted without advance public advisory.', 'Traffic Police alert described in the brief', 'Supported with context', 0.75, 'Traffic Police alert logged at 05:30 AM', 'official_record', 'Provisional tier supplied in the brief; the alert and barricade timeline were not linked.'),
      makeClaim('c0000000-0000-4000-8000-000000000106', 2, 'Contractor was penalized for sub-standard asphalt re-layering.', 'Internal vigilance inquiry described in the brief', 'Needs verification', 0.4, 'Internal vigilance inquiry', 'official_record', 'Provisional tier supplied in the brief; no final penalty circular was linked.'),
    ],
  },
  {
    id: 'a0000000-0000-4000-8000-000000000103',
    title: 'Urban Lake Contamination: Industrial Effluent Leak vs. Natural Algal Bloom',
    summary: 'Citizen complaints of discolored tap water and foam build-up prompt conflicting accounts between local resident welfare associations and pollution control board findings.',
    bodyParagraphs: [
      'This illustrative case study examines a proposed water-quality dispute involving sensor readings, industrial discharge, citizen reports, and distribution-pipeline isolation.',
      CASE_DISCLOSURE,
    ],
    sourceName: 'CivicLens Case Study (Illustrative)',
    author: 'CivicLens Desk',
    publishedAt: '2026-09-29T22:00:00Z',
    category: 'Public Health & Environment',
    location: { area: 'Lake Water Basin', district: 'Hyderabad', state: 'Telangana', country: 'India' },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    imageCaption: 'Illustrative water image; not a photograph of the lake in the case study.',
    imageCredit: 'Unsplash (illustrative)',
    claimsCount: 3,
    unresolvedQuestionsCount: 3,
    citizenReportsCount: 0,
    isDemo: true,
    assessmentStatus: 'in_progress',
    claims: [
      makeClaim('c0000000-0000-4000-8000-000000000107', 0, 'Dissolved oxygen levels dropped below 2.0 mg/L along eastern inlets.', 'State Pollution Control Board Daily Water Sensor Telemetry Logs', 'Well-supported', 1.0, 'Daily Water Sensor Telemetry Logs', 'sensor_log', 'Provisional tier supplied in the brief; telemetry logs were not linked.'),
      makeClaim('c0000000-0000-4000-8000-000000000108', 1, 'Chemical plant directly breached zero-liquid discharge regulations.', 'Industrial Inspector audit and citizen drone footage', 'Conflicting reports', 0.2, 'Industrial Inspector audit', 'official_record', 'Provisional tier supplied in the brief; neither the audit nor footage was linked.', [
        { id: 'e0000000-0000-4000-8000-000000000110', title: 'Citizen drone footage of runoff canal', type: 'eyewitness_account' },
      ]),
      makeClaim('c0000000-0000-4000-8000-000000000109', 2, 'Drinking water distribution mains are isolated from lake seepage.', 'Water Supply & Sewerage Board Pipeline Pressure Manifest', 'Well-supported', 1.0, 'Pipeline Pressure Manifest', 'official_record', 'Provisional tier supplied in the brief; the pipeline manifest was not linked.'),
    ],
  },
];

export const SPORTS_CONTRAST_ARTICLE = CIVICLENS_CASE_STUDIES[0];
