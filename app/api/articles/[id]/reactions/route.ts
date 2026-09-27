import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REACTIONS = ['Well-supported', 'Needs more evidence', 'Disputed', 'Not sure'] as const;
type Reaction = typeof REACTIONS[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isReaction(value: unknown): value is Reaction {
  return typeof value === 'string' && REACTIONS.some((reaction) => reaction === value);
}

function emptyCounts(): Record<Reaction, number> {
  return {
    'Well-supported': 0,
    'Needs more evidence': 0,
    Disputed: 0,
    'Not sure': 0,
  };
}

function validId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sessionId = new URL(request.url).searchParams.get('sessionId');
  if (!validId(id) || (sessionId && !validId(sessionId))) {
    return NextResponse.json({ error: 'Invalid article or session identifier.' }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Community reactions are unavailable because the public Supabase client is not configured.' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('article_reactions')
    .select('session_id,reaction')
    .eq('article_id', id);

  if (error) {
    console.error('Could not load article reactions:', error.code, error.message);
    if (error.code === 'PGRST205' || error.code === '42P01') {
      return NextResponse.json({
        error: 'Community reactions are not installed in the database yet. Apply 20260927000006_article_community.sql.',
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Could not load community reactions.' }, { status: 503 });
  }

  const counts = emptyCounts();
  let myVote: Reaction | null = null;
  for (const row of data ?? []) {
    if (isReaction(row.reaction)) counts[row.reaction] += 1;
    if (sessionId && row.session_id === sessionId && isReaction(row.reaction)) {
      myVote = row.reaction;
    }
  }

  return NextResponse.json({ counts, myVote });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!validId(id) || !isRecord(body) || typeof body.sessionId !== 'string' ||
      !validId(body.sessionId) || !isReaction(body.reaction)) {
    return NextResponse.json({ error: 'Choose a reaction and provide a valid anonymous session.' }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Community reactions are unavailable because the public Supabase client is not configured.' }, { status: 503 });
  }

  const { error } = await supabase
    .from('article_reactions')
    .upsert({
      article_id: id,
      session_id: body.sessionId,
      reaction: body.reaction,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'article_id,session_id' });

  if (error) {
    console.error('Could not save article reaction:', error.code, error.message);
    if (error.code === '42501') {
      return NextResponse.json({
        error: 'Anonymous voting is not enabled yet. Apply 20260927000008_allow_anonymous_article_community.sql.',
      }, { status: 503 });
    }
    if (error.code === 'PGRST205' || error.code === '42P01') {
      return NextResponse.json({
        error: 'Community reactions are not installed in the database yet. Apply 20260927000006_article_community.sql.',
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Could not save your reaction.' }, { status: 503 });
  }

  return NextResponse.json({ success: true });
}
