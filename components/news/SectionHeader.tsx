// components/news/SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
}

export function SectionHeader({ title, subtitle, badgeText }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-0.5 mb-3 border-b border-zinc-800 pb-2">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-100 tracking-tight">{title}</h2>
        {badgeText && (
          <span className="text-xs uppercase tracking-wider font-mono text-zinc-500">
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
    </div>
  );
}