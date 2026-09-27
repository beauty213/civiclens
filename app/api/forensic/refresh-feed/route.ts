import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { analyzeAndStoreArticle } from '@/lib/forensics/analyzeArticle';
import { CIVIC_NEWS_CATEGORIES } from '@/lib/newsCategories';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: Request): boolean {
  const expectedToken = process.env.CIVICLENS_FEED_REFRESH_TOKEN;
  const authorization = request.headers.get('authorization');
  if (!expectedToken || !authorization?.startsWith('Bearer ')) return false;

  const actual = Buffer.from(authorization.slice('Bearer '.length));
  const expected = Buffer.from(expectedToken);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

interface TrendingStory {
  title: string;
  source_name: string;
  source_url: string;
  category: typeof CIVIC_NEWS_CATEGORIES[number];
  summary: string;
  article_text: string;
  image_url: string | null;
  image_caption: string | null;
  image_credit: string | null;
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function parseTrendingStories(value: unknown): TrendingStory[] | null {
  const result = asObject(value);
  if (!Array.isArray(result?.stories) || result.stories.length > CIVIC_NEWS_CATEGORIES.length) return null;

  const stories: TrendingStory[] = [];
  for (const item of result.stories) {
    const row = asObject(item);
    if (!row ||
        typeof row.title !== 'string' ||
        typeof row.source_name !== 'string' ||
        typeof row.source_url !== 'string' ||
        typeof row.category !== 'string' ||
        !CIVIC_NEWS_CATEGORIES.some((category) => category === row.category) ||
        typeof row.summary !== 'string' ||
        typeof row.article_text !== 'string' ||
        row.article_text.trim().length < 80 ||
        row.article_text.length > 12000) {
      continue;
    }

    try {
      const sourceUrl = new URL(row.source_url);
      if (sourceUrl.protocol !== 'https:' || sourceUrl.username || sourceUrl.password) continue;
    } catch {
      continue;
    }

    let imageUrl: string | null = null;
    if (typeof row.image_url === 'string') {
      try {
        const parsedImageUrl = new URL(row.image_url);
        if (parsedImageUrl.protocol === 'https:' && !parsedImageUrl.username && !parsedImageUrl.password) {
          imageUrl = parsedImageUrl.toString();
        }
      } catch {
        imageUrl = null;
      }
    }

    stories.push({
      title: row.title.slice(0, 500),
      source_name: row.source_name.slice(0, 150),
      source_url: row.source_url,
      category: row.category as TrendingStory['category'],
      summary: row.summary.slice(0, 500),
      article_text: row.article_text.trim(),
      image_url: imageUrl,
      image_caption: typeof row.image_caption === 'string' ? row.image_caption.slice(0, 500) : null,
      image_credit: imageUrl
        ? (typeof row.image_credit === 'string' && row.image_credit.trim()
          ? row.image_credit.slice(0, 150)
          : row.source_name.slice(0, 150))
        : null,
    });
  }
  const uniqueStories = new Map(stories.map((story) => [story.category, story]));
  return Array.from(uniqueStories.values());
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Feed refresh is not authorized.' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server persistence is not configured.' }, { status: 503 });
  }

  const aiServiceUrl = process.env.AI_SERVICE_URL;
  if (!aiServiceUrl) {
    return NextResponse.json({ error: 'Trending search is not configured. Set AI_SERVICE_URL.' }, { status: 503 });
  }

  let response: Response;
  try {
    response = await fetch(new URL('/trending-stories', aiServiceUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region: 'Hyderabad and Telangana, India',
        categories: CIVIC_NEWS_CATEGORIES,
      }),
      signal: AbortSignal.timeout(65000),
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Trending news search service request failed:', error);
    return NextResponse.json({ error: 'Trending news search service is unavailable.' }, { status: 503 });
  }

  if (!response.ok) {
    console.error('Trending news search service returned an error:', response.status);
    return NextResponse.json({ error: 'Trending news search failed. Existing feed articles are unchanged.' }, { status: 502 });
  }

  const stories = parseTrendingStories(await response.json().catch(() => null));
  if (!stories) {
    return NextResponse.json({ error: 'Trending news search returned an invalid response. Existing feed articles are unchanged.' }, { status: 502 });
  }
  if (stories.length === 0) {
    const { data: existingArticles, error } = await supabase
      .from('articles')
      .select('category')
      .eq('is_demo', false);
    if (error) {
      console.error('Could not check civic category coverage:', error.message);
      return NextResponse.json({ error: 'No new articles were found, and category coverage could not be checked.' }, { status: 503 });
    }
    const existingCategories = new Set((existingArticles ?? []).map((article) => article.category));
    return NextResponse.json({
      message: 'No eligible recent stories were found. Existing feed articles are unchanged.',
      added: 0,
      categoriesWithArticles: CIVIC_NEWS_CATEGORIES.filter((category) => existingCategories.has(category)),
      missingCategories: CIVIC_NEWS_CATEGORIES.filter((category) => !existingCategories.has(category)),
    });
  }

  const added: Array<{ id: string; title: string; category: string }> = [];
  const errors: string[] = [];
  const refreshedCategories = new Set<string>();
  for (const story of stories) {
    const { data: duplicate, error: duplicateError } = await supabase
      .from('articles')
      .select('id')
      .eq('intake_method', 'auto')
      .eq('source_url', story.source_url)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      console.error('Could not check for an existing auto-fetched article:', duplicateError.message);
      errors.push(`Could not check duplicate: ${story.title}`);
      continue;
    }
    if (duplicate) {
      refreshedCategories.add(story.category);
      continue;
    }

    const result = await analyzeAndStoreArticle(supabase, {
      title: story.title,
      sourceName: story.source_name,
      sourceUrl: story.source_url,
      articleText: story.article_text,
      summary: story.summary,
      imageUrl: story.image_url ?? undefined,
      imageCaption: story.image_caption ?? undefined,
      imageCredit: story.image_credit ?? undefined,
      author: 'CivicLens News Desk',
      category: story.category,
      intakeMethod: 'auto',
    });

    if (!result.ok) {
      errors.push(`${story.title}: ${result.error}`);
      continue;
    }
    added.push({ id: result.articleId, title: story.title, category: story.category });
    refreshedCategories.add(story.category);
  }

  if (added.length === 0 && errors.length > 0) {
    return NextResponse.json({
      error: 'No new articles could be processed. Existing feed articles are unchanged.',
      added: 0,
      errors,
    }, { status: 502 });
  }

  const { data: existingArticles, error: coverageError } = await supabase
    .from('articles')
    .select('category')
    .eq('is_demo', false);
  if (coverageError) {
    console.error('Could not check civic category coverage:', coverageError.message);
    return NextResponse.json({
      added: added.length,
      articles: added,
      errors,
      error: 'New articles were processed, but category coverage could not be checked.',
    }, { status: 503 });
  }
  const existingCategories = new Set((existingArticles ?? []).map((article) => article.category));

  return NextResponse.json({
    added: added.length,
    skippedAsDuplicates: stories.length - added.length - errors.length,
    articles: added,
    errors,
    categoriesWithArticles: CIVIC_NEWS_CATEGORIES.filter((category) => existingCategories.has(category)),
    missingCategories: CIVIC_NEWS_CATEGORIES.filter((category) => !existingCategories.has(category)),
    refreshedCategories: CIVIC_NEWS_CATEGORIES.filter((category) => refreshedCategories.has(category)),
  }, { status: 200 });
}
