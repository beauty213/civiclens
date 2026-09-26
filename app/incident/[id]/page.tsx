import Link from 'next/link';

export default function IncidentDetailComingSoonPage() {
  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
      <h1 className="text-xl font-semibold text-zinc-100">Incident Room</h1>
      <p className="text-sm leading-relaxed text-zinc-400">Witness reports are not part of this first release. For now, CivicLens focuses on checking public news claims against source records.</p>
      <Link href="/" className="inline-flex text-sm text-indigo-300 hover:text-indigo-200">Back to articles</Link>
    </section>
  );
}
