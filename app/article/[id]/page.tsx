'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { fetchArticleById } from '@/lib/dataService';
import { computeArticleScore } from '@/lib/scoring/engine';
import { Article, Claim, EvidenceItem, EvidenceStatus } from '@/types';
import { ArticleImage } from '@/components/news/ArticleImage';
import { ArticleAssessmentBadge } from '@/components/news/ArticleAssessmentBadge';
import { isSpecificHttpsSourceUrl } from '@/lib/forensics/sourceLinks';
import { ArticleCommunity } from '@/components/community/ArticleCommunity';

const STATUS_STYLES: Record<EvidenceStatus, string> = {
  'Well-supported': 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  'Supported with context': 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  'Needs verification': 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  'Conflicting reports': 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  'Insufficient evidence': 'border-zinc-600 bg-zinc-800/70 text-zinc-300',
  'Contradicted by available evidence': 'border-rose-500/40 bg-rose-500/10 text-rose-300',
};

function ScoreGauge({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32 shrink-0" aria-label={`Forensic score ${score} out of 100`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" role="img">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-800" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-indigo-400 transition-all duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <strong className="text-3xl font-semibold tracking-tight text-zinc-100">{score}</strong>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">/ 100</span>
      </div>
    </div>
  );
}

function EvidenceCard({ evidence }: { evidence: EvidenceItem }) {
  const sourceUrl = isSpecificHttpsSourceUrl(evidence.sourceUrl) ? evidence.sourceUrl : undefined;

  return (
    <li className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-medium text-zinc-100">{evidence.title}</h4>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-zinc-500 hover:text-indigo-300"
                aria-label={`Open ${evidence.title}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          {evidence.isDemo && (
            <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-wider text-amber-400">Demo record · not verified</span>
          )}
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{evidence.description}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-zinc-500">
            <span>{evidence.type}</span>
            <span>by {evidence.uploaderPseudonym}</span>
            <span>{evidence.date}</span>
          </div>
          <p className="mt-2 border-l border-indigo-500/40 pl-2 text-[11px] italic text-zinc-500">
            {evidence.provenanceNote}
          </p>
          {!sourceUrl && <p className="mt-2 text-[10px] text-amber-400">No specific public source link is available for this record.</p>}
        </div>
      </div>
    </li>
  );
}

function ClaimInspector({
  claims,
  selectedClaimId,
  onSelect,
}: {
  claims: Claim[];
  selectedClaimId: string | null;
  onSelect: (claimId: string) => void;
}) {
  const selectedClaim = claims.find((claim) => claim.id === selectedClaimId) ?? claims[0];
  const score = computeArticleScore(claims);

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900/70">
      <div className="border-b border-zinc-800 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-400">Forensic assessment</p>
        {claims.length > 0 ? (
          <div className="mt-3 flex items-center gap-4">
            <ScoreGauge score={score.score} />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-zinc-100">{score.grade}</h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{score.recommendation}</p>
              <p className="mt-2 font-mono text-[10px] text-zinc-500">
                {score.verifiedCount} grounded · {score.unverifiedCount} open · {score.contradictedCount} disputed
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 rounded-lg border border-dashed border-zinc-700 p-3 text-xs text-zinc-400">No factual claims have been assessed for this story yet.</p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Claim index</h3>
          <span className="font-mono text-[10px] text-zinc-600">{claims.length} claims</span>
        </div>
        <div className="space-y-2">
          {claims.map((claim, index) => {
            const isSelected = claim.id === selectedClaim?.id;
            return (
              <div key={claim.id} className={`rounded-lg border ${isSelected ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-zinc-800 bg-zinc-950/40'}`}>
                <button
                  type="button"
                  onClick={() => onSelect(claim.id)}
                  aria-expanded={isSelected}
                  className="w-full p-3 text-left"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-zinc-600">CLAIM {String(index + 1).padStart(2, '0')}</span>
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[claim.status]}`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-200">{claim.claimText}</p>
                </button>
                {isSelected && (
                  <div className="border-t border-zinc-800 px-3 pb-3 pt-2">
                    <p className="text-xs leading-relaxed text-zinc-400">{claim.statusExplanation}</p>
                    <p className="mt-2 font-mono text-[10px] text-zinc-600">SOURCE: {claim.speakerOrSource}</p>
                    <p className="mt-3 font-mono text-[10px] text-zinc-500">{claim.evidence.length} source record{claim.evidence.length === 1 ? '' : 's'}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedClaim && (
        <div className="max-h-[36%] overflow-y-auto border-t border-zinc-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Evidence lab</h3>
            <span className="text-[10px] text-zinc-600">{selectedClaim.evidence.length} attached</span>
          </div>
          {selectedClaim.evidence.length > 0 ? (
            <ul className="space-y-2">
              {selectedClaim.evidence.map((evidence) => <EvidenceCard key={evidence.id} evidence={evidence} />)}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-700 p-4 text-center text-xs text-zinc-500">
              No primary records attached to this claim yet.
            </div>
          )}
          <p className="border-t border-zinc-800 px-3 py-2 text-[10px] leading-relaxed text-zinc-600">
            Assessments use the source-record details stored here. Open each linked source to review the original document.
          </p>
        </div>
      )}
    </aside>
  );
}

function HighlightedArticle({
  article,
  selectedClaimId,
  onSelect,
}: {
  article: Article;
  selectedClaimId: string | null;
  onSelect: (claimId: string) => void;
}) {
  const highlightedParagraphs = useMemo(() => {
    const sourceParagraphs = article.bodyParagraphs || article.content || [article.summary];
    return sourceParagraphs.map((paragraph) => {
    const matches = article.claims
      .map((claim) => ({ claim, start: paragraph.indexOf(claim.claimText) }))
      .filter(({ start }) => start >= 0)
      .sort((a, b) => a.start - b.start);

    if (matches.length === 0) return [{ text: paragraph, claim: null }];
    const pieces: Array<{ text: string; claim: Claim | null }> = [];
    let cursor = 0;
    matches.forEach(({ claim, start }) => {
      if (start > cursor) pieces.push({ text: paragraph.slice(cursor, start), claim: null });
      pieces.push({ text: claim.claimText, claim });
      cursor = start + claim.claimText.length;
    });
    if (cursor < paragraph.length) pieces.push({ text: paragraph.slice(cursor), claim: null });
      return pieces;
    });
  }, [article.bodyParagraphs, article.claims, article.content, article.summary]);

  return (
    <article className="space-y-5 text-sm leading-8 text-zinc-300">
      {highlightedParagraphs.map((pieces, paragraphIndex) => (
        <p key={paragraphIndex}>
          {pieces.map((piece, pieceIndex) => piece.claim ? (
            <button
              type="button"
              key={`${paragraphIndex}-${pieceIndex}`}
              onClick={() => onSelect(piece.claim!.id)}
              className={`rounded px-0.5 text-left underline decoration-dotted decoration-indigo-400/70 underline-offset-4 transition-colors hover:bg-indigo-500/20 ${
                piece.claim.id === selectedClaimId ? 'bg-indigo-500/20 text-zinc-100' : 'text-zinc-200'
              }`}
              aria-label={`Inspect claim: ${piece.claim.claimText}`}
            >
              {piece.text}
            </button>
          ) : piece.text)}
        </p>
      ))}
    </article>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : 'art-001';
  const [loadedArticle, setLoadedArticle] = useState<Article | undefined>(() => MOCK_ARTICLES.find((candidate) => candidate.id === articleId));
  const [loadedArticleId, setLoadedArticleId] = useState<string | null>(() => MOCK_ARTICLES.some((candidate) => candidate.id === articleId) ? articleId : null);
  const [selectedClaimIdState, setSelectedClaimIdState] = useState<string | null>(null);
  const article = loadedArticle?.id === articleId ? loadedArticle : undefined;
  const claims = article?.claims ?? [];
  const selectedClaimId = claims.some((claim) => claim.id === selectedClaimIdState)
    ? selectedClaimIdState
    : claims[0]?.id ?? null;
  const articleSourceUrl = article && isSpecificHttpsSourceUrl(article.sourceUrl) ? article.sourceUrl : undefined;

  useEffect(() => {
    let isCurrent = true;
    fetchArticleById(articleId)
      .then((loadedArticle) => {
        if (!isCurrent) return;
        setLoadedArticle(loadedArticle);
        setLoadedArticleId(articleId);
      })
      .catch((error: unknown) => {
        console.error('Unable to load article details:', error);
        if (isCurrent) {
          setLoadedArticle(undefined);
          setLoadedArticleId(articleId);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [articleId]);

  const setSelectedClaimId = (claimId: string) => setSelectedClaimIdState(claimId);
  if (!article) {
    const hasLoaded = loadedArticleId === articleId;
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
        <h1 className="text-lg font-semibold text-zinc-100">{hasLoaded ? 'Article not found' : 'Loading article…'}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {hasLoaded ? 'This story is no longer available in the current feed.' : 'Loading its claims and source records.'}
        </p>
        {hasLoaded && <button type="button" onClick={() => router.push('/')} className="mt-4 text-sm text-indigo-300 hover:text-indigo-200">Back to articles</button>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </button>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> HOW WE CHECKED THIS</span>
          <span className="hidden text-zinc-700 sm:inline">/</span>
          <span>{article.claims.length} claims · Optimized for Snapdragon NPU</span>
        </div>
      </header>

      {article.isDemo && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
          This is a demo story with illustrative claim assessments and source records, not a live verification.
        </p>
      )}
      {article.intakeMethod === 'auto' && (
        <p className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-xs text-sky-200">
          Found through Google Search.
          {article.assessmentStatus === 'in_progress'
            ? ' Just published — evidence assessment in progress because supporting source records are limited. Open the links and review the original reporting.'
            : ' Open the source links and review the original reporting alongside the evidence assessment.'}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)] lg:items-stretch">
        <main className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-8">
          <div className="mb-7 space-y-3 border-b border-zinc-800 pb-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-indigo-300">{article.category}</span>
              <ArticleAssessmentBadge article={article} />
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-400" />{article.location?.area}, {article.location?.district}</span>
              <span>·</span>
              <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-3xl">{article.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span>
                By <strong className="text-zinc-300">{article.author}</strong> ·{' '}
                {articleSourceUrl ? (
                  <a href={articleSourceUrl} target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-indigo-200">
                    {article.sourceName} <ExternalLink className="inline h-3 w-3" />
                  </a>
                ) : article.sourceName}
              </span>
              <span className="inline-flex items-center gap-1 text-indigo-300"><ShieldCheck className="h-3.5 w-3.5" /> Claims are highlighted for inspection</span>
            </div>
          </div>
          <ArticleImage article={article} className="mb-6" />
          <HighlightedArticle article={{ ...article, claims }} selectedClaimId={selectedClaimId} onSelect={setSelectedClaimId} />
        </main>

        <ClaimInspector
          claims={claims}
          selectedClaimId={selectedClaimId}
          onSelect={setSelectedClaimId}
        />
      </div>

      <ArticleCommunity articleId={article.id} isDemo={article.isDemo} />
    </div>
  );
}
