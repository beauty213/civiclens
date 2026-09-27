'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle, ShieldCheck } from 'lucide-react';
import { CIVIC_NEWS_CATEGORIES, CivicNewsCategory } from '@/lib/newsCategories';

export function NewsIntakeForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<CivicNewsCategory>('Politics');
  const [articleText, setArticleText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forensic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sourceName, sourceUrl, author, category, articleText }),
      });
      const payload: unknown = await response.json();
      const result = typeof payload === 'object' && payload !== null && !Array.isArray(payload)
        ? payload as Record<string, unknown>
        : {};
      if (!response.ok) {
        setError(typeof result.error === 'string' ? result.error : 'The story could not be assessed. Please try again.');
        return;
      }
      if (typeof result.articleId !== 'string' || !result.articleId) {
        setError('The assessment completed without an article reference.');
        return;
      }
      router.push(`/article/${result.articleId}`);
    } catch (submissionError) {
      console.error('Public news assessment request failed:', submissionError);
      setError('Could not reach the assessment service. Check that the service is running and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-400">Public news intake</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Check a news story</h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">Add a public article to separate its factual claims and compare them with available source records.</p>
      </div>

      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs leading-relaxed text-zinc-300">
        <ShieldCheck className="mr-1.5 inline h-4 w-4 text-indigo-300" />
        Article text and its public URL are sent to Gemini for claim extraction and saved to CivicLens. Source records are not treated as proof based on their URL alone; open each cited document to review it.
      </div>

      <label className="block text-xs font-medium text-zinc-300">
        Story headline
        <input
          required
          maxLength={500}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500"
          placeholder="Headline as published"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-zinc-300">
          Publisher
          <input
            required
            maxLength={150}
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500"
            placeholder="News organization"
          />
        </label>
        <label className="block text-xs font-medium text-zinc-300">
          Public article URL (HTTPS)
          <input
            required
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500"
            placeholder="https://news.example/article"
          />
        </label>
        <label className="block text-xs font-medium text-zinc-300">
          Category
          <select
            value={category}
            onChange={(event) => {
              const selectedCategory = CIVIC_NEWS_CATEGORIES.find((item) => item === event.target.value);
              if (selectedCategory) setCategory(selectedCategory);
            }}
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500"
          >
            {CIVIC_NEWS_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-xs font-medium text-zinc-300">
          Submitted by (optional)
          <input
            maxLength={150}
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500"
            placeholder="Your name or pseudonym"
          />
        </label>
      </div>

      <label className="block text-xs font-medium text-zinc-300">
        Article text
        <textarea
          required
          minLength={80}
          maxLength={50000}
          rows={12}
          value={articleText}
          onChange={(event) => setArticleText(event.target.value)}
          className="mt-1.5 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm leading-relaxed text-zinc-100 outline-none focus:border-indigo-500"
          placeholder="Paste the public article text here (80–50,000 characters)."
        />
        <span className="mt-1 block text-right font-mono text-[10px] text-zinc-600">{articleText.length.toLocaleString()} / 50,000</span>
      </label>

      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Extracting and checking claims…</> : 'Extract claims and review evidence'}
      </button>
    </form>
  );
}
