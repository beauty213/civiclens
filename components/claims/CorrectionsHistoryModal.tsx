// components/claims/CorrectionsHistoryModal.tsx
import React from 'react';
import { ArticleCorrection } from '@/types';
import { X, History, AlertTriangle } from 'lucide-react';

interface CorrectionsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  corrections?: ArticleCorrection[];
}

export function CorrectionsHistoryModal({
  isOpen,
  onClose,
  corrections = [],
}: CorrectionsHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Correction & Revision History</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          CivicLens enforces complete editorial transparency. Reporting is not silently replaced; revisions, reasons, and prior versions are preserved.
        </p>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {corrections.length === 0 ? (
            <p className="text-xs text-zinc-500 italic text-center py-4">
              No formal corrections or amendments have been filed for this story.
            </p>
          ) : (
            corrections.map((cor) => (
              <div key={cor.id} className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px]">
                  <span>Revised: {cor.timestamp}</span>
                  <span className="text-amber-400 font-medium">Verified Correction</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-rose-400/90">Prior Text:</span>
                  <p className="line-through text-zinc-500 italic bg-rose-950/20 p-2 rounded border border-rose-900/30">
                    &ldquo;{cor.originalText}&rdquo;
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400/90">Updated Text:</span>
                  <p className="text-zinc-200 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                    &ldquo;{cor.correctedText}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-900 text-[11px] text-zinc-400">
                  <strong>Reason:</strong> {cor.reason}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
        >
          Close History
        </button>
      </div>
    </div>
  );
}
