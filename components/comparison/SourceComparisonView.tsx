// components/comparison/SourceComparisonView.tsx
import React from 'react';
import { StoryComparison } from '@/types';
import { CheckCircle2, Split, EyeOff, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface SourceComparisonViewProps {
  comparison?: StoryComparison;
}

export function SourceComparisonView({ comparison }: SourceComparisonViewProps) {
  if (!comparison) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400">
        Comparative cross-source data has not been linked for this article yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Neutrality Statement: Blueprint Section 13 & 32 */}
      <div className="p-3.5 bg-zinc-900 border-l-2 border-indigo-500 rounded-r text-xs text-zinc-300 leading-relaxed">
        <strong className="text-zinc-100">Information Integrity Protocol:</strong> CivicLens does not compute political bias scores or rank news outlets. The matrix below highlights verifiable common ground, factual divergences, and information omitted by specific reporting angles.
      </div>

      {/* 1. Agreed Common Facts */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
        <h4 className="text-xs uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Common Information (Consistent Across Sources)
        </h4>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {comparison.commonAgreedFacts.map((fact, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800/60 leading-relaxed">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Divergent Details / Differing Claims */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
        <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 flex items-center gap-1.5">
          <Split className="w-4 h-4 text-amber-400" />
          Different Claims & Divergent Details
        </h4>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {comparison.divergentDetails.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded text-amber-200/90 leading-relaxed">
              <span className="text-amber-500 font-bold">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Multi-Source Cards */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          Coverage Breakdown by Outlet & Witness Group ({comparison.sources.length} Reports)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison.sources.map((src, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="accent">{src.sourceName}</Badge>
                  <span className="font-mono text-zinc-500 text-[11px]">{src.publicationDate}</span>
                </div>
                <h5 className="text-xs font-semibold text-zinc-200 leading-snug">
                  &ldquo;{src.headline}&rdquo;
                </h5>
                <p className="text-[11px] text-zinc-500 font-mono">
                  By {src.authorOrEntity} · Focus: <span className="text-zinc-400">{src.framingFocus}</span>
                </p>

                {/* Key Claims Highlighted */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-indigo-400">Claims Highlighted:</span>
                  <ul className="list-disc list-inside text-xs text-zinc-300 space-y-0.5">
                    {src.keyClaimsHighlighted.map((claim, cIdx) => (
                      <li key={cIdx} className="leading-relaxed">{claim}</li>
                    ))}
                  </ul>
                </div>

                {/* Omitted / Missing Information */}
                {src.omittedOrUnmentioned.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                      <EyeOff className="w-3 h-3 text-zinc-500" /> Omitted in this report:
                    </span>
                    <ul className="list-disc list-inside text-xs text-zinc-400 space-y-0.5">
                      {src.omittedOrUnmentioned.map((om, oIdx) => (
                        <li key={oIdx} className="leading-relaxed">{om}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
