// components/navigation/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock3, FilePlus2, Home } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800/80 bg-[#0B0F17]/95 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-center gap-10">
        <Link
          href="/"
          aria-current={pathname === '/' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/intake"
          aria-current={pathname === '/intake' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/intake' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <FilePlus2 className="h-4 w-4" />
          <span>Analyze</span>
        </Link>
        <Link
          href="/incident"
          aria-current={pathname.startsWith('/incident') ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname.startsWith('/incident') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Clock3 className="h-4 w-4" />
          <span>Incident Room</span>
        </Link>
      </div>
    </nav>
  );
}