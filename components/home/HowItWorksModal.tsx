'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, X } from 'lucide-react';
import { EvidenceStatus } from '@/types';

const TIERS: Array<{ status: EvidenceStatus; className: string }> = [
  { status: 'Well-supported', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  { status: 'Supported with context', className: 'border-sky-500/30 bg-sky-500/10 text-sky-300' },
  { status: 'Needs verification', className: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { status: 'Conflicting reports', className: 'border-orange-500/30 bg-orange-500/10 text-orange-300' },
  { status: 'Insufficient evidence', className: 'border-zinc-600 bg-zinc-800/70 text-zinc-300' },
  { status: 'Contradicted by available evidence', className: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
];

const STEPS = [
  'Gemini finds current local news, or you submit a public story.',
  'Gemini separates the story into factual claims that can be checked.',
  'Each claim is compared with available source records and given an evidence tier.',
  'A grounding score summarizes the review. Open the story to read each claim, its receipts, and always credit the original source and image.',
];

export function HowItWorksModal() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    dialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-[4.75rem] z-30 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/95 px-3 py-2 text-xs font-medium text-zinc-200 shadow-lg shadow-black/20 backdrop-blur hover:border-indigo-500/50 hover:text-white"
        aria-haspopup="dialog"
      >
        <BookOpenCheck className="h-4 w-4 text-indigo-300" />
        How it works
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-it-works-title"
            tabIndex={-1}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-700 bg-[#111722] p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-300">CivicLens in four steps</p>
                <h2 id="how-it-works-title" className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">How it works</h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Close how it works"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ol className="mt-5 space-y-3">
              {STEPS.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 font-mono text-xs text-indigo-300">{index + 1}</span>
                  <p className="text-sm leading-relaxed text-zinc-300">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Evidence tiers</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {TIERS.map(({ status, className }) => (
                  <li key={status} className={`rounded-full border px-3 py-1.5 text-xs ${className}`}>{status}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
              <p className="max-w-xs text-xs leading-relaxed text-zinc-500">Always verify by reading the source receipts and attributed image credits.</p>
              <Link
                href="/intake"
                onClick={close}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Submit your own story
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
