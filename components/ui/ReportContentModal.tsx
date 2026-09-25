'use client';

import React, { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentTitle: string;
}

const REPORT_REASONS = [
  'Contains private personal information (Phone number, exact address, national ID)',
  'Direct threats, harassment, or targeted intimidation',
  'Commercial spam or advertising link',
  'Fabricated source or fraudulent documentary citation',
  'Hate speech or personal slurs',
];

export function ReportContentModal({
  isOpen,
  onClose,
  contentTitle,
}: ReportContentModalProps) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Report Content to Moderation</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-medium text-zinc-200">Report Registered</p>
            <p className="text-xs text-zinc-500">Thank you for preserving community evidence integrity.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <p className="text-zinc-400">
              Flagging: <strong className="text-zinc-200">&ldquo;{contentTitle}&rdquo;</strong>
            </p>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono text-[11px] block">Reason for flag:</label>
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-start gap-2 p-2 rounded bg-zinc-950 border border-zinc-800/80 cursor-pointer hover:border-zinc-700"
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 text-indigo-600"
                  />
                  <span className="text-zinc-300 leading-snug">{reason}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-zinc-400 font-mono text-[11px] block mb-1">
                Additional context (optional):
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Clarify specific line, timestamp, or concern..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
