// components/discussion/ClaimDiscussionSection.tsx
'use client';

import React, { useState } from 'react';
import { ClaimComment, CommentCategory, ClaimDiscussionSummary } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, FileText, Send, Sparkles, AlertCircle } from 'lucide-react';

interface ClaimDiscussionSectionProps {
  claimId: string;
  comments?: ClaimComment[];
  summary?: ClaimDiscussionSummary;
}

export function ClaimDiscussionSection({
  claimId,
  comments = [],
  summary,
}: ClaimDiscussionSectionProps) {
  const [commentList, setCommentList] = useState<ClaimComment[]>(comments);
  const [filter, setFilter] = useState<string>('All');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<CommentCategory>('Question');

  const filtered = filter === 'All'
    ? commentList
    : commentList.filter((c) => c.category === filter);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newComment: ClaimComment = {
      id: `c-${Date.now()}`,
      claimId,
      category: newCategory,
      authorPseudonym: 'HydObserver_77',
      content: newText,
      timestamp: 'Just now',
      upvotes: 1,
    };

    setCommentList([newComment, ...commentList]);
    setNewText('');
  };

  return (
    <div className="space-y-5 pt-4 border-t border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Discussions Attached to This Claim ({commentList.length})
        </h4>
        <span className="text-[11px] font-mono text-zinc-500">
          CivicLens Claim-Level Threading
        </span>
      </div>

      {/* AI Discussion Summary (Section 15 requirement) */}
      {summary && (
        <div className="p-3.5 bg-zinc-950 border border-indigo-900/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-zinc-200">
              Community Discussion Synthesis
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
              Neutral Summary
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-emerald-400">Common Points:</span>
              <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                {summary.commonPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-400">Different Accounts:</span>
              <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                {summary.differentAccounts.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Comment Submission Form */}
      <form onSubmit={handlePost} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono text-[11px]">Categorize your contribution:</span>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as CommentCategory)}
            className="bg-zinc-900 border border-zinc-700 text-indigo-300 rounded px-2 py-0.5 text-xs outline-none"
          >
            <option value="Question">Question</option>
            <option value="Firsthand experience">Firsthand experience</option>
            <option value="Evidence">Evidence</option>
            <option value="Opinion">Opinion</option>
            <option value="Correction">Correction</option>
          </select>
        </div>

        <textarea
          rows={2}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add an observation, source reference, or question regarding this specific claim..."
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded p-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
        />

        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] text-zinc-500">Posting as <strong className="text-zinc-400 font-mono">HydObserver_77</strong></span>
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" />
            Attach to Claim
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
        {['All', 'Firsthand experience', 'Evidence', 'Question', 'Opinion', 'Correction'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2 py-1 rounded border font-mono transition-colors whitespace-nowrap ${
              filter === cat
                ? 'bg-zinc-800 border-indigo-500 text-zinc-100'
                : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-zinc-500 italic text-center py-2">No contributions under this category yet.</p>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={c.category === 'Firsthand experience' ? 'warning' : c.category === 'Evidence' ? 'accent' : 'neutral'}>
                    {c.category}
                  </Badge>
                  <span className="font-mono text-zinc-500 text-[11px]">{c.timestamp}</span>
                </div>
                <span className="font-mono text-zinc-400 text-[11px]">{c.authorPseudonym}</span>
              </div>

              <p className="text-zinc-300 leading-relaxed">{c.content}</p>

              {c.attachedEvidenceTitle && (
                <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-mono pt-1">
                  <FileText className="w-3 h-3" />
                  <span>Linked Source: {c.attachedEvidenceTitle}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
