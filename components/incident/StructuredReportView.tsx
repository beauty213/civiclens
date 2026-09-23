// components/incident/StructuredReportView.tsx
import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, MapPin, Clock, HelpCircle, Eye, CheckCircle2 } from 'lucide-react';

export interface StructuredIncidentData {
  title: string;
  category: string;
  generalLocation: string;
  timestamp: string;
  authorIdentity: string;
  firsthandObservations: string[];
  hearsayOrThirdParty: string[];
  uncertainties: string[];
  evidenceNotes: string;
  openQuestions: string[];
}

interface StructuredReportViewProps {
  report: StructuredIncidentData;
  onReset?: () => void;
  onSubmitToCommunity?: () => void;
}

export function StructuredReportView({
  report,
  onReset,
  onSubmitToCommunity,
}: StructuredReportViewProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-6">
      {/* Header & Verification Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="warning">Citizen Incident Report</Badge>
          <span className="text-xs font-mono text-zinc-400">Author: {report.authorIdentity}</span>
        </div>
        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Structured by CivicLens Engine
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{report.title}</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-2 font-mono">
          <span className="flex items-center gap-1 text-indigo-400">
            <MapPin className="w-3.5 h-3.5" /> {report.generalLocation}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5" /> {report.timestamp}
          </span>
          <span>·</span>
          <span>Category: {report.category}</span>
        </div>
      </div>

      {/* Distinction 1: Firsthand Observations */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Firsthand Observations (Personally Witnessed)
        </h4>
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 space-y-1.5 leading-relaxed">
          {report.firsthandObservations.map((obs, idx) => (
            <p key={idx} className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{obs}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Distinction 2: Third-party / Information from Others */}
      {report.hearsayOrThirdParty.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" /> Information From Others / Unconfirmed Witnesses
          </h4>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-400 space-y-1.5 leading-relaxed italic">
            {report.hearsayOrThirdParty.map((info, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-zinc-600 font-bold">•</span>
                <span>&ldquo;{info}&rdquo;</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Distinction 3: Uncertainties & Unknown Information */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Preserved Unknowns & Author Uncertainties
        </h4>
        <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-200/90 space-y-1.5 leading-relaxed">
          {report.uncertainties.map((item, idx) => (
            <p key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Evidence Attachments */}
      <div className="text-xs text-zinc-400 bg-zinc-950 p-3 rounded border border-zinc-800">
        <strong className="text-zinc-300">Evidence Documentation:</strong> {report.evidenceNotes}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200"
        >
          ← Retake Interview / Edit
        </button>
        {onSubmitToCommunity && (
          <button
            onClick={onSubmitToCommunity}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Publish to Local Community
          </button>
        )}
      </div>
    </div>
  );
}