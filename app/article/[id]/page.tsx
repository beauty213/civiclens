'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { ClaimLensView } from '@/components/claims/ClaimLensView';
import { DevelopingStoryTimeline } from '@/components/timeline/DevelopingStoryTimeline';
import { SourceComparisonView } from '@/components/comparison/SourceComparisonView';
import { CorrectionsHistoryModal } from '@/components/claims/CorrectionsHistoryModal';
import { AiExtractModal } from '@/components/claims/AiExtractModal';
import { ArrowLeft, ShieldCheck, Share2, Bookmark, MapPin, GitBranch, Split, History, Sparkles } from 'lucide-react';

type ArticleViewTab = 'article' | 'claimlens' | 'timeline' | 'comparison';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : 'art-001';

  const article = MOCK_ARTICLES.find((a) => a.id === articleId) || MOCK_ARTICLES[0];
  const [activeTab, setActiveTab] = useState<ArticleViewTab>('article');
  const [isCorrectionsOpen, setIsCorrectionsOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Fallback to bodyParagraphs, content, or summary
  const paragraphs: string[] = article.bodyParagraphs || article.content || [article.summary];

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
          {article.corrections && article.corrections.length > 0 && (
            <button
              onClick={() => setIsCorrectionsOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-amber-800 bg-amber-950/40 text-amber-300 text-xs font-mono hover:bg-amber-900/50 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              Corrections ({article.corrections.length})
            </button>
          )}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-indigo-700 bg-indigo-950/60 text-indigo-300 text-xs font-mono hover:bg-indigo-900 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Claim Engine
          </button>
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
          {paragraphs.map((para: string, idx: number) => (
            <p key={idx} className="text-zinc-300">
              {para}
            </p>
          ))}
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

      <CorrectionsHistoryModal
        isOpen={isCorrectionsOpen}
        onClose={() => setIsCorrectionsOpen(false)}
        corrections={article.corrections}
      />

      <AiExtractModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        articleId={article.id}
        articleTitle={article.title}
        articleText={paragraphs.join('\n')}
      />
    </div>
  );
}
