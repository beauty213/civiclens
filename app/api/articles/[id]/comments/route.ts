import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidArticleId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidArticleId(id)) {
    return NextResponse.json({ error: 'Comments are available for published articles only.' }, { status: 404 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Community comments are unavailable because the public Supabase client is not configured.' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('comments')
    .select('id,author_pseudonym,content,created_at')
    .eq('article_id', id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Could not load article comments:', error.code, error.message);
    if (error.code === 'PGRST205' || error.code === '42P01') {
      return NextResponse.json({
        error: 'Article comments are not available in the database yet. Apply the community migration 20260927000006_article_community.sql.',
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Could not load comments.' }, { status: 503 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // TODO(post-hackathon): add moderation/spam handling before any public launch.
  const { id } = await params;
  if (!isValidArticleId(id)) {
    return NextResponse.json({ error: 'Comments are available for published articles only.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.content !== 'string') {
    return NextResponse.json({ error: 'Enter a comment before submitting.' }, { status: 400 });
  }

  const content = body.content.trim();
  const author = typeof body.author === 'string' ? body.author.trim() : '';
  if (!content || content.length > 2000 || author.length > 60) {
    return NextResponse.json({ error: 'Comments must be 1–2,000 characters and names must be 60 characters or fewer.' }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Community comments are unavailable because the public Supabase client is not configured.' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: id,
      category: 'Opinion',
      author_pseudonym: author || 'Anonymous',
      content,
    })
    .select('id,author_pseudonym,content,created_at')
    .single();

  if (error) {
    console.error('Could not save article comment:', error.code, error.message);
    if (error.code === '42501') {
      return NextResponse.json({
        error: 'Anonymous comment submissions are not enabled yet. Apply 20260927000008_allow_anonymous_article_community.sql.',
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Could not save comment.' }, { status: 503 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
