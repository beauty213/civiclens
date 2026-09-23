// components/navigation/TopNavbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, Bell } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { LocationModal } from './LocationModal';

export function TopNavbar() {
  const { scope, getActiveScopeLabel } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* CivicLens Brand Identity */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-lg text-zinc-100">
              Civic<span className="text-indigo-400">Lens</span>
            </span>
            <span className="hidden sm:inline text-xs text-zinc-500 border-l border-zinc-800 pl-2">
              Speak. Question. Explore the evidence.
            </span>
          </Link>

          {/* Geographic Scope Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded text-xs text-zinc-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium">{getActiveScopeLabel()}</span>
              <span className="text-zinc-500 font-mono text-[10px]">({scope})</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              aria-label="Notifications"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded border border-zinc-800 bg-zinc-900"
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