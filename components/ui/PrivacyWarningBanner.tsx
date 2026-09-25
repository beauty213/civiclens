import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface PrivacyWarningBannerProps {
  warnings: string[];
}

export function PrivacyWarningBanner({ warnings }: PrivacyWarningBannerProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg space-y-1 text-xs text-amber-200">
      <div className="flex items-center gap-1.5 font-semibold text-amber-300">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>CivicLens Privacy & Integrity Alert</span>
      </div>
      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1 leading-relaxed">
        {warnings.map((w, idx) => (
          <li key={idx}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
