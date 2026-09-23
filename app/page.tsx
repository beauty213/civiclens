// app/page.tsx
import React from 'react';
import { SectionHeader } from '@/components/news/SectionHeader';
import { StoryCard } from '@/components/news/StoryCard';
import { Badge } from '@/components/ui/Badge';
import { MOCK_ARTICLES, MOCK_CITIZEN_REPORTS, MOCK_QUESTIONS } from '@/lib/mockData';
import { HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Lead Status Banner */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
            Local Civic Pulse
          </span>
          <span className="text-xs text-zinc-500">Live Context</span>
        </div>
        <h1 className="text-lg font-semibold text-zinc-100">
          What’s happening around you?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Showing verified coverage and citizen observations for <span className="text-zinc-200 font-medium">Gachibowli, Hyderabad</span>.
        </p>
      </section>

      {/* Happening Now & Recent News */}
      <section>
        <SectionHeader
          title="Happening Now & Recent News"
          subtitle="Direct reports and publications from regional corridors"
          badgeText="Verified Feed"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ARTICLES.map((article) => (
            <StoryCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Citizen Reports Section */}
      <section>
        <SectionHeader
          title="Citizen Reports & Firsthand Observations"
          subtitle="Observed by individuals in your immediate area"
          badgeText="Firsthand"
        />
        <div className="space-y-3">
          {MOCK_CITIZEN_REPORTS.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <Badge variant={report.isFirsthandObservation ? 'warning' : 'neutral'}>
                  {report.isFirsthandObservation ? 'Firsthand Observation' : 'Report'}
                </Badge>
                <span className="text-xs text-zinc-500 font-mono">{report.timestamp}</span>
              </div>

              <h4 className="text-sm font-medium text-zinc-200">{report.title}</h4>
              <p className="text-xs text-zinc-400">{report.witnessSummary}</p>

              <div className="mt-2 text-[11px] text-zinc-500 flex flex-col gap-1 border-t border-zinc-800 pt-2">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-500/70" />
                  <strong>Uncertainty noted by author:</strong> {report.uncertainties}
                </span>
                <span className="text-zinc-400">
                  Location: <strong className="text-zinc-300">{report.generalLocation}</strong> · By{' '}
                  <span className="font-mono text-zinc-300">{report.authorPseudonym}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Questions People Are Asking */}
      <section>
        <SectionHeader
          title="Questions People Are Asking"
          subtitle="Evidence examination questions raised by the community"
          badgeText="Evidence Lens"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOCK_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 mb-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">Regarding reported claim:</span>
                </div>
                <p className="text-xs italic text-zinc-400 mb-2 border-l-2 border-zinc-700 pl-2">
                  &ldquo;{q.targetClaim}&rdquo;
                </p>
                <p className="text-sm font-medium text-zinc-200 leading-snug">
                  {q.questionText}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Source: {q.contextSource}</span>
                <span className="text-indigo-400 hover:underline cursor-pointer">
                  {q.communityAnswersCount} community perspectives →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}