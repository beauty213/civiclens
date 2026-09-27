// app/explore/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Compass } from 'lucide-react';
import { fetchArticles } from '@/lib/dataService';
import { StoryCard } from '@/components/news/StoryCard';
import { Article } from '@/types';
import { CIVIC_NEWS_CATEGORIES } from '@/lib/newsCategories';

const CATEGORIES = ['All', ...CIVIC_NEWS_CATEGORIES] as const;
type ExploreCategory = typeof CATEGORIES[number];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory>('All');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let current = true;
    fetchArticles()
      .then((loadedArticles) => {
        if (current) setArticles(loadedArticles);
      })
      .catch((error: unknown) => {
        console.error('Unable to load articles for Explore:', error);
      })
      .finally(() => {
        if (current) setIsLoading(false);
      });

    return () => {
      current = false;
    };
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.summary.toLowerCase().includes(query.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Search Header */}
      <div className="space-y-3">
        <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          Explore CivicLens
        </h1>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search article headlines and summaries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full border transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-500 font-medium'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-xs font-mono text-zinc-400">
            {filteredArticles.length} Stories Indexed in Current Hierarchy
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 rounded-lg bg-zinc-900">
            {isLoading ? 'Loading articles…' : 'No articles matched your query.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <StoryCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}