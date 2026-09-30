// components/news/StoryCard.tsx
import Link from 'next/link';
import { Article, EvidenceStatus } from '@/types';
import { computeArticleScore } from '@/lib/scoring/engine';
import { ArrowUpRight, MapPin, Trophy } from 'lucide-react';
import { ArticleAssessmentBadge } from '@/components/news/ArticleAssessmentBadge';
import { ArticleImage } from '@/components/news/ArticleImage';

const CLAIM_STATUS_STYLES: Record<EvidenceStatus, string> = {
  'Well-supported': 'text-emerald-300',
  'Supported with context': 'text-sky-300',
  'Needs verification': 'text-amber-300',
  'Conflicting reports': 'text-orange-300',
  'Insufficient evidence': 'text-slate-300',
  'Contradicted by available evidence': 'text-rose-300',
};

interface StoryCardProps {
  article: Article;
}

export function StoryCard({ article }: StoryCardProps) {
  const score = computeArticleScore(article.claims ?? []);
  const scoreCircumference = 2 * Math.PI * 17;
  const scoreColor = score.score >= 75 ? 'text-emerald-400' : score.score < 40 ? 'text-rose-400' : 'text-amber-400';
  const hasClaims = (article.claims?.length ?? 0) > 0;
  const tier = !hasClaims
    ? { label: 'Not assessed', className: 'bg-slate-900/80 text-slate-300 border-slate-700', dot: 'bg-slate-400' }
    : score.score > 75
    ? { label: 'Well-supported', className: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60', dot: 'bg-emerald-400' }
    : score.score < 40
        ? { label: 'High hoax risk', className: 'bg-rose-950/80 text-rose-300 border-rose-800/60', dot: 'bg-rose-400' }
        : { label: 'Needs verification', className: 'bg-amber-950/80 text-amber-300 border-amber-800/60', dot: 'bg-amber-400' };

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-500/5">
        <div>
          <div className="mb-5">
            <ArticleImage
              article={article}
              compact
              overlay={(
                <div className="absolute inset-0 flex items-end justify-between p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] text-slate-200 backdrop-blur-sm">
                <Trophy className="h-3.5 w-3.5 text-emerald-300" /> Evidence brief
              </span>
              {hasClaims ? (
                <div className="relative h-12 w-12 shrink-0" role="img" aria-label={`${score.score}% grounded`}>
                  <svg viewBox="0 0 44 44" className="-rotate-90">
                    <circle cx="22" cy="22" r="17" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-700" />
                    <circle cx="22" cy="22" r="17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={scoreColor} strokeDasharray={scoreCircumference} strokeDashoffset={scoreCircumference - (score.score / 100) * scoreCircumference} />
                  </svg>
                  <strong className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white">{score.score}%</strong>
                </div>
              ) : (
                <span className={`rounded-full border px-3 py-1 font-mono text-[10px] backdrop-blur-sm ${tier.className}`}>Not assessed</span>
              )}
            </div>
              )}
            />
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ArticleAssessmentBadge article={article} />
          </div>
          {article.intakeMethod === 'auto' && (
            <p className="mb-3 w-fit rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] text-sky-200">
              Auto-fetched · Google Search
            </p>
          )}
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
            {hasClaims && <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-950/60 px-2 py-1 font-mono text-[10px] text-slate-400">{score.score}%</span>}
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">{article.summary}</p>
          {hasClaims && (
            <div className="mt-4 border-t border-slate-800/80 pt-3">
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Atomic claims</h4>
              <ul className="mt-2 space-y-2">
                {article.claims.slice(0, 3).map((claim, index) => (
                  <li key={claim.id} className="border-l border-slate-700 pl-2.5">
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-300">{index + 1}. {claim.claimText}</p>
                    <span className={`mt-1 inline-block text-[10px] ${CLAIM_STATUS_STYLES[claim.status]}`}>{claim.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] ${tier.className}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} /> {tier.label}
            </span>
            <span className="font-mono text-[10px] text-slate-500">Optimized for Snapdragon NPU</span>
          </div>
          <Link href={`/article/${article.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-emerald-400">
            Inspect <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
    </article>
  );
}