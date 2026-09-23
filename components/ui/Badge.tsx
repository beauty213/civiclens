// components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'warning' | 'outline';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const styles = {
    neutral: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    accent: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    warning: 'bg-amber-950 text-amber-300 border-amber-800',
    outline: 'bg-transparent text-zinc-400 border-zinc-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}