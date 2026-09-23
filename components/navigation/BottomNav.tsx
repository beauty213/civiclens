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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isHighlight) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-3 shadow-lg border-2 border-zinc-950 transition-transform active:scale-95"
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
                isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
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