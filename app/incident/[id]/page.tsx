'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_CITIZEN_REPORTS } from '@/lib/mockData';
import { MultipleWitnessComparison } from '@/components/incident/MultipleWitnessComparison';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, MapPin, AlertTriangle, Users } from 'lucide-react';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : 'rep-101';

  const report = MOCK_CITIZEN_REPORTS.find((r) => r.id === incidentId) || MOCK_CITIZEN_REPORTS[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Nav */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pulse
        </button>
        <span className="text-xs font-mono text-zinc-500">Incident Case File #{report.id}</span>
      </div>

      {/* Incident Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant={report.isFirsthandObservation ? 'warning' : 'neutral'}>
            {report.isFirsthandObservation ? 'Firsthand Observation' : 'Citizen Report'}
          </Badge>
          <span className="flex items-center gap-1 text-zinc-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {report.generalLocation}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500 font-mono">{report.timestamp}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight leading-snug">
          {report.title}
        </h1>

        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs space-y-2">
          <p className="text-zinc-300 leading-relaxed">{report.witnessSummary}</p>
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 text-[11px] text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span><strong>Author Noted Uncertainty:</strong> {report.uncertainties}</span>
          </div>
        </div>
      </div>

      {/* Multi-Witness Corroboration Engine */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Community Corroboration & Witness Synthesis
          </h2>
          <span className="text-xs font-mono text-zinc-400">
            {report.witnesses ? report.witnesses.length : 1} Contributor(s)
          </span>
        </div>

        <MultipleWitnessComparison
          witnesses={report.witnesses}
          synthesis={report.witnessSynthesis}
        />
      </section>
    </div>
  );
}
