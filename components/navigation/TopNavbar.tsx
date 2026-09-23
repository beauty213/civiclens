// components/navigation/TopNavbar.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, ChevronDown, Bell } from 'lucide-react';
import { INITIAL_LOCATION } from '@/lib/mockData';

export function TopNavbar() {
  const [currentLevel, setCurrentLevel] = useState<'Area' | 'District' | 'State' | 'Country' | 'World'>('Area');
  const [activeLocation, setActiveLocation] = useState(INITIAL_LOCATION);

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* CivicLens Brand Identity */}
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-lg text-zinc-100">
            Civic<span className="text-indigo-400">Lens</span>
          </span>
          <span className="hidden sm:inline text-xs text-zinc-500 border-l border-zinc-800 pl-2">
            Speak. Question. Explore the evidence.
          </span>
        </div>

        {/* Geographic Scope Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded text-xs text-zinc-200 cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">
              {currentLevel === 'Area' && activeLocation.area}
              {currentLevel === 'District' && activeLocation.district}
              {currentLevel === 'State' && activeLocation.state}
              {currentLevel === 'Country' && activeLocation.country}
              {currentLevel === 'World' && 'Worldwide'}
            </span>
            <span className="text-zinc-500 font-mono text-[10px]">({currentLevel})</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>

          <button
            aria-label="Notifications"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded border border-zinc-800 bg-zinc-900"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}