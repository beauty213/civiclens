// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/news/SectionHeader';
import { StoryCard } from '@/components/news/StoryCard';
import { Badge } from '@/components/ui/Badge';
import { fetchArticles, fetchCitizenReports, fetchCivicQuestions } from '@/lib/dataService';
import { HelpCircle, AlertTriangle, ArrowRight, Users } from 'lucide-react';

export default async function HomePage() {
  const articles = await fetchArticles();
  const reports = await fetchCitizenReports();
  const questions = await fetchCivicQuestions();

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
          {articles.map((article) => (
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
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/incident/${report.id}`}
              className="block p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-800/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={report.isFirsthandObservation ? 'warning' : 'neutral'}>
                    {report.isFirsthandObservation ? 'Firsthand Observation' : 'Report'}
                  </Badge>
                  {report.witnesses && report.witnesses.length > 1 && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900">
                      <Users className="w-3 h-3" />
                      {report.witnesses.length} witnesses corroborated
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 font-mono">{report.timestamp}</span>
              </div>

              <h4 className="text-sm font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors">
                {report.title}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {report.witnessSummary}
              </p>

              <div className="mt-3 text-[11px] text-zinc-500 flex flex-col gap-1 border-t border-zinc-800/80 pt-2">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-500/70 shrink-0" />
                  <strong>Uncertainty noted by author:</strong> {report.uncertainties}
                </span>
                <div className="flex items-center justify-between text-zinc-400 pt-0.5">
                  <span>
                    Location: <strong className="text-zinc-300">{report.generalLocation}</strong> · By{' '}
                    <span className="font-mono text-zinc-300">{report.authorPseudonym}</span>
                  </span>
                  <span className="text-indigo-400 flex items-center gap-1 font-mono group-hover:translate-x-0.5 transition-transform">
                    Inspect Deposition Matrix <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
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
          {questions.map((q) => (
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
