// components/incident/MultipleWitnessComparison.tsx
import React from 'react';
import { WitnessAccount, WitnessSynthesis } from '@/types';
import { CheckCircle2, Split, HelpCircle, Eye, AlertCircle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface MultipleWitnessComparisonProps {
  witnesses?: WitnessAccount[];
  synthesis?: WitnessSynthesis;
}

export function MultipleWitnessComparison({
  witnesses = [],
  synthesis,
}: MultipleWitnessComparisonProps) {
  if (!synthesis || witnesses.length === 0) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400">
        Single witness observation registered. Multiple corroborating accounts will appear here as neighbors contribute.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integrity Protocol Notice: Blueprint Section 16 */}
      <div className="p-3.5 bg-zinc-900 border-l-2 border-indigo-500 rounded-r text-xs text-zinc-300 leading-relaxed">
        <strong className="text-zinc-100">Multiple Witnesses Corroboration Engine:</strong> CivicLens analyzes multiple testimonies to highlight points of agreement, unique perspectives, and factual divergences. The platform never labels individuals or infers intent.
      </div>

      {/* 4-Category Synthesis Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Common Details */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5">
          <h4 className="text-xs uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Common Details (Independently Corroborated)
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {synthesis.commonDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800/80 leading-relaxed">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Different Details */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5">
          <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Different Details (Single-Witness Observations)
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {synthesis.differentDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800/80 leading-relaxed">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Conflicting Accounts */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5">
          <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400 flex items-center gap-1.5">
            <Split className="w-3.5 h-3.5 text-amber-400" />
            Conflicting Accounts (Differences in Accounts)
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {synthesis.conflictingAccounts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded text-amber-200/90 leading-relaxed">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Unknown Details */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5">
          <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            Unknown Details (Preserved Gaps)
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {synthesis.unknownDetails.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800/80 leading-relaxed">
                <span className="text-zinc-500 font-bold">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Primary Witness Accounts Feed */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-indigo-400" />
          Submitted Witness Depositions ({witnesses.length})
        </h4>

        <div className="space-y-3">
          {witnesses.map((w, idx) => (
            <div
              key={w.id}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-indigo-300">
                    Witness #{idx + 1}: {w.witnessPseudonym}
                  </span>
                  <Badge variant="neutral">{w.timestamp}</Badge>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Vantage: {w.distanceFromEvent}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800/70 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                    Directly Witnessed:
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{w.directlyObserved}</p>
                </div>

                {w.unconfirmedOrHearsay && (
                  <div className="bg-zinc-950/60 p-2 rounded border border-zinc-800/50 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Information from Others (Unconfirmed):
                    </span>
                    <p className="text-zinc-400 italic leading-relaxed">&ldquo;{w.unconfirmedOrHearsay}&rdquo;</p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 pt-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>Stated Uncertainty: {w.statedUncertainty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
