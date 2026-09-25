'use client';

import { useMemo, useState } from 'react';
import { FileCheck2, Filter, Gauge, Layers3, Stethoscope, Trees, Wrench } from 'lucide-react';
import { Article } from '@/types';
import { computeArticleScore } from '@/lib/scoring/engine';
import { StoryCard } from '@/components/news/StoryCard';

type PulseFilter = 'all' | 'infrastructure' | 'health' | 'environment' | 'rti' | 'hoax';

const FILTERS: Array<{ id: PulseFilter; label: string; icon: typeof Filter }> = [
  { id: 'all', label: 'All Pulses', icon: Layers3 },
  { id: 'infrastructure', label: 'Infrastructure', icon: Wrench },
  { id: 'health', label: 'Public Health', icon: Stethoscope },
  { id: 'environment', label: 'Environmental', icon: Trees },
  { id: 'rti', label: 'RTI Audits', icon: FileCheck2 },
  { id: 'hoax', label: 'High Hoax Risk', icon: Gauge },
];

export function StoryPulseFilters({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState<PulseFilter>('all');
  const visibleArticles = useMemo(() => articles.filter((article) => {
    const score = computeArticleScore(article.claims ?? []);
    if (activeFilter === 'hoax') return score.score < 40;
    if (activeFilter === 'infrastructure') return article.category === 'Public Safety' || /infrastructure|road|drain|lake|water/i.test(`${article.title} ${article.summary}`);
    if (activeFilter === 'health') return article.category === 'Health';
    if (activeFilter === 'environment') return article.category === 'Environment';
    if (activeFilter === 'rti') {
      return article.claims?.some((claim) => claim.evidence?.some((evidence) => /rti|right to information/i.test(`${evidence.title} ${evidence.provenanceNote}`))) ?? false;
    }
    return true;
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
          <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500 md:col-span-2">
            No civic pulses match this confidence filter yet.
          </div>
        )}
      </div>
    </section>
  );
}
