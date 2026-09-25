// components/claims/ClaimLensView.tsx
'use client';

import React, { useState } from 'react';
import { Claim, EvidenceItem } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ClaimDiscussionSection } from '@/components/discussion/ClaimDiscussionSection';
import { AddEvidenceModal } from './AddEvidenceModal';
import { attachEvidenceToClaim } from '@/lib/dataService';
import { ShieldCheck, FileText, HelpCircle, AlertOctagon, ExternalLink, PlusCircle } from 'lucide-react';

interface ClaimLensViewProps {
  claims: Claim[];
}

export function ClaimLensView({ claims }: ClaimLensViewProps) {
  const [claimList, setClaimList] = useState<Claim[]>(claims);
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    claims.length > 0 ? claims[0].id : ''
  );
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const activeClaim = claimList.find((c) => c.id === selectedClaimId) || claimList[0];

  const handleEvidenceAdded = (item: EvidenceItem) => {
    // 1. Update data service
    attachEvidenceToClaim(activeClaim.id, item);

    // 2. Update local state
    setClaimList((prev) =>
      prev.map((c) => {
        if (c.id === activeClaim.id) {
          return {
            ...c,
            evidence: [item, ...c.evidence],
          };
        }
        return c;
      })
    );
  };

  if (!claimList || claimList.length === 0) {
    return (
      <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/60 text-center">
        <p className="text-sm text-zinc-400">No extracted claims have been registered for this article yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Disclaimer Notice: Blueprint Requirement */}
      <div className="p-3 bg-zinc-900 border-l-2 border-indigo-500 rounded-r text-xs text-zinc-400 leading-relaxed">
        <strong className="text-zinc-200">Evidence Assessment Notice:</strong> CivicLens assesses claims against available documentary and observational evidence. Assessments apply strictly to the specific statement and its verifiable sources, not to individuals, political organizations, or publications.
      </div>

      {/* Claim Selector Pills */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">
          Select Claim to Inspect ({claimList.length} Available)
        </span>
        <div className="flex flex-col gap-2">
          {claimList.map((claim, idx) => {
            const isSelected = claim.id === activeClaim.id;
            return (
              <button
                key={claim.id}
                onClick={() => setSelectedClaimId(claim.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-indigo-500 text-zinc-100 shadow-sm'
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-semibold text-indigo-400">
                    Claim #{idx + 1}
                  </span>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="text-xs line-clamp-2 leading-relaxed">&ldquo;{claim.claimText}&rdquo;</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Claim Deep Inspection Panel */}
      <div className="border border-zinc-800 rounded-xl bg-zinc-900 p-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-500">Source: {activeClaim.speakerOrSource}</span>
            <StatusBadge status={activeClaim.status} />
          </div>
          <h3 className="text-base font-medium text-zinc-100 leading-snug">
            &ldquo;{activeClaim.claimText}&rdquo;
          </h3>
          <div className="mt-3 p-3 bg-zinc-950/70 rounded border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
            <strong className="text-zinc-200">Assessment Context: </strong>
            {activeClaim.statusExplanation}
          </div>
        </div>

        {/* Evidence Lab Section */}
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Attached Evidence ({activeClaim.evidence.length})
            </h4>
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Evidence
            </button>
          </div>

          {activeClaim.evidence.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No primary documentation or field data linked yet.</p>
          ) : (
            <div className="space-y-2.5">
              {activeClaim.evidence.map((ev) => (
                <div key={ev.id} className="p-3 bg-zinc-950 rounded border border-zinc-800/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-200">{ev.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{ev.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
                    <span>
                      Provenance: <strong className="text-zinc-400">{ev.provenanceNote}</strong> (by{' '}
                      <span className="font-mono text-indigo-300">{ev.uploaderPseudonym}</span>)
                    </span>
                    {ev.sourceUrl && (
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        Source Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Information & Gaps */}
        {activeClaim.missingInformation.length > 0 && (
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 flex items-center gap-1.5 mb-2">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
              Missing Information / Data Gaps
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 bg-amber-950/20 border border-amber-900/40 p-3 rounded">
              {activeClaim.missingInformation.map((gap, i) => (
                <li key={i} className="leading-relaxed">{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Generated Analytical Questions */}
        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-indigo-300 flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Questions to Ask About This Claim
          </h4>
          <div className="space-y-2">
            {activeClaim.generatedQuestions.map((q, idx) => (
              <div key={idx} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                <span className="text-zinc-500 font-mono font-bold">Q{idx + 1}:</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Claim-Specific Discussion Section */}
        <ClaimDiscussionSection
          claimId={activeClaim.id}
          comments={activeClaim.comments}
          summary={activeClaim.discussionSummary}
        />
      </div>

      <AddEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        claimId={activeClaim.id}
        claimText={activeClaim.claimText}
        onEvidenceAdded={handleEvidenceAdded}
      />
    </div>
  );
}
