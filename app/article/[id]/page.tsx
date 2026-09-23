// app/article/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { ClaimLensView } from '@/components/claims/ClaimLensView';
import { DevelopingStoryTimeline } from '@/components/timeline/DevelopingStoryTimeline';
import { SourceComparisonView } from '@/components/comparison/SourceComparisonView';
import { ArrowLeft, ShieldCheck, Share2, Bookmark, MapPin, GitBranch, Split } from 'lucide-react';

type ArticleViewTab = 'article' | 'claimlens' | 'timeline' | 'comparison';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const article = MOCK_ARTICLES.find((a) => a.id === articleId) || MOCK_ARTICLES[0];
  const [activeTab, setActiveTab] = useState<ArticleViewTab>('article');

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </button>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article Header Metadata */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="accent">{article.category}</Badge>
          <span className="flex items-center gap-1 text-zinc-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {article.location.area}, {article.location.district}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500 font-mono">
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight leading-snug">
          {article.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-zinc-400 border-y border-zinc-800 py-2.5">
          <span>
            By <strong className="text-zinc-200">{article.author}</strong> · {article.sourceName}
          </span>
          <span className="font-mono text-indigo-400">
            {article.claims.length} Claims Indexed
          </span>
        </div>
      </div>

      {/* Analytical Tab Switcher */}
      <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('article')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors whitespace-nowrap text-center ${
            activeTab === 'article'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Article Body
        </button>

        <button
          onClick={() => setActiveTab('claimlens')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'claimlens'
              ? 'bg-indigo-600 text-white shadow font-semibold'
              : 'text-indigo-400 hover:text-indigo-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Claim Lens ({article.claims.length})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          Timeline
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'comparison'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Split className="w-3.5 h-3.5 text-indigo-400" />
          Compare Sources
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'article' && (
        <article className="space-y-4 text-sm text-zinc-300 leading-relaxed font-normal">
          {article.bodyParagraphs && article.bodyParagraphs.length > 0 ? (
            article.bodyParagraphs.map((para, i) => (
              <p key={i} className="text-zinc-300">
                {para}
              </p>
            ))
          ) : (
            <p className="text-zinc-400 italic">{article.summary}</p>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center space-y-2">
            <p className="text-xs text-zinc-400">
              Examine claims, compare coverage across outlets, or view the developing chronology.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab('claimlens')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-indigo-500 text-xs font-medium text-zinc-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Claim Lens
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-indigo-500 text-xs font-medium text-zinc-200 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                View Timeline
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-indigo-500 text-xs font-medium text-zinc-200 transition-colors"
              >
                <Split className="w-3.5 h-3.5 text-indigo-400" />
                Compare Sources
              </button>
            </div>
          </div>
        </article>
      )}

      {activeTab === 'claimlens' && (
        <section className="space-y-4">
          <ClaimLensView claims={article.claims} />
        </section>
      )}

      {activeTab === 'timeline' && (
        <section className="space-y-4">
          <DevelopingStoryTimeline timeline={article.timeline} />
        </section>
      )}

      {activeTab === 'comparison' && (
        <section className="space-y-4">
          <SourceComparisonView comparison={article.comparison} />
        </section>
      )}
    </div>
  );
}
