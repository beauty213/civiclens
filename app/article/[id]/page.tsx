// app/article/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { ClaimLensView } from '@/components/claims/ClaimLensView';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  ShieldCheck, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Share2, 
  AlertCircle 
} from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const articleId = params.id as string;
  
  // Look up mock article
  const article = MOCK_ARTICLES.find((a) => a.id === articleId) || MOCK_ARTICLES[0];
  const initialView = searchParams.get('view') === 'claims' ? 'claims' : 'article';
  const [activeTab, setActiveTab] = useState<'article' | 'claims'>(initialView);

  return (
    <div className="space-y-6">
      {/* Back button & top meta */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Feed
        </Link>
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Article link copied to clipboard.');
            }
          }}
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="accent">{article.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
            <MapPin className="w-3 h-3 text-zinc-500" />
            {article.location.area}, {article.location.district}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
            <Calendar className="w-3 h-3 text-zinc-500" />
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-zinc-100 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
          <span>
            Reported by <strong className="text-zinc-200">{article.author}</strong> for{' '}
            <span className="text-indigo-300">{article.sourceName}</span>
          </span>
        </div>
      </header>

      {/* View Switcher: Read Story vs Examine with Claim Lens */}
      <div className="flex rounded-lg bg-zinc-900 p-1 border border-zinc-800">
        <button
          onClick={() => setActiveTab('article')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-all ${
            activeTab === 'article'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Read Full Story
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-all ${
            activeTab === 'claims'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-400 hover:text-indigo-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Examine with CivicLens ({article.claims?.length || article.claimsCount} Claims)
        </button>
      </div>

      {/* Tab 1: Full Article Content */}
      {activeTab === 'article' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 leading-relaxed space-y-3 text-zinc-300 text-sm">
            {article.content ? (
              article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{article.summary}</p>
            )}
          </div>

          {/* Prompt to open Claim Lens */}
          <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-indigo-200">
                Want to examine the assertions made in this article?
              </p>
              <p className="text-xs text-zinc-400">
                Review verified sources, conflicting statements, and identified data gaps.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('claims')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors shrink-0"
            >
              Open Claim Lens
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Claim Lens Engine */}
      {activeTab === 'claims' && (
        <div>
          {article.claims && article.claims.length > 0 ? (
            <ClaimLensView claims={article.claims} />
          ) : (
            <div className="p-6 text-center border border-zinc-800 rounded-lg bg-zinc-900 text-xs text-zinc-400">
              No claims have been parsed for this publication yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}