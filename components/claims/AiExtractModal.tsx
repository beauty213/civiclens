'use client';

import React, { useState } from 'react';
import { Cpu, Sparkles, Loader2, X } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EvidenceStatus } from '@/types';

interface AiExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
  articleText: string;
}

export function AiExtractModal({
  isOpen,
  onClose,
  articleId,
  articleTitle,
  articleText,
}: AiExtractModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunExtraction = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/extract-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          headline: articleTitle,
          text_content: articleText,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Qualcomm AI Engine · Claim Analysis
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-zinc-950 border border-indigo-950 rounded-lg text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-indigo-400 font-semibold">Qualcomm AI Hub Runtime</span>
            <span className="text-zinc-500">Architecture Isolation</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Claims are processed using model pipelines tailored for Qualcomm Hexagon NPUs. Development execution on x86/Linux hosts uses local emulation.
          </p>
        </div>

        {!result && (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-zinc-400">
              Analyze article paragraphs to isolate falsifiable claims, identify missing evidence, and formulate analytical questions.
            </p>
            <button
              onClick={handleRunExtraction}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing via AI Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Run Live Claim Extraction
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800 pb-2">
              <span>Runtime: <strong className="text-indigo-300">{result.engine_runtime}</strong></span>
              <span>Target: <strong className="text-zinc-200">{result.target_hardware}</strong></span>
            </div>

            <div className="space-y-2.5">
              {result.claims.map((c: any, idx: number) => (
                <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-zinc-500 text-[10px]">Claim #{idx + 1}</span>
                    <StatusBadge status={c.status as EvidenceStatus} />
                  </div>
                  <h4 className="text-zinc-200 font-medium leading-snug">&ldquo;{c.claim_text}&rdquo;</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{c.status_explanation}</p>

                  <div className="pt-2 border-t border-zinc-900 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400/90">Missing Information:</span>
                    <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-0.5">
                      {c.missing_information.map((m: string, i: number) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setResult(null)}
              className="text-xs font-mono text-indigo-400 hover:underline pt-2 block"
            >
              ← Run Another Analysis
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}
