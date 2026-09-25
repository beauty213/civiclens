'use client';

import { useState } from 'react';
import { CheckCircle2, Cloud, Cpu, FileCheck2, LockKeyhole, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ShowdownMode = 'generic' | 'civiclens';

export function AiShowdownWidget() {
  const [mode, setMode] = useState<ShowdownMode>('civiclens');

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-black/20">
      <div className="border-b border-zinc-800 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-400">The contrast engine</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
              Why not just ask a chatbot?
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-400">
              See the difference between a plausible answer and an auditable local record.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] text-emerald-300">
          LOCAL-FIRST · RECEIPTS REQUIRED
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1" role="tablist" aria-label="AI comparison">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'generic'}
            onClick={() => setMode('generic')}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${mode === 'generic' ? 'bg-rose-500/15 text-rose-300' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Cloud className="h-4 w-4" /> Generic cloud AI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'civiclens'}
            onClick={() => setMode('civiclens')}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${mode === 'civiclens' ? 'bg-emerald-500/15 text-emerald-300' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Cpu className="h-4 w-4" /> CivicLens pipeline
          </button>
        </div>
      </div>

      {mode === 'generic' ? (
        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
              <Cloud className="h-3.5 w-3.5 text-zinc-400" /> CHATBOT RESPONSE
            </div>
            <p className="rounded-lg rounded-tl-sm bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-300">
              “There are multiple reports regarding disruptions on the Outer Ring Road. Protests often occur for various reasons. Please monitor local news and consult local authorities.”
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-medium text-zinc-300">A confident tone is not a receipt.</p>
            <ul className="space-y-2">
              {['⚠️ Vague hallucination', '⚠️ Zero primary documents', '⚠️ Hyperlocal blindspot', '⚠️ Cloud privacy exposure'].map((flaw) => (
                <li key={flaw} className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-300">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" /> {flaw}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-300">
                <FileCheck2 className="h-3.5 w-3.5" /> CLAIM 01 · MUNICIPAL GAZETTE
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">Sentence 1 isolated as a testable claim → disproven by Municipal Gazette #2026-HYD: the record documents expansion work, not a structural collapse.</p>
              <p className="mt-2 font-mono text-[10px] text-emerald-400">RECEIPT ATTACHED · SOURCE TRACEABLE</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> CLAIM 02 · FIRSTHAND RECORD
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">Sentence 2 cross-referenced with traffic sensor logs → routine pipeline maintenance confirmed.</p>
              <p className="mt-2 font-mono text-[10px] text-emerald-400">LOCAL CONTEXT · CLAIM SEPARATED</p>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-medium text-zinc-300">A claim is only useful when someone can inspect the trail.</p>
            <ul className="space-y-2">
              {( [
                [FileCheck2, 'Primary PDF attached'],
                [Cpu, '14.2ms Snapdragon NPU processing'],
                [LockKeyhole, 'Zero user data leaves device'],
                [CheckCircle2, 'Cryptographic chain of custody'],
              ] as Array<[LucideIcon, string]>).map(([Icon, label]) => (
                <li key={label} className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
                  <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
