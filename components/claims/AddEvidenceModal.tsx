// components/claims/AddEvidenceModal.tsx
'use client';

import React, { useState } from 'react';
import { EvidenceType, EvidenceItem } from '@/types';
import { X, FileText, CheckCircle2, ShieldCheck, Link2 } from 'lucide-react';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
  claimText: string;
  onEvidenceAdded: (item: EvidenceItem) => void;
}

const EVIDENCE_TYPES: EvidenceType[] = [
  'Official document',
  'News source',
  'External source',
  'Photo',
  'Video',
  'Dataset',
  'Firsthand account',
];

export function AddEvidenceModal({
  isOpen,
  onClose,
  claimId,
  claimText,
  onEvidenceAdded,
}: AddEvidenceModalProps) {
  const [type, setType] = useState<EvidenceType>('Official document');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [provenanceNote, setProvenanceNote] = useState('');
  const [pseudonym, setPseudonym] = useState('Observer_Hyd_04');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      type,
      title: title.trim(),
      description: description.trim(),
      sourceUrl: sourceUrl.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
      uploaderPseudonym: pseudonym,
      provenanceNote: provenanceNote.trim() || 'Direct community upload via Evidence Lab.',
    };

    onEvidenceAdded(newEvidence);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Evidence Lab Submission</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Claim Reminder */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
            Associating Evidence Directly With Claim:
          </span>
          <p className="text-zinc-300 italic line-clamp-2">&ldquo;{claimText}&rdquo;</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Evidence Type */}
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">
              Evidence Category:
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EvidenceType)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 outline-none focus:border-indigo-500"
            >
              {EVIDENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">
              Document or Source Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ward 104 Catchment Hydrogeology Audit Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">
              How this supports, qualifies, or contradicts the claim:
            </label>
            <textarea
              required
              rows={2}
              placeholder="Summarize the relevant page, statistic, or finding..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">
              Public Source URL (Optional):
            </label>
            <input
              type="url"
              placeholder="https://example.gov.in/disclosures/doc.pdf"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Provenance Note */}
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">
              Provenance Note (Where/how was this obtained?):
            </label>
            <input
              type="text"
              placeholder="e.g. Downloaded from open state municipal portal under RTI Section 4"
              value={provenanceNote}
              onChange={(e) => setProvenanceNote(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Uploader Pseudonym */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
              <span>Submitting as:</span>
              <input
                type="text"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-indigo-300 font-mono text-xs w-36"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors"
              >
                Attach Evidence
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
