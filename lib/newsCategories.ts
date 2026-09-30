import type { NewsCategory } from '@/types';

export const CIVIC_NEWS_CATEGORIES = [
  'Politics',
  'Education',
  'Business',
  'Environment',
  'Public Safety',
  'Health',
  'High Hoax Risk',
  'Sports & Media Ethics',
  'Municipal Infrastructure',
  'Public Health & Environment',
] as const satisfies readonly NewsCategory[];

export type CivicNewsCategory = typeof CIVIC_NEWS_CATEGORIES[number];

export function isCivicNewsCategory(value: unknown): value is CivicNewsCategory {
  return typeof value === 'string' &&
    CIVIC_NEWS_CATEGORIES.some((category) => category === value);
}
