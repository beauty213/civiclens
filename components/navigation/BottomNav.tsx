// components/navigation/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800/80 bg-[#0B0F17]/95 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-center gap-8">
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
        {pathname.startsWith('/article/') && (
          <span aria-current="page" className="flex flex-col items-center gap-1 text-[10px] font-medium text-emerald-400">
            <ArrowLeft className="h-4 w-4" />
            <span>Article</span>
          </span>
        )}
      </div>
    </nav>
  );
}