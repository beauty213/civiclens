// components/claims/ClaimLensView.tsx
'use client';

import React, { useState } from 'react';
import { Claim, EvidenceStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { 
  ShieldCheck, 
  HelpCircle, 
  AlertOctagon, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface ClaimLensViewProps {
  claims: Claim[];
}

export function ClaimLensView({ claims }: ClaimLensViewProps) {
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(
    claims.length > 0 ? claims[0].id : null
  );

  const getStatusBadgeVariant = (status: EvidenceStatus): 'neutral' | 'accent' | 'warning' | 'outline' => {
    switch (status) {
      case 'Well-supported':
        return 'accent';
      case 'Supported with context':
        return 'neutral';
      case 'Needs verification':
      case 'Conflicting reports':
      case 'Insufficient evidence':
        return 'warning';
      case 'Contradicted by available evidence':
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-lg p-3 text-xs text-indigo-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-indigo-100">Claim Lens Verification Standard</p>
          <p className="text-zinc-300 mt-0.5">
            Assessments examine specific assertions against verifiable sources and data. They do not rate politicians, parties, journalists, or organizations as a whole.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {claims.map((claim, index) => {
          const isExpanded = expandedClaimId === claim.id;

          return (
            <div
              key={claim.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-colors"
            >
              {/* Claim Header Bar */}
              <div
                onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                className="p-4 cursor-pointer hover:bg-zinc-850/50 flex items-start justify-between gap-3 select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-zinc-500 font-semibold">
                      CLAIM #{index + 1}
                    </span>
                    <Badge variant={getStatusBadgeVariant(claim.assessmentStatus)}>
                      {claim.assessmentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-zinc-100 leading-snug">
                    &ldquo;{claim.statement}&rdquo;
                  </p>
                </div>
                <button
                  aria-label={isExpanded ? 'Collapse claim' : 'Expand claim'}
                  className="text-zinc-400 hover:text-zinc-200 mt-1"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Collapsible Deep Evidence Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/70 space-y-4 text-xs">
                  {/* Status Explanation */}
                  <div>
                    <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                      Evidence Assessment
                    </span>
                    <p className="mt-1 text-zinc-300 leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-800/80">
                      {claim.statusExplanation}
                    </p>
                  </div>

                  {/* Documented Evidence Items */}
                  {claim.evidence && claim.evidence.length > 0 && (
                    <div>
                      <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                        Attached Evidence & Artifacts ({claim.evidence.length})
                      </span>
                      <div className="mt-1.5 space-y-2">
                        {claim.evidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-2.5 rounded bg-zinc-950/70 border border-zinc-800 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                {ev.title}
                              </span>
                              <Badge variant="outline">{ev.type}</Badge>
                            </div>
                            <p className="text-zinc-400 text-[11px]">{ev.relationshipToClaim}</p>
                            <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/60 mt-1">
                              <span>Source: {ev.publisherOrWitness}</span>
                              <span>Dated: {ev.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conflicting Information (if present) */}
                  {claim.conflictingInformation && (
                    <div className="p-2.5 rounded bg-amber-950/20 border border-amber-900/40 text-amber-200">
                      <span className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1 text-amber-400">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Conflicting Information
                      </span>
                      <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                        {claim.conflictingInformation}
                      </p>
                    </div>
                  )}

                  {/* Missing Information */}
                  {claim.missingInformation && (
                    <div>
                      <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                        Identified Missing Information
                      </span>
                      <p className="mt-1 text-zinc-400 italic bg-zinc-950/40 p-2 rounded border border-zinc-800/50">
                        {claim.missingInformation}
                      </p>
                    </div>
                  )}

                  {/* Inquiry / Question Generator */}
                  {claim.openQuestions && claim.openQuestions.length > 0 && (
                    <div>
                      <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        Constructive Questions for Investigation
                      </span>
                      <ul className="mt-1.5 space-y-1.5">
                        {claim.openQuestions.map((q, qIndex) => (
                          <li
                            key={qIndex}
                            className="text-zinc-300 bg-zinc-950 p-2 rounded border border-zinc-800 flex items-start gap-2"
                          >
                            <span className="text-indigo-400 font-mono text-[10px] mt-0.5">Q{qIndex + 1}:</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}