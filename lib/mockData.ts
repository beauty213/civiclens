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
    bodyParagraphs: [
      'The Regional Urban Development Authority on Tuesday confirmed the formal approval of a multi-crore ecological rehabilitation plan targeting five interconnected water bodies in the western IT corridor.',
      'According to municipal engineers, the project will implement sub-surface wetland filtration beds and reroute untreated greywater channels away from lake perimeters. Officials state this will eliminate industrial hydrocarbon traces within six months.',
      'A key component of the plan highlights a projected 35% increase in local groundwater recharge rates within the first year of operation, relying primarily on desiltation along peripheral retention zones.',
      'However, environmental hydrologists have raised questions regarding the lack of published baseline soil porosity tests and have pointed out that rapid commercial construction upstream could restrict the natural inflow channels necessary for sustained seasonal flushing.'
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
    claimsCount: 3,
    unresolvedQuestionsCount: 4,
    citizenReportsCount: 2,
    claims: [
      {
        id: 'claim-101',
        claimText: 'Sub-surface filtration beds will eliminate industrial hydrocarbon traces from the lake water within six months.',
        speakerOrSource: 'Municipal Project Lead Engineer',
        status: 'Needs verification',
        statusExplanation: 'While sub-surface constructed wetlands can remediate organic waste and moderate hydrocarbons, the published tender does not cite hydrological pilot studies or hydrocarbon saturation thresholds for the chosen filtration volume.',
        evidence: [
          {
            id: 'ev-1',
            type: 'Official document',
            title: 'Urban Water Quality Feasibility Tender #409',
            description: 'Tender specification detailing gravel bed depth and phytoremediation plant species selection.',
            sourceUrl: 'https://example.gov.in/tenders/409',
            date: '2026-08-14',
            uploaderPseudonym: 'CivicAuditor',
            provenanceNote: 'Published in official municipal gazette archives.'
          }
        ],
        missingInformation: [
          'Pre-restoration hydrocarbon baseline concentration data (PPM measurements).',
          'Independent chemical analysis of existing runoff channels.'
        ],
        conflictingReports: 'Independent research papers from Osmania University Civil Engineering indicate heavy metal sedimentation may impede microbial remediation.',
        generatedQuestions: [
          'What is the maximum flow capacity the filtration beds can treat during peak monsoon surges?',
          'What independent laboratory will verify the water quality metrics at the 3-month mark?'
        ]
      },
      {
        id: 'claim-102',
        claimText: 'The project will increase groundwater replenishment rates by 35% within 12 months.',
        speakerOrSource: 'Authority Press Briefing',
        status: 'Insufficient evidence',
        statusExplanation: 'The 35% estimate assumes uninhibited catchment inflow. Upstream concrete storm drains and commercial encroachment around feeder lines are not accounted for in the public assessment report.',
        evidence: [
          {
            id: 'ev-2',
            type: 'Dataset',
            title: 'West Corridor Catchment Hydro-Geological Survey 2024',
            description: 'Historical soil infiltration rate mapping showing sub-surface basalt layers.',
            date: '2024-11-10',
            uploaderPseudonym: 'HydrologyFellow',
            provenanceNote: 'Extracted from regional groundwater department open dataset portal.'
          }
        ],
        missingInformation: [
          'Mathematical modeling demonstrating how 35% recharge is attained with concrete catchment borders.',
          'Identities of the consulting hydrologists who drafted the projection.'
        ],
        generatedQuestions: [
          'Does the 35% calculation take into account recent concrete paved areas built in the last two years?',
          'Are piezometer wells installed around the lake perimeter to measure continuous ground table fluctuations?'
        ]
      },
      {
        id: 'claim-103',
        claimText: 'No residential or commercial properties within 500 meters will experience water supply interruptions during trenching.',
        speakerOrSource: 'Zonal Project Director',
        status: 'Supported with context',
        statusExplanation: 'The planned pipe bypass bypasses main supply trunk lines; however, secondary connection lines in nearby residential pockets may require intermittent pressure throttling during tie-in periods.',
        evidence: [
          {
            id: 'ev-3',
            type: 'Official document',
            title: 'Pipeline Utility Corridor Blueprint Rev 2',
            description: 'Schematic routing of the diversion line along the western service lane.',
            date: '2026-09-01',
            uploaderPseudonym: 'UrbanPlanWatch',
            provenanceNote: 'Retrieved via municipal Right to Information disclosure.'
          }
        ],
        missingInformation: [
          'Schedule of scheduled water valve switchovers for sectors 4 and 5.'
        ],
        generatedQuestions: [
          'Has an emergency water tanker contingent been allocated for adjacent colonies during cut-over work?'
        ]
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        time: 'August 14, 2026',
        stage: 'Initial report',
        title: 'Tender floated for 5-lake rejuvenation',
        summary: 'Preliminary proposal submitted by civic planning body citing wetland filtration for IT-corridor water reservoirs.',
        sourceOrEntity: 'Municipal Gazette Notification',
        wasClarifiedOrCorrected: false,
      },
      {
        id: 'tl-2',
        time: 'September 02, 2026',
        stage: 'Official statement',
        title: 'Projected 35% groundwater recharge announced',
        summary: 'Urban authority holds public presentation claiming 35% recharge increase within 12 months.',
        sourceOrEntity: 'Press Briefing by Urban Development Secretary',
        wasClarifiedOrCorrected: false,
      },
      {
        id: 'tl-3',
        time: 'September 12, 2026',
        stage: 'New information',
        title: 'Hydrology researchers question inflow channel blockage',
        summary: 'Civil engineering team issues open letter highlighting concrete construction blocks natural storm feeders.',
        sourceOrEntity: 'Independent Hydrological Working Group',
        wasClarifiedOrCorrected: false,
      },
      {
        id: 'tl-4',
        time: 'September 22, 2026',
        stage: 'Latest update',
        title: 'Formal project approval with revised monitoring wells',
        summary: 'Board approves budget allocation while agreeing to install continuous water monitoring stations.',
        sourceOrEntity: 'Authority Board Resolution',
        wasClarifiedOrCorrected: false,
      },
    ],
    comparison: {
      commonAgreedFacts: [
        'Five water bodies in West Hyderabad are slated for rejuvenation.',
        'Sub-surface gravel wetland beds will be used for biological filtering.',
        'Initial budget allocation has passed formal committee approval.',
      ],
      divergentDetails: [
        'Telangana Urban Chronicle claims water clarity will improve 90% by month 6; Deccan Financial states month 12 minimum.',
        'Daily Regional asserts full municipal funding; State Tribune notes 40% will rely on commercial CSR infrastructure grants.',
      ],
      sources: [
        {
          sourceName: 'Telangana Urban Chronicle',
          authorOrEntity: 'Sunita Rao',
          publicationDate: 'Sept 22, 2026',
          headline: 'Bio-Divergent Lake Restoration Project Announced Across West Hyderabad',
          keyClaimsHighlighted: [
            '35% groundwater recharge increase.',
            'Complete hydrocarbon elimination within 6 months.',
          ],
          omittedOrUnmentioned: [
            'Details on contractor penalty clauses for missed milestone dates.',
            'Upstream concrete catchment bottlenecks.',
          ],
          framingFocus: 'Ecological revitalization & municipal technological modernization.',
        },
        {
          sourceName: 'Deccan Financial Daily',
          authorOrEntity: 'P. Narasimhan',
          publicationDate: 'Sept 22, 2026',
          headline: 'Rs 120-Cr Corridor Wetland Rejuvenation Plan Cleared; Funding Mix Scrutinized',
          keyClaimsHighlighted: [
            '40% of financing depends on private sector tech park CSR partnerships.',
            'Trenching and diversion will require secondary utility realignment.',
          ],
          omittedOrUnmentioned: [
            'Specific plant species chosen for phytoremediation.',
          ],
          framingFocus: 'Capital expenditure, commercial viability, and vendor delivery timelines.',
        },
        {
          sourceName: 'Citizen Observation Dispatch',
          authorOrEntity: 'HydWaterWatch (Local Collective)',
          publicationDate: 'Sept 23, 2026',
          headline: 'Field Survey: Upstream Inflow Blockages Remain Unaddressed Around Lake #2',
          keyClaimsHighlighted: [
            'Three primary stormwater channels are currently filled with construction rubble.',
            'Current natural flow has dropped by half since road widening began.',
          ],
          omittedOrUnmentioned: [
            'Overall governmental budget figures.',
          ],
          framingFocus: 'Ground-level physical barriers and catchment conditions on-site.',
        },
      ],
    },
  },
  {
    id: 'art-002',
    title: 'Metro Rail Phase-3 Expansion Route Survey Completed',
    summary: 'The feasibility committee has finalized the proposed corridor connecting major tech hubs to regional transport terminals.',
    bodyParagraphs: [
      'Survey teams concluded the spatial transit mapping for the 31-kilometer metro extension project.',
      'Officials state the new alignment will optimize commuter travel times by 40 minutes between terminal nodes while minimizing disruption to core traffic lanes.'
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
    claimsCount: 2,
    unresolvedQuestionsCount: 2,
    citizenReportsCount: 7,
    claims: []
  },
  {
    id: 'art-003',
    title: 'National Quantum Telecommunications Testbed Hits Milestone',
    summary: 'Researchers demonstrate a 150-kilometer secure entanglement link over commercial fiber infrastructure.',
    bodyParagraphs: [
      'A multi-institutional consortium announced continuous quantum key distribution over existing telco fiber lines.',
      'The team reported low quantum bit error rates despite daytime thermal expansion and mechanical vibration along the highway route.'
    ],
    sourceName: 'National Science Wire',
    author: 'A. Bhattacharya',
    publishedAt: '2026-09-21T19:00:00Z',
    category: 'Science',
    location: {
      area: 'Regional Hub',
      district: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
    claimsCount: 1,
    unresolvedQuestionsCount: 1,
    citizenReportsCount: 0,
    claims: []
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
