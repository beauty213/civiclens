'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { computeArticleScore } from '@/lib/scoring/engine';
import { Article, Claim, EvidenceItem, EvidenceStatus } from '@/types';
import { UploadEvidenceModal } from '@/components/evidence/UploadEvidenceModal';

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
  return (
    <li className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-medium text-zinc-100">{evidence.title}</h4>
            {evidence.sourceUrl && (
              <a
                href={evidence.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-zinc-500 hover:text-indigo-300"
                aria-label={`Open ${evidence.title}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{evidence.description}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-zinc-500">
            <span>{evidence.type}</span>
            <span>by {evidence.uploaderPseudonym}</span>
            <span>{evidence.date}</span>
          </div>
          <p className="mt-2 border-l border-indigo-500/40 pl-2 text-[11px] italic text-zinc-500">
            {evidence.provenanceNote}
          </p>
        </div>
      </div>
    </li>
  );
}

function ClaimInspector({
  claims,
  selectedClaimId,
  onSelect,
  onUpload,
}: {
  claims: Claim[];
  selectedClaimId: string | null;
  onSelect: (claimId: string) => void;
  onUpload: (claim: Claim) => void;
}) {
  const selectedClaim = claims.find((claim) => claim.id === selectedClaimId) ?? claims[0];
  const score = computeArticleScore(claims);

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900/70">
      <div className="border-b border-zinc-800 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-400">Forensic assessment</p>
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
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-zinc-500">{claim.evidence.length} primary record{claim.evidence.length === 1 ? '' : 's'}</span>
                      <button
                        type="button"
                        onClick={() => onUpload(claim)}
                        className="inline-flex items-center gap-1 rounded border border-indigo-500/40 px-2 py-1 text-[11px] text-indigo-300 hover:bg-indigo-500/10"
                      >
                        <Plus className="h-3 w-3" /> Add evidence
                      </button>
                    </div>
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
  const article = MOCK_ARTICLES.find((candidate) => candidate.id === articleId) || MOCK_ARTICLES[0];
  const [claims, setClaims] = useState(article.claims);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(article.claims[0]?.id ?? null);
  const [uploadClaim, setUploadClaim] = useState<Claim | null>(null);

  const handleEvidenceAdded = (item: EvidenceItem) => {
    if (!uploadClaim) return;
    setClaims((currentClaims) => currentClaims.map((claim) => (
      claim.id === uploadClaim.id ? { ...claim, evidence: [...claim.evidence, item] } : claim
    )));
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </button>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> LIVE EVIDENCE WORKSPACE</span>
          <span className="hidden text-zinc-700 sm:inline">/</span>
          <span>{article.claims.length} indexed claims</span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)] lg:items-stretch">
        <main className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-8">
          <div className="mb-7 space-y-3 border-b border-zinc-800 pb-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-indigo-300">{article.category}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-400" />{article.location?.area}, {article.location?.district}</span>
              <span>·</span>
              <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-3xl">{article.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span>By <strong className="text-zinc-300">{article.author}</strong> · {article.sourceName}</span>
              <span className="inline-flex items-center gap-1 text-indigo-300"><ShieldCheck className="h-3.5 w-3.5" /> Claims are highlighted for inspection</span>
            </div>
          </div>
          <HighlightedArticle article={{ ...article, claims }} selectedClaimId={selectedClaimId} onSelect={setSelectedClaimId} />
        </main>

        <ClaimInspector
          claims={claims}
          selectedClaimId={selectedClaimId}
          onSelect={setSelectedClaimId}
          onUpload={(claim) => { setSelectedClaimId(claim.id); setUploadClaim(claim); }}
        />
      </div>

      {uploadClaim && (
        <UploadEvidenceModal
          isOpen
          onClose={() => setUploadClaim(null)}
          claimId={uploadClaim.id}
          claimText={uploadClaim.claimText}
          onEvidenceAdded={handleEvidenceAdded}
        />
      )}
    </div>
  );
}
