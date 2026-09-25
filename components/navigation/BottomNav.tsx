// components/navigation/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Users, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'Report', href: '/publish', icon: PlusSquare, isHighlight: true },
  { label: 'Local', href: '/local', icon: Users },
  { label: 'Me', href: '/me', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800/80 bg-[#0B0F17]/95 px-4 py-3 backdrop-blur-xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isHighlight) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 rounded-full border-2 border-[#0B0F17] bg-emerald-500 p-3 text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform hover:bg-emerald-400 active:scale-95"
                title="Submit Observation or Report"
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}