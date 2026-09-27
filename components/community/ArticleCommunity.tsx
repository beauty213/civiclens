'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const REACTIONS = [
  { label: 'Well-supported', color: '#34d399' },
  { label: 'Needs more evidence', color: '#fbbf24' },
  { label: 'Disputed', color: '#fb7185' },
  { label: 'Not sure', color: '#a1a1aa' },
] as const;

type Reaction = typeof REACTIONS[number]['label'];
type ReactionCounts = Record<Reaction, number>;

interface ArticleComment {
  id: string;
  author_pseudonym: string;
  content: string;
  created_at: string;
}

const EMPTY_COUNTS: ReactionCounts = {
  'Well-supported': 0,
  'Needs more evidence': 0,
  Disputed: 0,
  'Not sure': 0,
};

function getSessionId(): string {
  const storageKey = 'civiclens-community-session';
  let sessionId = window.localStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = window.crypto.randomUUID();
    window.localStorage.setItem(storageKey, sessionId);
  }
  return sessionId;
}

function displayTimestamp(value: string): string {
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? 'Time unavailable'
    : timestamp.toLocaleString();
}

export function ArticleCommunity({ articleId, isDemo = false }: { articleId: string; isDemo?: boolean }) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [counts, setCounts] = useState<ReactionCounts>(EMPTY_COUNTS);
  const [myVote, setMyVote] = useState<Reaction | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const loadReactions = async (currentSessionId: string) => {
    const response = await fetch(
      `/api/articles/${articleId}/reactions?sessionId=${encodeURIComponent(currentSessionId)}`,
      { cache: 'no-store' },
    );
    const payload: unknown = await response.json();
    if (!response.ok || typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new Error(
        typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
          ? payload.error
          : 'Could not load community reactions.',
      );
    }

    const result = payload as { counts: ReactionCounts; myVote: Reaction | null };
    setCounts(result.counts);
    setMyVote(result.myVote);
  };

  useEffect(() => {
    let isCurrent = true;
    const load = async () => {
      try {
        const currentSessionId = getSessionId();
        if (!isCurrent) return;
        setSessionId(currentSessionId);

        const [commentsResponse, reactionsResponse] = await Promise.all([
          fetch(`/api/articles/${articleId}/comments`, { cache: 'no-store' }),
          fetch(
            `/api/articles/${articleId}/reactions?sessionId=${encodeURIComponent(currentSessionId)}`,
            { cache: 'no-store' },
          ),
        ]);
        const [commentsPayload, reactionsPayload]: unknown[] = await Promise.all([
          commentsResponse.json(),
          reactionsResponse.json(),
        ]);
        if (!isCurrent) return;

        if (!commentsResponse.ok || !isPayloadRecord(commentsPayload) || !Array.isArray(commentsPayload.comments)) {
          throw new Error(getPayloadError(commentsPayload, 'Could not load article comments.'));
        }
        if (!reactionsResponse.ok || !isPayloadRecord(reactionsPayload) || !isPayloadRecord(reactionsPayload.counts)) {
          throw new Error(getPayloadError(reactionsPayload, 'Could not load community reactions.'));
        }
        setComments(commentsPayload.comments as ArticleComment[]);
        setCounts(reactionsPayload.counts as ReactionCounts);
        setMyVote(isReaction(reactionsPayload.myVote) ? reactionsPayload.myVote : null);
      } catch (error) {
        console.error('Unable to load article community:', error);
        if (isCurrent) {
          setLoadError(error instanceof Error ? error.message : 'Could not load the article discussion.');
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isCurrent = false;
    };
  }, [articleId]);

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCommentError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isPayloadRecord(payload) || !isPayloadRecord(payload.comment)) {
        throw new Error(getPayloadError(payload, 'Could not save your comment.'));
      }
      setComments((current) => [payload.comment as ArticleComment, ...current]);
      setAuthor('');
      setContent('');
    } catch (error) {
      console.error('Unable to submit article comment:', error);
      setCommentError(error instanceof Error ? error.message : 'Could not save your comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reaction: Reaction) => {
    if (!sessionId) return;
    setIsVoting(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/articles/${articleId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, reaction }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(getPayloadError(payload, 'Could not save your reaction.'));
      await loadReactions(sessionId);
    } catch (error) {
      console.error('Unable to submit article reaction:', error);
      setLoadError(error instanceof Error ? error.message : 'Could not save your reaction.');
    } finally {
      setIsVoting(false);
    }
  };

  const chartData = REACTIONS.map(({ label }) => ({ label, count: counts[label] }));

  return (
    <section className="grid gap-4 lg:grid-cols-2" aria-label="Community response">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        <h2 className="text-sm font-medium text-zinc-200">Community reaction</h2>
        <p className="mt-1 text-xs text-zinc-500">One vote per browser session. You can change your choice.</p>
        {isDemo && <p className="mt-2 text-[10px] text-amber-300">Includes illustrative demo votes, not verified community activity.</p>}
        <div className="mt-3 h-52" role="img" aria-label="Bar chart of community reactions">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="#27272a" horizontal={false} />
              <XAxis type="number" allowDecimals={false} stroke="#71717a" fontSize={11} />
              <YAxis type="category" dataKey="label" width={148} stroke="#a1a1aa" fontSize={11} />
              <Tooltip
                cursor={{ fill: 'rgba(161, 161, 170, 0.08)' }}
                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#f4f4f5' }}
              />
              <Bar dataKey="count" name="Votes" radius={[0, 5, 5, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`reaction-${entry.label}`} fill={REACTIONS[index].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {REACTIONS.map(({ label, color }) => (
            <button
              key={label}
              type="button"
              disabled={!sessionId || isVoting}
              onClick={() => void handleVote(label)}
              aria-pressed={myVote === label}
              className={`rounded-lg border px-2.5 py-2 text-left text-xs transition-colors disabled:cursor-wait disabled:opacity-60 ${
                myVote === label ? 'border-indigo-400 bg-indigo-500/10 text-zinc-100' : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </button>
          ))}
        </div>
        {isLoading && <p className="mt-2 text-xs text-zinc-500">Loading community response…</p>}
        {loadError && <p role="alert" className="mt-2 text-xs text-rose-300">{loadError}</p>}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        <h2 className="text-sm font-medium text-zinc-200">Article discussion</h2>
        <p className="mt-1 text-xs text-zinc-500">Share a comment about this story. You can post anonymously.</p>
        <form onSubmit={handleSubmitComment} className="mt-4 space-y-2.5">
          <label className="block text-xs text-zinc-400">
            Name or pseudonym <span className="text-zinc-600">(optional)</span>
            <input
              maxLength={60}
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Anonymous"
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            Comment
            <textarea
              required
              maxLength={2000}
              rows={3}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-1 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
              placeholder="Add a perspective or question about this story…"
            />
          </label>
          {commentError && <p role="alert" className="text-xs text-rose-300">{commentError}</p>}
          <button
            type="submit"
            disabled={isSubmitting || content.trim().length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
        <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
          {isLoading ? (
            <p className="text-xs text-zinc-500">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-zinc-500">No comments yet. Start the discussion.</p>
          ) : comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-200">{comment.author_pseudonym}</span>
                <time dateTime={comment.created_at} className="font-mono text-[10px] text-zinc-600">
                  {displayTimestamp(comment.created_at)}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300">{comment.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function isPayloadRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getPayloadError(value: unknown, fallback: string): string {
  return isPayloadRecord(value) && typeof value.error === 'string' ? value.error : fallback;
}

function isReaction(value: unknown): value is Reaction {
  return typeof value === 'string' && REACTIONS.some((reaction) => reaction.label === value);
}
