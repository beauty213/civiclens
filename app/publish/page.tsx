// app/publish/page.tsx
'use client';

import React, { useState } from 'react';
import { PublishIntent, NewsCategory } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { 
  Eye, 
  Camera, 
  HelpCircle, 
  MessageSquare, 
  PenTool, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

const INTENT_OPTIONS: { id: PublishIntent; label: string; desc: string; icon: any }[] = [
  {
    id: 'witnessed',
    label: 'I Witnessed Something',
    desc: 'You were physically present and saw an event happen directly.',
    icon: Eye,
  },
  {
    id: 'saw',
    label: 'Share Something I Saw',
    desc: 'Notice an issue, physical condition, or civic matter in your area.',
    icon: Camera,
  },
  {
    id: 'ask',
    label: 'Ask My Community',
    desc: 'Raise an evidence-driven question to residents or local experts.',
    icon: HelpCircle,
  },
  {
    id: 'article',
    label: 'Write an Article',
    desc: 'Submit a detailed report synthesizing multiple sources.',
    icon: PenTool,
  },
  {
    id: 'opinion',
    label: 'Share My Opinion',
    desc: 'Express a community perspective clearly identified as an editorial.',
    icon: MessageSquare,
  },
];

const CATEGORIES: NewsCategory[] = [
  'Public Safety',
  'Environment',
  'Technology',
  'Education',
  'Business',
  'Science',
  'Culture',
  'Health',
  'Other',
];

export default function PublishPage() {
  const [selectedIntent, setSelectedIntent] = useState<PublishIntent | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generalLocation, setGeneralLocation] = useState('Gachibowli, Hyderabad');
  const [category, setCategory] = useState<NewsCategory>('Public Safety');
  const [isFirsthand, setIsFirsthand] = useState(true);
  const [uncertainties, setUncertainties] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [identityType, setIdentityType] = useState<'pseudonym' | 'real_name'>('pseudonym');
  const [authorName, setAuthorName] = useState('Observer_GHMC');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out both the title and observation description.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
        <h2 className="text-lg font-semibold text-zinc-100">Contribution Staged</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your report has been captured and categorized under{' '}
          <strong className="text-zinc-200">{category}</strong> for{' '}
          <strong className="text-zinc-200">{generalLocation}</strong>.
        </p>
        <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-left text-xs space-y-1">
          <p className="text-zinc-400">
            Observation Type:{' '}
            <strong className="text-zinc-200">{isFirsthand ? 'Firsthand' : 'Secondary Account'}</strong>
          </p>
          <p className="text-zinc-400">
            Author Identifier: <strong className="text-zinc-200">{authorName}</strong>
          </p>
          {uncertainties && (
            <p className="text-zinc-400">
              Noted Uncertainty: <span className="italic text-zinc-300">{uncertainties}</span>
            </p>
          )}
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedIntent(null);
              setTitle('');
              setDescription('');
              setUncertainties('');
              setEvidenceNotes('');
            }}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
          >
            Submit Another Report
          </button>
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200 py-1">
            Return to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View 1: Intent Selection */}
      {!selectedIntent ? (
        <div className="space-y-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">Contribute to CivicLens</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select the option that best reflects your information source:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {INTENT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedIntent(opt.id);
                    setIsFirsthand(opt.id === 'witnessed' || opt.id === 'saw');
                  }}
                  className="flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/80 rounded-lg text-left transition-colors group"
                >
                  <div className="p-2 rounded bg-zinc-800 group-hover:bg-indigo-950 text-zinc-300 group-hover:text-indigo-300 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                      {opt.label}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* View 2: Form Intake */
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <button
              type="button"
              onClick={() => setSelectedIntent(null)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change Category
            </button>
            <Badge variant="accent">
              {INTENT_OPTIONS.find((i) => i.id === selectedIntent)?.label}
            </Badge>
          </div>

          {/* Privacy Warning Banner */}
          <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">Privacy & Safety Notice</p>
              <p className="text-zinc-300 mt-0.5">
                Use general community locations (e.g. &apos;Near Gachibowli flyover&apos;). Do NOT post private phone numbers, home addresses, or identifying personal records.
              </p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Title / Core Summary <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blocked drainage causing evening commute bottleneck"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">General Location</label>
              <input
                type="text"
                value={generalLocation}
                onChange={(e) => setGeneralLocation(e.target.value)}
                placeholder="Area or district landmark"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
              </input>
            </div>
          </div>

          {/* Firsthand Verification Toggle */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
            <span className="block text-xs font-medium text-zinc-200">
              Did you personally witness this?
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="firsthand"
                  checked={isFirsthand === true}
                  onChange={() => setIsFirsthand(true)}
                  className="text-indigo-600 focus:ring-0"
                />
                Yes, I personally observed this
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="firsthand"
                  checked={isFirsthand === false}
                  onChange={() => setIsFirsthand(false)}
                  className="text-indigo-600 focus:ring-0"
                />
                No, someone else informed me
              </label>
            </div>
          </div>

          {/* Detailed Observations */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              What did you directly observe? <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State tangible facts: dates, times, visual observations, and sequences."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Explicit Uncertainties (CivicLens Distinction) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              What are you uncertain about? (Preserve unknowns)
            </label>
            <input
              type="text"
              value={uncertainties}
              onChange={(e) => setUncertainties(e.target.value)}
              placeholder="e.g. Unsure if work crews were municipal contractors or private utility"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Evidence or Documentation */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Evidence Notes or Reference Links (Optional)
            </label>
            <input
              type="text"
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
              placeholder="Links to official circulars, photos, or public board notices"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Identity: Pseudonym vs Real Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-zinc-800">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Publishing Under</label>
              <select
                value={identityType}
                onChange={(e) => setIdentityType(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none"
              >
                <option value="pseudonym">Pseudonym (Community Handle)</option>
                <option value="real_name">Real Name</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Displayed Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold tracking-wide transition-colors"
          >
            Submit Report to CivicLens
          </button>
        </form>
      )}
    </div>
  );
}