import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { EvidenceItem, EvidenceType } from '@/types';

export const EVIDENCE_BUCKET = 'evidence-documents';
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export interface UploadOptions {
  claimId?: string;
  articleId?: string;
  title: string;
  description: string;
  provenanceNote: string;
  uploaderPseudonym?: string;
  evidenceType?: EvidenceType;
}

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  evidenceItem?: EvidenceItem;
  error?: string;
}

export function validateEvidenceFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type || 'unknown'}). Allowed: PDF, PNG, JPG, WEBP, TXT, DOCX.`,
    };
  }

  return { valid: true };
}

export async function uploadEvidenceDocument(
  file: File,
  metadata: UploadOptions
): Promise<UploadResult> {
  const validation = validateEvidenceFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const resolvedType = metadata.evidenceType || ('Official document' as EvidenceType);

  if (!isSupabaseConfigured || !supabase) {
    const mockUrl = URL.createObjectURL(file);
    const mockItem = {
      id: crypto.randomUUID(),
      claimId: metadata.claimId || 'mock-claim',
      claim_id: metadata.claimId || 'mock-claim',
      type: resolvedType,
      title: metadata.title,
      description: metadata.description,
      sourceUrl: mockUrl,
      source_url: mockUrl,
      provenanceNote: metadata.provenanceNote,
      provenance_note: metadata.provenanceNote,
      uploaderPseudonym: metadata.uploaderPseudonym || 'AnonymousCivic',
      uploader_pseudonym: metadata.uploaderPseudonym || 'AnonymousCivic',
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
    } as unknown as EvidenceItem;

    return {
      success: true,
      publicUrl: mockUrl,
      storagePath: `mock/${file.name}`,
      evidenceItem: mockItem,
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'dat';
    const sanitizedBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);
    const uniquePath = `claim_${metadata.claimId || 'general'}/${Date.now()}_${sanitizedBaseName}.${fileExt}`;

    // 1. Upload binary to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(EVIDENCE_BUCKET)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    // 2. Resolve permanent public download URL
    const { data: publicUrlData } = supabase.storage
      .from(EVIDENCE_BUCKET)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    const evidencePayload = {
      claim_id: metadata.claimId || null,
      type: resolvedType,
      title: metadata.title,
      description: metadata.description,
      source_url: publicUrl,
      provenance_note: metadata.provenanceNote,
      uploader_pseudonym: metadata.uploaderPseudonym || 'CivicContributor',
    };

    const { data: itemData, error: dbError } = await supabase
      .from('evidence_items')
      .insert(evidencePayload)
      .select()
      .single();

    if (dbError) {
      return {
        success: true,
        publicUrl,
        storagePath: uploadData.path,
        error: `File uploaded to storage, but database index failed: ${dbError.message}`,
      };
    }

    return {
      success: true,
      publicUrl,
      storagePath: uploadData.path,
      evidenceItem: itemData as unknown as EvidenceItem,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during document upload.',
    };
  }
}
