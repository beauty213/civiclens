import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';

export default function IncidentRoomComingSoonPage() {
  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
      <Clock3 className="mx-auto h-8 w-8 text-zinc-500" />
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Incident Room</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Witness reports and community updates are not part of this first release.</p>
      </div>
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200">
        <ArrowLeft className="h-4 w-4" /> Back to articles
      </Link>
    </section>
  );
}
