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
    claimsCount: 4,
    unresolvedQuestionsCount: 3,
    citizenReportsCount: 2,
  },
  {
    id: 'art-002',
    title: 'Metro Rail Phase-3 Expansion Route Survey Completed',
    summary: 'The feasibility committee has finalized the proposed corridor connecting major tech hubs to regional transport terminals.',
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
    claimsCount: 6,
    unresolvedQuestionsCount: 5,
    citizenReportsCount: 7,
  },
  {
    id: 'art-003',
    title: 'National Quantum Telecommunications Testbed Hits Milestone',
    summary: 'Researchers demonstrate a 150-kilometer secure entanglement link over commercial fiber infrastructure.',
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
    claimsCount: 5,
    unresolvedQuestionsCount: 2,
    citizenReportsCount: 0,
  },
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