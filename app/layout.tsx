// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { LocationProvider } from '@/context/LocationContext';
import { TopNavbar } from '@/components/navigation/TopNavbar';
import { BottomNav } from '@/components/navigation/BottomNav';

export const metadata: Metadata = {
  title: 'CivicLens | Speak. Question. Explore the evidence.',
  description: 'A community-driven news, citizen journalism, and evidence exploration platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F17] font-sans text-slate-100 antialiased pb-20">
        <LocationProvider>
          <TopNavbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          <BottomNav />
        </LocationProvider>
      </body>
    </html>
  );
}