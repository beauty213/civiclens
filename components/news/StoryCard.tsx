// components/news/StoryCard.tsx
import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, HelpCircle, Eye } from 'lucide-react';

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
            {article.location.area} · {article.location.district}
          </span>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <h3 className="text-base font-medium text-zinc-100 leading-snug group-hover:text-indigo-300 transition-colors mb-2">
        {article.title}
      </h3>

      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
        {article.summary}
      </p>

      {/* Evidence & Claims Metadata Footer */}
      <div className="mt-auto pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="font-medium text-zinc-300">{article.sourceName}</span>

        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1 hover:text-zinc-200" title="Extracted Claims">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            {article.claimsCount} claims
          </span>
          <span className="flex items-center gap-1 hover:text-zinc-200" title="Open Questions">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            {article.unresolvedQuestionsCount} questions
          </span>
          {article.citizenReportsCount > 0 && (
            <span className="flex items-center gap-1 hover:text-zinc-200" title="Local Firsthand Reports">
              <Eye className="w-3.5 h-3.5 text-amber-500/80" />
              {article.citizenReportsCount} reports
            </span>
          )}
        </div>
      </div>
    </article>
  );
}