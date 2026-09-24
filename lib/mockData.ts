// lib/mockData.ts
import { Article, CitizenReport, CivicQuestion } from '@/types';

export const INITIAL_LOCATION = {
  area: 'Gachibowli',
  district: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
};

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
    witnesses: [
      {
        id: 'w-1',
        witnessPseudonym: 'LocalCommuter92',
        timestamp: '4:10 PM',
        distanceFromEvent: 'Directly on road (vehicle stopped in queue)',
        directlyObserved: 'Water rising up to tire rims near the flyover ingress ramp. Storm grating completely covered in wet plastic sheets and construction gravel.',
        unconfirmedOrHearsay: 'Another driver rolled down their window and said a pump 500m ahead broke down.',
        statedUncertainty: 'Do not know whether the drainage department was formally dispatched.'
      },
      {
        id: 'w-2',
        witnessPseudonym: 'Pedestrian_Gbl_4',
        timestamp: '4:25 PM',
        distanceFromEvent: 'Walking on elevated service footpath (15 meters away)',
        directlyObserved: 'Water overflow originating specifically from the secondary culvert grille. Two traffic police personnel arrived on motorcycles to divert cars to the middle lane.',
        unconfirmedOrHearsay: 'Security guard from nearby commercial complex mentioned trenching work began this morning.',
        statedUncertainty: 'Unsure whether water is receding or continuing to build up from upstream.'
      },
      {
        id: 'w-3',
        witnessPseudonym: 'ShopOwner_WiproJunction',
        timestamp: '4:40 PM',
        distanceFromEvent: 'Storefront facing the junction (40 meters away)',
        directlyObserved: 'Traffic backed up approximately 1.2 kilometers toward the main junction. Municipal JCB excavator arrived on the service road at 4:35 PM.',
        unconfirmedOrHearsay: 'Heard someone say water was shut off at the sector pump.',
        statedUncertainty: 'Could not see if the JCB started excavation work or just parked.'
      }
    ],
    witnessSynthesis: {
      commonDetails: [
        'Water depth reached 6–8 inches near the flyover ingress between 4:00 PM and 4:30 PM.',
        'Stormwater grates were obstructed by accumulated debris and silt.',
        'Traffic was throttled to a single passable lane.'
      ],
      differentDetails: [
        'Witness #2 identified secondary culvert as origin point and saw traffic police arrive.',
        'Witness #3 observed arrival of municipal JCB excavator at 4:35 PM.'
      ],
      conflictingAccounts: [
        'Witness #1 was told the pump broke down; Witness #3 heard the pump was intentionally shut off.'
      ],
      unknownDetails: [
        'Whether an emergency repair crew began active trench clearing before 5:00 PM.',
        'Status of the downstream discharge sluice.'
      ]
    }
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
    corrections: [
      {
        id: 'cor-01',
        timestamp: 'September 22, 2026 · 11:45 AM',
        originalText: '...targeting four interconnected water bodies in the western IT corridor...',
        correctedText: '...targeting five interconnected water bodies in the western IT corridor...',
        reason: 'Typographical omission in initial authority press handout.',
        editorNote: 'Corrected to reflect inclusion of the Nanakramguda retention pond as the fifth site.'
      }
    ],
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
        ],
        discussionSummary: {
          commonPoints: [
            'All participants agree gravel wetlands help reduce organic sludge.',
            'General consensus that baseline water testing must be open to the public.'
          ],
          differentAccounts: [
            'One local resident observed direct industrial tanker dumping at night.',
            'Another resident noted stormwater lines are frequently clogged with building rubble.'
          ],
          evidenceShared: [
            'RTI filing copy for Ward 104 storm runoff schematics.',
            'Geotagged photos of concrete debris near the inflow sluice.'
          ],
          unansweredQuestions: [
            'Who will pay for maintenance after the initial two-year vendor contract expires?'
          ]
        },
        comments: [
          {
            id: 'c-1',
            claimId: 'claim-101',
            category: 'Firsthand experience',
            authorPseudonym: 'WiproCircleResident',
            content: 'I run past this lake daily at 6 AM. The smell of petroleum distillate has been pungent since late August. The storm drain near the north culvert is visibly stained black.',
            timestamp: '3 hours ago',
            upvotes: 14
          }
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
      }
    ],
    comparison: {
      commonAgreedFacts: [
        'Five water bodies in West Hyderabad are slated for rejuvenation.',
        'Sub-surface gravel wetland beds will be used for biological filtering.'
      ],
      divergentDetails: [
        'Telangana Urban Chronicle claims water clarity will improve 90% by month 6; Deccan Financial states month 12 minimum.'
      ],
      sources: [
        {
          sourceName: 'Telangana Urban Chronicle',
          authorOrEntity: 'Sunita Rao',
          publicationDate: 'Sept 22, 2026',
          headline: 'Bio-Divergent Lake Restoration Project Announced Across West Hyderabad',
          keyClaimsHighlighted: ['35% groundwater recharge increase.'],
          omittedOrUnmentioned: ['Contractor penalty clauses.'],
          framingFocus: 'Ecological revitalization & modernization.'
        }
      ]
    }
  }
];

export const MOCK_QUESTIONS: CivicQuestion[] = [
  {
    id: 'q-201',
    targetClaim: 'Lake restoration will increase groundwater replenishment rates by 35% within 12 months.',
    questionText: 'Which independent hydrological study verified the 35% recharge metric given existing concrete silt barriers?',
    contextSource: 'Telangana Urban Chronicle',
    communityAnswersCount: 8,
  }
];
