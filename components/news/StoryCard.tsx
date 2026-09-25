// components/news/StoryCard.tsx
import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, HelpCircle, Eye, ArrowUpRight } from 'lucide-react';

interface StoryCardProps {
  article: Article;
}

export function StoryCard({ article }: StoryCardProps) {
  return (
    <article className="group relative flex flex-col p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="accent">{article.category}</Badge>
          <span className="text-xs text-zinc-400 font-mono">
            {article.location?.area ?? 'Unknown area'} · {article.location?.district ?? 'Unknown district'}
          </span>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <Link href={`/article/${article.id}`} className="block mb-2">
        <h3 className="text-base font-medium text-zinc-100 leading-snug group-hover:text-indigo-300 transition-colors flex items-start justify-between gap-2">
          <span>{article.title}</span>
          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-300 shrink-0 mt-0.5" />
        </h3>
      </Link>

      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
        {article.summary}
      </p>

      {/* Evidence & Claims Metadata Footer */}
      <div className="mt-auto pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="font-medium text-zinc-300">{article.sourceName}</span>

        <div className="flex items-center gap-3 font-mono">
          <Link
            href={`/article/${article.id}?view=claims`}
            className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
            title="Examine Claims with CivicLens"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            {article.claimsCount} claims
          </Link>
          <span className="flex items-center gap-1 text-zinc-400" title="Open Questions">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            {article.unresolvedQuestionsCount}
          </span>
          {article.citizenReportsCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400" title="Local Firsthand Reports">
              <Eye className="w-3.5 h-3.5" />
              {article.citizenReportsCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}