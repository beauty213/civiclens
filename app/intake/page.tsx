import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NewsIntakeForm } from '@/components/forensics/NewsIntakeForm';

export default function NewsIntakePage() {
  return (
    <div className="space-y-5 pb-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to articles
      </Link>
      <NewsIntakeForm />
    </div>
  );
}
