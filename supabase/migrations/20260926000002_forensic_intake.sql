ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.evidence_items
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE public.evidence_items
SET is_demo = TRUE
WHERE source_url ~* '^https?://([^/]+\.)?example\.(com|org|net|gov(\.[a-z]{2})?)($|/)';

UPDATE public.evidence_items
SET is_demo = TRUE
WHERE title IN (
  'ASCI corporate disclosure index',
  'Prime-time homecoming monitoring log',
  'Ministry sports reward circular',
  'Social growth comparison snapshots'
);

UPDATE public.articles AS article
SET is_demo = TRUE
WHERE EXISTS (
  SELECT 1
  FROM public.claims AS claim
  JOIN public.evidence_items AS evidence ON evidence.claim_id = claim.id
  WHERE claim.article_id = article.id
    AND evidence.is_demo = TRUE
);

UPDATE public.articles
SET is_demo = TRUE
WHERE title ILIKE 'Hype vs. Podium:%';
