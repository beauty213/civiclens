'use client';

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, Filter, GraduationCap, HeartPulse, Layers3, Shield, Trees } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Article } from '@/types';
import { StoryCard } from '@/components/news/StoryCard';
import { CIVIC_NEWS_CATEGORIES, CivicNewsCategory, isCivicNewsCategory } from '@/lib/newsCategories';

type PulseFilter = 'all' | CivicNewsCategory;

const CATEGORY_ICONS: Record<CivicNewsCategory, LucideIcon> = {
  Politics: Shield,
  Education: GraduationCap,
  Business: BriefcaseBusiness,
  Environment: Trees,
  'Public Safety': Shield,
  Health: HeartPulse,
  'High Hoax Risk': Layers3,
};

const FILTERS: Array<{ id: PulseFilter; label: string; icon: LucideIcon }> = [
  { id: 'all', label: 'All Articles', icon: Layers3 },
  ...CIVIC_NEWS_CATEGORIES.map((category) => ({
    id: category,
    label: category,
    icon: CATEGORY_ICONS[category],
  })),
];

export function StoryPulseFilters({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState<PulseFilter>('all');
  const visibleArticles = useMemo(() => articles.filter((article) => {
    return isCivicNewsCategory(article.category) &&
      (activeFilter === 'all' || article.category === activeFilter);
  }), [activeFilter, articles]);

  return (
    <section className="space-y-4">
      <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter civic pulses">
        <span className="mr-1 inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500"><Filter className="h-3 w-3" /> Filter</span>
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveFilter(id)}
            aria-pressed={activeFilter === id}
            className={`inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${activeFilter === id ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'}`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {visibleArticles.length > 0 ? visibleArticles.map((article) => {
          return <StoryCard key={article.id} article={article} />;
        }) : (
          <div aria-live="polite" className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500 md:col-span-2">
            {activeFilter === 'all'
              ? 'No stories to show yet — check back soon.'
              : `No stories in ${activeFilter} yet — check back soon.`}
          </div>
        )}
      </div>
    </section>
  );
}
