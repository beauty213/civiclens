import { NextResponse } from 'next/server';
import { analyzeAndStoreArticle } from '@/lib/forensics/analyzeArticle';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isCivicNewsCategory } from '@/lib/newsCategories';

export const runtime = 'nodejs';

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function isPublicHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const body = asObject(requestBody);
  const title = asString(body?.title)?.trim();
  const sourceName = asString(body?.sourceName)?.trim();
  const sourceUrl = body?.sourceUrl;
  const articleText = asString(body?.articleText)?.trim();
  const author = (asString(body?.author)?.trim() || 'CivicLens Reader').slice(0, 150);
  const category = asString(body?.category);

  if (!title || title.length > 500 || !sourceName || sourceName.length > 150 ||
      !isPublicHttpsUrl(sourceUrl) || !articleText || articleText.length < 80 ||
      articleText.length > 50000 || !isCivicNewsCategory(category)) {
    return NextResponse.json(
      { error: 'Provide a title, publisher, HTTPS article URL, article text (80–50,000 characters), and valid category.' },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Server persistence is not configured. Set SUPABASE_SERVICE_ROLE_KEY in the server secret store.' },
      { status: 503 },
    );
  }

  const result = await analyzeAndStoreArticle(supabase, {
    title,
    sourceName,
    sourceUrl,
    articleText,
    author,
    category,
    intakeMethod: 'manual',
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result, { status: 201 });
}
