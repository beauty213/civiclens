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
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col font-sans antialiased pb-20">
        <LocationProvider>
          <TopNavbar />
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-5">{children}</main>
          <BottomNav />
        </LocationProvider>
      </body>
    </html>
  );
}