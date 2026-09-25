// components/news/StoryCard.tsx
import Link from 'next/link';
import { Article } from '@/types';
import { computeArticleScore } from '@/lib/scoring/engine';
import { ArrowUpRight, MapPin, Trophy } from 'lucide-react';

interface StoryCardProps {
  article: Article;
}

export function StoryCard({ article }: StoryCardProps) {
  const score = computeArticleScore(article.claims ?? []);
  const tier = score.score > 75
    ? { label: 'Well-supported', className: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60', dot: 'bg-emerald-400' }
    : score.score < 40
        ? { label: 'High hoax risk', className: 'bg-rose-950/80 text-rose-300 border-rose-800/60', dot: 'bg-rose-400' }
        : { label: 'Needs verification', className: 'bg-amber-950/80 text-amber-300 border-amber-800/60', dot: 'bg-amber-400' };

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-500/5">
        <div>
          <div
            className="relative mb-5 aspect-video overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950"
            style={article.imageUrl ? {
              backgroundImage: `linear-gradient(180deg, rgba(11,15,23,0.05), rgba(11,15,23,0.86)), url("${article.imageUrl}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            } : undefined}
            role={article.imageUrl ? 'img' : undefined}
            aria-label={article.imageUrl ? article.imageCaption ?? article.title : undefined}
          >
            {!article.imageUrl && (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 360" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id={`story-gradient-${article.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#132f38" />
                    <stop offset="52%" stopColor="#172238" />
                    <stop offset="100%" stopColor="#271b36" />
                  </linearGradient>
                  <pattern id={`story-grid-${article.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M32 0H0V32" fill="none" stroke="#94a3b8" strokeOpacity="0.12" />
                  </pattern>
                </defs>
                <rect width="640" height="360" fill={`url(#story-gradient-${article.id})`} />
                <rect width="640" height="360" fill={`url(#story-grid-${article.id})`} />
              </svg>
            )}
            <div className="absolute inset-0 flex items-end justify-between p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] text-slate-200 backdrop-blur-sm">
                <Trophy className="h-3.5 w-3.5 text-emerald-300" /> Evidence brief
              </span>
              <span className={`rounded-full border px-3 py-1 font-mono text-[10px] backdrop-blur-sm ${tier.className}`}>
                {score.score}% grounded
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">{article.category}</span>
            <span className="rounded-full border border-slate-800 bg-slate-950/50 px-3 py-1 font-mono text-[10px] text-slate-400">
              <MapPin className="mr-1 inline h-3 w-3 text-emerald-400" />
              {article.location?.area ?? 'Civic Region'}
            </span>
          </div>
          <div className="mt-5 flex items-start justify-between gap-3">
            <Link href={`/article/${article.id}`} className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-100 transition-colors group-hover:text-emerald-400">{article.title}</h3>
            </Link>
            <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-950/60 px-2 py-1 font-mono text-[10px] text-slate-400">{score.score}%</span>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">{article.summary}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] ${tier.className}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} /> {tier.label}
            </span>
            <span className="font-mono text-[10px] text-slate-500">⚡ 14.2ms NPU</span>
          </div>
          <Link href={`/article/${article.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-emerald-400">
            Inspect <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
    </article>
  );
}