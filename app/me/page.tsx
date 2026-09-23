// app/me/page.tsx
'use client';

import React, { useState } from 'react';
import { User, Bookmark, MapPin, ShieldCheck, History, Sliders } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { StoryCard } from '@/components/news/StoryCard';

export default function MePage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'locations' | 'contributions'>('saved');

  const followedLocations = [
    { name: 'Gachibowli', level: 'Area' },
    { name: 'Hyderabad', level: 'District' },
    { name: 'Telangana', level: 'State' },
    { name: 'India', level: 'Country' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Profile Overview Card */}
      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-300 font-mono font-bold text-lg">
            CL
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              Citizen Observer #04
              <Badge variant="accent">Verified Contributor</Badge>
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Publishing Pseudonym: <span className="text-indigo-400">Observer_Hyd_04</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-4 text-zinc-400">
          <div>
            <span className="block text-zinc-200 font-bold text-sm">3</span>
            <span>Reports Filed</span>
          </div>
          <div>
            <span className="block text-zinc-200 font-bold text-sm">5</span>
            <span>Claims Examined</span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'saved'
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
          Saved Stories
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'locations'
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          Followed Hierarchy
        </button>

        <button
          onClick={() => setActiveTab('contributions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'contributions'
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-3.5 h-3.5 text-indigo-400" />
          My Activity
        </button>
      </div>

      {/* Tab 1: Saved Stories */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">Stories saved for evidence tracking and claim updates.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StoryCard article={MOCK_ARTICLES[0]} />
          </div>
        </div>
      )}

      {/* Tab 2: Followed Locations */}
      {activeTab === 'locations' && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-400">
            Geographic jurisdictions followed in your personalized CivicLens pulse:
          </p>
          <div className="space-y-2">
            {followedLocations.map((loc) => (
              <div
                key={loc.name}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 text-zinc-200">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{loc.name}</span>
                </div>
                <Badge variant="neutral">{loc.level}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Contributions */}
      {activeTab === 'contributions' && (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400 space-y-2">
          <ShieldCheck className="w-6 h-6 text-indigo-400 mx-auto" />
          <p className="text-zinc-200 font-medium">1 Citizen Report currently active in Gachibowli Community</p>
          <p className="text-zinc-500 text-[11px]">
            Incident report &ldquo;Water main burst near Telecom Nagar&rdquo; verified by 2 community witnesses.
          </p>
        </div>
      )}
    </div>
  );
}
