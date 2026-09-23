// components/navigation/LocationModal.tsx
'use client';

import React from 'react';
import { GeographicScope } from '@/types';
import { useLocation, PRESET_LOCATIONS } from '@/context/LocationContext';
import { X, Check, Globe, MapPin } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCOPES: GeographicScope[] = ['Area', 'District', 'State', 'Country', 'World'];

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { location, scope, setLocation, setScope } = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Geographic Scope & Area
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Filter stories and discussions by geographic proximity.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Geographic Zoom Levels */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            1. Select Geographic Scope Level
          </label>
          <div className="grid grid-cols-5 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {SCOPES.map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`py-1.5 text-xs font-mono rounded transition-colors text-center ${
                  scope === s
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Choose Regional Hub */}
        {scope !== 'World' && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              2. Switch Area / City
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {PRESET_LOCATIONS.map((preset) => {
                const isSelected = preset.area === location.area;
                return (
                  <button
                    key={preset.label}
                    onClick={() => setLocation(preset)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors border ${
                      isSelected
                        ? 'bg-zinc-800 border-indigo-500 text-zinc-100'
                        : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {scope === 'World' && (
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-center space-y-1">
            <Globe className="w-6 h-6 text-indigo-400 mx-auto" />
            <p className="text-xs text-zinc-200 font-medium">Worldwide Scope Active</p>
            <p className="text-[11px] text-zinc-500">
              Aggregating international reporting and major trans-boundary claims.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Apply Location Filter
        </button>
      </div>
    </div>
  );
}