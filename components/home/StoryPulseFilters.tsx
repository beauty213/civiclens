'use client';

import { useMemo, useState } from 'react';
import { FileCheck2, Filter, Gauge, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { Article } from '@/types';
import { computeArticleScore } from '@/lib/scoring/engine';
import { Badge } from '@/components/ui/Badge';

type PulseFilter = 'all' | 'hoax' | 'confirmed' | 'rti';

const FILTERS: Array<{ id: PulseFilter; label: string; icon: typeof Filter }> = [
  { id: 'all', label: 'All Pulses', icon: Layers3 },
  { id: 'hoax', label: 'High Hoax Risk <40%', icon: Gauge },
  { id: 'confirmed', label: 'Audited / Confirmed >75%', icon: FileCheck2 },
  { id: 'rti', label: 'Municipal RTIs', icon: FileCheck2 },
];

export function StoryPulseFilters({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState<PulseFilter>('all');
  const visibleArticles = useMemo(() => articles.filter((article) => {
    const score = computeArticleScore(article.claims ?? []);
    if (activeFilter === 'hoax') return score.score < 40;
    if (activeFilter === 'confirmed') return score.score > 75;
    if (activeFilter === 'rti') {
      return article.claims?.some((claim) => claim.evidence?.some((evidence) => /rti|right to information/i.test(`${evidence.title} ${evidence.provenanceNote}`))) ?? false;
    }
    return true;
  }), [activeFilter, articles]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter civic pulses">
        <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600"><Filter className="h-3 w-3" /> Filter by confidence</span>
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveFilter(id)}
            aria-pressed={activeFilter === id}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${activeFilter === id ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-200' : 'border-zinc-800 bg-zinc-900/70 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {visibleArticles.length > 0 ? visibleArticles.map((article) => {
          const score = computeArticleScore(article.claims ?? []);
          return (
            <Link key={article.id} href={`/article/${article.id}`} className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-indigo-500/40">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="accent">{article.category}</Badge>
                <span className={`font-mono text-[10px] ${score.score < 40 ? 'text-rose-300' : score.score > 75 ? 'text-emerald-300' : 'text-amber-300'}`}>{score.score}% grounded</span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-snug text-zinc-200 group-hover:text-indigo-300">{article.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">{article.summary}</p>
              <p className="mt-3 font-mono text-[10px] text-zinc-600">{article.location?.area ?? 'Local'} · {article.claims?.length ?? 0} claims · {article.claims?.reduce((count, claim) => count + (claim.evidence?.length ?? 0), 0) ?? 0} receipts</p>
            </Link>
          );
        }) : (
          <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500 md:col-span-2">
            No civic pulses match this confidence filter yet.
          </div>
        )}
      </div>
    </section>
  );
}
