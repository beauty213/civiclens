import React from 'react';
import { EvidenceStatus } from '@/types';
import { CheckCircle2, AlertCircle, HelpCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface StatusBadgeProps {
  status: EvidenceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'Well-supported':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Well-supported
        </span>
      );
    case 'Supported with context':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Supported with context
        </span>
      );
    case 'Needs verification':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-800">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          Needs verification
        </span>
      );
    case 'Conflicting reports':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-purple-950/80 text-purple-300 border border-purple-800">
          <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
          Conflicting reports
        </span>
      );
    case 'Insufficient evidence':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
          Insufficient evidence
        </span>
      );
    case 'Contradicted by available evidence':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-800">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Contradicted by available evidence
        </span>
      );
    default:
      return null;
  }
}
