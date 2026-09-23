// app/publish/page.tsx
'use client';

import React, { useState } from 'react';
import { Eye, Edit3, MessageSquare, HelpCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { AiInterviewer } from '@/components/incident/AiInterviewer';
import Link from 'next/link';

type PublishMode = 'select' | 'witness' | 'article' | 'question' | 'opinion';

export default function PublishPage() {
  const [mode, setMode] = useState<PublishMode>('select');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Privacy & Safety Warning: Blueprint Section 19 */}
      <div className="p-3.5 bg-amber-950/20 border border-amber-900/50 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
          <p className="font-semibold text-amber-300">Privacy & Safety Notice</p>
          <p>
            Do NOT submit private telephone numbers, specific house/flat addresses, or identifiable personal data.
            CivicLens publishes general neighborhood locations to safeguard community contributors.
          </p>
        </div>
      </div>

      {mode === 'select' && (
        <div className="space-y-4">
          <div className="border-b border-zinc-800 pb-2">
            <h1 className="text-lg font-semibold text-zinc-100">Contribute to CivicLens</h1>
            <p className="text-xs text-zinc-400">
              Select what kind of information you wish to bring to your community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {/* 1. I Witnessed Something (AI Interviewer Entry) */}
            <button
              onClick={() => setMode('witness')}
              className="text-left p-4 rounded-xl bg-zinc-900 border border-indigo-900/60 hover:border-indigo-500 transition-all flex flex-col gap-2 group"
            >
              <div className="p-2 rounded bg-indigo-950/80 text-indigo-400 w-fit">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                I Witnessed Something
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Step into the AI Incident Room. The AI interviewer will help isolate firsthand observations from hearsay and formulate a clean report.
              </p>
            </button>

            {/* 2. Write an Article */}
            <button
              onClick={() => alert('Article authoring workflow connects to Markdown/CMS in Phase 6.')}
              className="text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-2 group"
            >
              <div className="p-2 rounded bg-zinc-800 text-zinc-300 w-fit">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-zinc-300">
                Write an Article
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Publish long-form reporting with structured citations, primary documents, and initial claims.
              </p>
            </button>

            {/* 3. Ask My Community */}
            <button
              onClick={() => alert('Community question dispatch connects to Local feed in Phase 8.')}
              className="text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-2 group"
            >
              <div className="p-2 rounded bg-zinc-800 text-zinc-300 w-fit">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-zinc-300">
                Ask My Community
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Post an open inquiry regarding an unverified public occurrence or local civic project.
              </p>
            </button>

            {/* 4. Share My Opinion */}
            <button
              onClick={() => alert('Perspectives section connects in Phase 9.')}
              className="text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-2 group"
            >
              <div className="p-2 rounded bg-zinc-800 text-zinc-300 w-fit">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-zinc-300">
                Share My Opinion
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Submit an analytical perspective or civic commentary, strictly labeled as Opinion.
              </p>
            </button>
          </div>
        </div>
      )}

      {mode === 'witness' && (
        <div className="space-y-4">
          <button
            onClick={() => setMode('select')}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Options
          </button>
          <AiInterviewer />
        </div>
      )}
    </div>
  );
}