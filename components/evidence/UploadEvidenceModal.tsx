'use client';

import { useEffect, useRef, useState } from 'react';
import { FileUp, Loader2, ShieldCheck, Upload, X } from 'lucide-react';
import { uploadEvidenceDocument, validateEvidenceFile } from '@/lib/storage/documentUploader';
import { EvidenceItem } from '@/types';

interface UploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
  claimText: string;
  onEvidenceAdded: (item: EvidenceItem) => void;
}

export function UploadEvidenceModal({
  isOpen,
  onClose,
  claimId,
  claimText,
  onEvidenceAdded,
}: UploadEvidenceModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [provenanceNote, setProvenanceNote] = useState('');
  const [pseudonym, setPseudonym] = useState('AnonymousCivic');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUploading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUploading, onClose]);

  if (!isOpen) return null;

  const chooseFile = (candidate: File | undefined) => {
    if (!candidate) return;
    const validation = validateEvidenceFile(candidate);
    if (!validation.valid) {
      setFile(null);
      setError(validation.error ?? 'This file cannot be uploaded.');
      return;
    }
    setError(null);
    setFile(candidate);
    if (!title) setTitle(candidate.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Select a PDF, PNG, JPG, or DOCX file before submitting.');
      return;
    }
    setIsUploading(true);
    setUploadProgress(12);
    setError(null);
    const progressTimer = window.setInterval(() => {
      setUploadProgress((current) => Math.min(current + 7, 88));
    }, 350);
    const result = await uploadEvidenceDocument(file, {
      claimId,
      title: title.trim(),
      description: description.trim(),
      provenanceNote: provenanceNote.trim(),
      uploaderPseudonym: pseudonym.trim() || 'AnonymousCivic',
      evidenceType: 'Official document',
    });
    window.clearInterval(progressTimer);
    setIsUploading(false);
    if (!result.success || !result.evidenceItem) {
      setUploadProgress(0);
      setError(result.error ?? 'The upload could not be indexed. Please try again.');
      return;
    }
    setUploadProgress(100);
    onEvidenceAdded(result.evidenceItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isUploading) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="upload-evidence-title" className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <div>
              <h2 id="upload-evidence-title" className="text-sm font-semibold text-zinc-100">Upload primary record</h2>
              <p className="font-mono text-[10px] text-zinc-500">EVIDENCE LAB / CLAIM ATTACHMENT</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={isUploading} aria-label="Close upload dialog" className="text-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-indigo-400">Attaching to claim</p>
          <p className="mt-1 line-clamp-2 text-xs italic leading-relaxed text-zinc-300">&ldquo;{claimText}&rdquo;</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div
            className={`rounded-lg border border-dashed p-5 text-center transition-colors ${isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-zinc-700 bg-zinc-950/50'}`}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => { event.preventDefault(); setIsDragging(false); chooseFile(event.dataTransfer.files[0]); }}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.docx,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} />
            <FileUp className="mx-auto h-7 w-7 text-indigo-400" />
            <p className="mt-2 text-xs text-zinc-300">{file ? file.name : 'Drop a record here or browse your device'}</p>
            <p className="mt-1 font-mono text-[10px] text-zinc-600">PDF, PNG, JPG, DOCX · MAX 10 MB</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 inline-flex items-center gap-1.5 rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-indigo-500/60 hover:text-indigo-300">
              <Upload className="h-3.5 w-3.5" /> Browse files
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-zinc-400 sm:col-span-2">Document title
              <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. RTI reply #402/2026" className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500" />
            </label>
            <label className="text-xs text-zinc-400 sm:col-span-2">Description
              <textarea required rows={2} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What relevant fact does this record establish?" className="mt-1 w-full resize-y rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500" />
            </label>
            <label className="text-xs text-zinc-400">Provenance note
              <input required value={provenanceNote} onChange={(event) => setProvenanceNote(event.target.value)} placeholder="How was it obtained?" className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500" />
            </label>
            <label className="text-xs text-zinc-400">Contributor pseudonym
              <input required value={pseudonym} onChange={(event) => setPseudonym(event.target.value)} placeholder="e.g. WardWatcher_7" className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500" />
            </label>
          </div>

          {error && <p role="alert" className="rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
          {isUploading && (
            <div aria-label={`Upload progress ${uploadProgress}%`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress} className="space-y-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-indigo-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="font-mono text-[10px] text-zinc-500">Uploading and indexing record… {uploadProgress}%</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 border-t border-zinc-800 pt-3">
            <button type="button" onClick={onClose} disabled={isUploading} className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isUploading} className="inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">
              {isUploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading & indexing…</> : 'Attach evidence'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
