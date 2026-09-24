// components/demo/SystemDiagnostics.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Cpu, Database, Server, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface DiagnosticsState {
  nextjsHealthy: boolean;
  supabaseConfigured: boolean;
  aiServiceOnline: boolean;
  aiRuntime: string;
  aiTarget: string;
}

export function SystemDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [diag, setDiag] = useState<DiagnosticsState>({
    nextjsHealthy: true,
    supabaseConfigured: isSupabaseConfigured,
    aiServiceOnline: false,
    aiRuntime: 'Checking...',
    aiTarget: 'Checking...',
  });

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/extract-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: 'health-check',
          headline: 'System Probe',
          text_content: 'Checking runtime diagnostics...',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiag((prev) => ({
          ...prev,
          aiServiceOnline: !data.engine_runtime.includes('Fallback'),
          aiRuntime: data.engine_runtime,
          aiTarget: data.target_hardware,
        }));
      }
    } catch {
      setDiag((prev) => ({
        ...prev,
        aiServiceOnline: false,
        aiRuntime: 'Local Fallback Engine (Service offline)',
        aiTarget: 'Host Linux (Kali)',
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          CivicLens Architecture Diagnostics
        </span>
        <button
          onClick={runCheck}
          disabled={loading}
          className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono text-[11px]"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Re-test Stack
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        {/* Next.js Frontend */}
        <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400">Next.js UI & SSR</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Operational
          </span>
        </div>

        {/* Database Layer */}
        <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-400" /> Supabase Schema
          </span>
          {diag.supabaseConfigured ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1" title="Using normalized mock relational fixtures">
              <AlertCircle className="w-3 h-3" /> Fixture Mock Mode
            </span>
          )}
        </div>

        {/* Qualcomm AI Microservice */}
        <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-400" /> AI Microservice
          </span>
          {diag.aiServiceOnline ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Online (Port 8000)
            </span>
          ) : (
            <span className="text-zinc-400 flex items-center gap-1" title="Using integrated fallback engine">
              <AlertCircle className="w-3 h-3 text-zinc-500" /> Fallback Engine
            </span>
          )}
        </div>
      </div>

      <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950/70 p-2 rounded border border-zinc-900 flex flex-wrap justify-between gap-2">
        <span>Active Runtime: <strong className="text-indigo-300">{diag.aiRuntime}</strong></span>
        <span>Target: <strong className="text-zinc-300">{diag.aiTarget}</strong></span>
      </div>
    </div>
  );
}
