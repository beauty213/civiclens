// components/navigation/TopNavbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, Bell, PlayCircle } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { LocationModal } from './LocationModal';

export function TopNavbar() {
  const { scope, getActiveScopeLabel } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/70 bg-[#0B0F17]/85 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* CivicLens Brand Identity */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-slate-100">
              Civic<span className="text-emerald-400">Lens</span>
            </span>
            <span className="hidden border-l border-slate-800 pl-2 text-xs text-slate-500 sm:inline">
              Speak. Question. Explore the evidence.
            </span>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Demo Mode Button */}
            <Link
              href="/demo"
              className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono text-emerald-300 transition-colors hover:border-emerald-500/40"
              title="Open 18-Step Specification Demo Walkthrough"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Demo</span>
            </Link>

            {/* Geographic Scope Selector */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:border-slate-700"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-medium">{getActiveScopeLabel()}</span>
              <span className="font-mono text-[10px] text-slate-500">({scope})</span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            <button
              aria-label="Notifications"
              className="rounded-full border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-emerald-300"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <LocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
