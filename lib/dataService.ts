// lib/dataService.ts
import { Article, CitizenReport, CivicQuestion, ClaimComment } from '@/types';
import { MOCK_ARTICLES, MOCK_CITIZEN_REPORTS, MOCK_QUESTIONS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase/client';

// In-memory working cache for session persistence when Supabase credentials are absent
let localArticles: Article[] = [...MOCK_ARTICLES];
let localReports: CitizenReport[] = [...MOCK_CITIZEN_REPORTS];
let localQuestions: CivicQuestion[] = [...MOCK_QUESTIONS];

// --- Articles & Claims ---

export async function fetchArticles(): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*, claims(*), locations(*)');
      if (!error && data && data.length > 0) {
        return data as unknown as Article[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local dataset.', err);
    }
  }
  return localArticles;
}

export async function fetchArticleById(id: string): Promise<Article | undefined> {
  const articles = await fetchArticles();
  return articles.find((a) => a.id === id) || localArticles[0];
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
  // Always update in-memory session cache immediately
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
