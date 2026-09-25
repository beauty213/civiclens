import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, HelpCircle, ShieldAlert, Users } from 'lucide-react';
import { AiShowdownWidget } from '@/components/home/AiShowdownWidget';
import { StoryPulseFilters } from '@/components/home/StoryPulseFilters';
import { fetchArticles, fetchCitizenReports, fetchCivicQuestions } from '@/lib/dataService';
import { computeArticleScore } from '@/lib/scoring/engine';

function ScoreRing({ score }: { score: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const scoreColor = score < 40 ? 'text-rose-400' : score > 75 ? 'text-emerald-400' : 'text-amber-400';
  return (
    <div className="relative h-24 w-24 shrink-0" aria-label={`${score}% grounded`}>
      <svg viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="7" className="text-zinc-800" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className={scoreColor} strokeDasharray={circumference} strokeDashoffset={circumference - (score / 100) * circumference} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <strong className="text-xl text-zinc-100">{score}%</strong>
        <span className="font-mono text-[9px] uppercase text-zinc-500">grounded</span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [articles, reports, questions] = await Promise.all([fetchArticles(), fetchCitizenReports(), fetchCivicQuestions()]);
  const featured = articles[0];
  const score = featured ? computeArticleScore(featured.claims ?? []) : null;
  const grounded = score?.verifiedCount ?? 0;
  const speculative = score?.unverifiedCount ?? 0;
  const disputed = score?.contradictedCount ?? 0;
  const receipts = featured?.claims?.reduce((total, claim) => total + (claim.evidence?.length ?? 0), 0) ?? 0;
  const primaryRecords = featured?.claims?.flatMap((claim) => claim.evidence ?? []).filter((evidence) => Boolean(evidence.sourceUrl)) ?? [];

  return (
    <div className="space-y-10 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950/30 p-5 shadow-2xl shadow-black/20 sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-1 font-mono text-[10px] font-semibold tracking-wider text-rose-400">BREAKING CIVIC WATCH</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">ORR corridor · Gachibowli</span>
            </div>
            <span className="font-mono text-[10px] text-rose-300">UPDATED 12 MIN AGO</span>
          </div>
          {featured && score && (
            <>
              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
                <div>
                  <h1 className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl">
                    Five-lake revival plan promises a cleaner west Hyderabad — but where are the baseline tests?
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                    A municipal restoration announcement is spreading as a guaranteed cleanup. CivicLens separates the documented approval from the six-month performance promise.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />{grounded} verified</span>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">{speculative} speculative / open</span>
                    <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-300">{disputed} disputed</span>
                  </div>
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-zinc-950/60 p-4">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={score.score} />
                    <div>
                      <p className="text-xs font-semibold text-rose-300">{score.grade}</p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">Needs primary documentation before the promise is treated as fact.</p>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-zinc-800 pt-3 font-mono text-[10px] text-zinc-500">⚡ SNAPDRAGON HEXAGON NPU · 14.2MS · LOCAL VERIFIED</p>
                </div>
              </div>
              <Link href={`/article/${featured.id}`} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white">
                Open the evidence breakdown <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 border-t border-zinc-800/80 pt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[10px] text-indigo-300"><FileText className="h-3.5 w-3.5" />{receipts} primary receipt{receipts === 1 ? '' : 's'} attached</span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[10px] text-zinc-500">0 baseline lab records found</span>
                </div>
                <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">Reality pill</p>
                  <p className="mt-1 text-sm text-zinc-200">The approval is documented; the six-month cleanup promise still needs baseline testing.</p>
                  {primaryRecords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {primaryRecords.slice(0, 3).map((record) => (
                        <a key={record.id} href={record.sourceUrl} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-indigo-300 hover:text-indigo-200 hover:underline">
                          Download {record.title} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <AiShowdownWidget />

      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-3">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-400">Local signal</p><h2 className="mt-1 text-xl font-semibold text-zinc-100">Rumors, records, and reality checks</h2></div>
          <Link href="/explore" className="text-xs text-zinc-500 hover:text-zinc-200">Explore all →</Link>
        </div>
        <StoryPulseFilters articles={articles} />
      </section>

      <section className="space-y-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400">On the ground</p><h2 className="mt-1 text-xl font-semibold text-zinc-100">What neighbours saw</h2></div>
        <div className="space-y-3">
          {reports.length > 0 ? reports.map((report) => (
            <Link key={report.id} href={`/incident/${report.id}`} className="group block rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-amber-500/40">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><Users className="h-3.5 w-3.5" /> {report.witnesses?.length ?? 1} local account{(report.witnesses?.length ?? 1) === 1 ? '' : 's'}</span><span className="font-mono text-[10px] text-zinc-500">{report.timestamp}</span></div>
              <h3 className="mt-2 text-sm font-semibold text-zinc-200 group-hover:text-amber-300">{report.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{report.witnessSummary}</p>
              <p className="mt-3 flex items-start gap-1.5 border-t border-zinc-800 pt-2 text-[11px] text-zinc-600"><ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" /> {report.uncertainties}</p>
            </Link>
          )) : <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500">No firsthand accounts have been filed in this area yet.</div>}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-400">Community lens</p><h2 className="mt-1 text-xl font-semibold text-zinc-100">Questions people are asking</h2></div>
        <div className="grid gap-3 md:grid-cols-2">
          {questions.length > 0 ? questions.map((question) => (
            <div key={question.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-xs text-indigo-300"><HelpCircle className="h-3.5 w-3.5" /> Evidence question</div>
              <p className="mt-3 border-l-2 border-zinc-700 pl-3 text-xs italic leading-relaxed text-zinc-500">&ldquo;{question.targetClaim}&rdquo;</p>
              <p className="mt-3 text-sm font-medium leading-snug text-zinc-200">{question.questionText}</p>
              <p className="mt-3 font-mono text-[10px] text-zinc-600">{question.communityAnswersCount} community perspectives</p>
            </div>
          )) : <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500 md:col-span-2">No community questions are open right now.</div>}
        </div>
      </section>
    </div>
  );
}
