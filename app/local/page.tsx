// app/local/page.tsx
'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, HelpCircle, Eye, FileText, Send, Plus, Filter } from 'lucide-react';

interface LocalPost {
  id: string;
  category: 'Question' | 'Opinion' | 'Evidence' | 'Firsthand experience' | 'Correction';
  title: string;
  content: string;
  authorPseudonym: string;
  timestamp: string;
  upvotes: number;
  repliesCount: number;
  hasEvidence: boolean;
}

const INITIAL_POSTS: LocalPost[] = [
  {
    id: 'post-1',
    category: 'Firsthand experience',
    title: 'Traffic diversion active on Old Mumbai Highway near Cyberabad Police Commissionerate',
    content: 'Trenching work for stormwater culvert has closed the left two lanes. Traffic backed up toward Mehdipatnam junction.',
    authorPseudonym: 'WestCorridorDriver',
    timestamp: '45m ago',
    upvotes: 12,
    repliesCount: 4,
    hasEvidence: true,
  },
  {
    id: 'post-2',
    category: 'Question',
    title: 'Has the lake desiltation schedule for Durgam Cheruvu periphery been publicly released?',
    content: 'Tenders were approved last month, but no equipment or site markers have appeared near the biological park entrance.',
    authorPseudonym: 'LakeWatchGbl',
    timestamp: '3h ago',
    upvotes: 18,
    repliesCount: 9,
    hasEvidence: false,
  },
  {
    id: 'post-3',
    category: 'Evidence',
    title: 'Official GHMC Ward 104 Road Repair Tender Document #882',
    content: 'Uploaded the road resurfacing schedule covering Botanical Garden road. Contractor obligations start October 1.',
    authorPseudonym: 'RTI_Analyst_HYD',
    timestamp: '1d ago',
    upvotes: 31,
    repliesCount: 6,
    hasEvidence: true,
  },
];

export default function LocalPage() {
  const { location, scope } = useLocation();
  const [filter, setFilter] = useState<string>('All');
  const [posts, setPosts] = useState<LocalPost[]>(INITIAL_POSTS);

  // New post form state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<LocalPost['category']>('Question');

  const filteredPosts = filter === 'All'
    ? posts
    : posts.filter((p) => p.category === filter);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: LocalPost = {
      id: `post-${Date.now()}`,
      category: newCategory,
      title: newTitle,
      content: newContent,
      authorPseudonym: 'LocalCitizen_44',
      timestamp: 'Just now',
      upvotes: 1,
      repliesCount: 0,
      hasEvidence: newCategory === 'Evidence',
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Community Space Header */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-zinc-100">
              {location.area} Community Space
            </h1>
            <Badge variant="accent">{scope}</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Local discussions, verified neighborhood documentation, and eyewitness accounts.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Start Discussion
        </button>
      </div>

      {/* New Discussion Form Modal / Card */}
      {isCreating && (
        <form
          onSubmit={handleCreatePost}
          className="p-4 bg-zinc-900 border border-indigo-900/60 rounded-xl space-y-3"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-semibold text-zinc-200">New Community Post</span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as LocalPost['category'])}
              className="bg-zinc-950 border border-zinc-800 text-indigo-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="Question">Question</option>
              <option value="Firsthand experience">Firsthand experience</option>
              <option value="Evidence">Evidence</option>
              <option value="Opinion">Opinion</option>
              <option value="Correction">Correction</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Topic title or question..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
          />

          <textarea
            placeholder="Provide context, observations, or references..."
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors"
            >
              Post to {location.area}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'Question', 'Firsthand experience', 'Evidence', 'Opinion'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap ${
              filter === cat
                ? 'bg-zinc-800 border-indigo-500 text-zinc-100'
                : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    post.category === 'Firsthand experience'
                      ? 'warning'
                      : post.category === 'Evidence'
                      ? 'accent'
                      : 'neutral'
                  }
                >
                  {post.category}
                </Badge>
                <span className="font-mono text-zinc-500">{post.timestamp}</span>
              </div>
              <span className="font-mono text-zinc-400 text-[11px]">
                by {post.authorPseudonym}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-zinc-200 leading-snug">{post.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{post.content}</p>

            <div className="pt-2 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                <span className="hover:text-zinc-300 cursor-pointer">▲ {post.upvotes}</span>
                <span className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" /> {post.repliesCount} replies
                </span>
              </div>
              {post.hasEvidence && (
                <span className="flex items-center gap-1 text-indigo-400 text-[11px] font-mono">
                  <FileText className="w-3 h-3" /> Attached Evidence Document
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}