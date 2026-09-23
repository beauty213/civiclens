// lib/mockData.ts
import { Article, CitizenReport, CivicQuestion } from '@/types';

export const INITIAL_LOCATION = {
  area: 'Gachibowli',
  district: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title: 'Bio-Divergent Lake Restoration Project Announced Across West Hyderabad',
    summary: 'Urban development authority approves a 5-lake revival project focusing on native wetland fauna and industrial run-off diversion.',
    content: [
      'The regional urban development board on Monday ratified a phased ecological restoration roadmap spanning five major water bodies in the western IT corridor.',
      'According to the preliminary briefing, the primary phase allocates municipal environmental funds toward intercepting raw effluent channels and introducing specialized bioswales along the lake peripheries.',
      'Officials asserted in the circular that groundwater replenishment rates in adjacent residential sectors are projected to increase by 35% within the first 12 months following completion.',
      'However, environmental engineers noted during public consultations that existing silt accumulation depths exceeding two meters remain unbudgeted under the first procurement phase.'
    ],
    sourceName: 'Telangana Urban Chronicle',
    author: 'Sunita Rao',
    publishedAt: '2026-09-22T08:30:00Z',
    category: 'Environment',
    location: {
      area: 'Gachibowli',
      district: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    claimsCount: 2,
    unresolvedQuestionsCount: 3,
    citizenReportsCount: 2,
    claims: [
      {
        id: 'clm-001',
        statement: 'Groundwater replenishment rates will increase by 35% within 12 months across adjacent residential sectors.',
        assessmentStatus: 'Needs verification',
        statusExplanation: 'The 35% projection is derived solely from an internal department estimate; no peer-reviewed hydrological model or baseline depth data has been publicly released.',
        sources: ['Urban Board Press Release Doc #ENV-2026-4', 'Municipal Planning Council Briefing'],
        evidence: [
          {
            id: 'ev-1',
            type: 'Official document',
            title: 'Municipal Urban Water Board Phase 1 Project Memorandum',
            publisherOrWitness: 'Urban Development Authority',
            date: '2026-09-15',
            relationshipToClaim: 'Asserts the target 35% metric without providing field runoff tests.'
          }
        ],
        conflictingInformation: 'Independent hydrologists argue existing hard-rock substrata and unremoved concrete runoff channels prevent rapid subterranean percolation within a 12-month horizon.',
        missingInformation: 'Seasonal monsoon intake projections, baseline subterranean monitoring borehole telemetry, and secondary silt excavation plans.',
        openQuestions: [
          'Which independent hydrological test verified the 35% recharge metric?',
          'How will desiltation be managed if silt accumulation exceeds two meters in phase one?'
        ]
      },
      {
        id: 'clm-002',
        statement: 'Industrial run-off channels will be completely diverted away from lake intake points prior to the monsoon season.',
        assessmentStatus: 'Supported with context',
        statusExplanation: 'Physical diversion canal blueprints have been submitted and civil contracts awarded, but statutory clearance for railway-crossing culverts is still pending.',
        sources: ['State Pollution Control Board Inspection Log', 'Municipal Engineering Division'],
        evidence: [
          {
            id: 'ev-2',
            type: 'Dataset',
            title: 'Industrial Corridor Inflow Analysis (June 2026)',
            publisherOrWitness: 'State Pollution Control Board',
            date: '2026-06-30',
            relationshipToClaim: 'Confirms 4 out of 6 identified illegal inflow pipes were sealed.'
          }
        ],
        missingInformation: 'Timeline for securing statutory right-of-way permissions for culvert construction beneath railway assets.',
        openQuestions: [
          'What is the contingency diversion plan if railway culvert clearances are delayed past May?'
        ]
      }
    ]
  },
  {
    id: 'art-002',
    title: 'Metro Rail Phase-3 Expansion Route Survey Completed',
    summary: 'The feasibility committee has finalized the proposed corridor connecting major tech hubs to regional transport terminals.',
    content: [
      'The Comprehensive Mobility Committee has finalized the route alignments for the Phase-3 Metro corridor traversing Gachibowli to Rajiv Gandhi International Airport.',
      'The feasibility report states that less than 5% private land will be required for station construction, relying predominantly on central median elevated pillars.'
    ],
    sourceName: 'Deccan Civic Post',
    author: 'K. V. Raman',
    publishedAt: '2026-09-22T14:15:00Z',
    category: 'Public Safety',
    location: {
      area: 'Madhapur',
      district: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    claimsCount: 1,
    unresolvedQuestionsCount: 2,
    citizenReportsCount: 4,
    claims: [
      {
        id: 'clm-101',
        statement: 'Less than 5% private commercial or residential land will need to be acquired for Phase-3 construction.',
        assessmentStatus: 'Conflicting reports',
        statusExplanation: 'Official report cites 4.8% based on station footings, but property association surveys count electrical transformer sub-stations and multi-level parking ramps that push acquisitions to 11%.',
        sources: ['Phase-3 Master Alignment Draft', 'Commercial Corridor Traders Union Survey'],
        evidence: [
          {
            id: 'ev-101',
            type: 'Official document',
            title: 'Elevated Corridor Land Requirement Matrix',
            publisherOrWitness: 'Metro Rail Corporation',
            date: '2026-08-10',
            relationshipToClaim: 'Details pylon locations along median easements.'
          }
        ],
        conflictingInformation: 'Local business associations claim side-road egress ramps are omitted from the 5% estimate.',
        missingInformation: 'Final designs for three major intermodal transfer stations.',
        openQuestions: [
          'Does the 5% acquisition figure include emergency egress routes and electrical step-down stations?'
        ]
      }
    ]
  }
];

export const MOCK_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'rep-101',
    title: 'Stormwater drain blockage causing waterlogging on Financial District Flyover link',
    generalLocation: 'Near Outer Ring Road Exit 19, Gachibowli',
    timestamp: '2 hours ago',
    category: 'Public Safety',
    isFirsthandObservation: true,
    witnessSummary: 'Water accumulated to approximately 8 inches following 40 minutes of rainfall. No official maintenance crew on-site as of 4:00 PM.',
    uncertainties: 'Unclear whether the municipal pump station downstream is functional or switched off.',
    evidenceProvided: true,
    authorPseudonym: 'LocalCommuter92',
  },
  {
    id: 'rep-102',
    title: 'Unscheduled transformer maintenance interrupting local street lights',
    generalLocation: 'Tarnaka Street 12 & 14 intersection',
    timestamp: '5 hours ago',
    category: 'Public Safety',
    isFirsthandObservation: true,
    witnessSummary: 'Three residential blocks without street illumination. Linemen were working on the ground transformer at 2 PM.',
    uncertainties: 'Duration of power shutoff for street lamps was not announced.',
    evidenceProvided: false,
    authorPseudonym: 'TarnakaResident',
  },
];

export const MOCK_QUESTIONS: CivicQuestion[] = [
  {
    id: 'q-201',
    targetClaim: 'Lake restoration will increase groundwater replenishment rates by 35% within 12 months.',
    questionText: 'Which independent hydrological study verified the 35% recharge metric given existing concrete silt barriers?',
    contextSource: 'Telangana Urban Chronicle',
    communityAnswersCount: 8,
  },
  {
    id: 'q-202',
    targetClaim: 'Metro Phase-3 will acquire less than 5% private land along the planned corridor.',
    questionText: 'Does the 5% land acquisition estimate include secondary feeder roads and electrical substations?',
    contextSource: 'Deccan Civic Post',
    communityAnswersCount: 14,
  },
];