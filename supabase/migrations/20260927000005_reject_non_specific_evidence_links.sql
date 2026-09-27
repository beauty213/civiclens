UPDATE public.evidence_items
SET source_url = NULL
WHERE source_url IS NOT NULL
  AND (
    source_url !~* '^https://[^/?#]+/[^/?#]+'
    OR source_url ~* '^https://example\.(com|org|net|gov)(\.[a-z]{2,})?(/|$)'
  );

UPDATE public.articles
SET source_url = NULL
WHERE source_url IS NOT NULL
  AND source_url !~* '^https://[^/?#]+/[^/?#]+';

UPDATE public.claims AS claim
SET
  status = 'Needs verification',
  status_explanation = 'No specific, verifiable source document link is attached. Additional primary documentation is needed.'
WHERE claim.status IN (
    'Well-supported',
    'Supported with context',
    'Conflicting reports',
    'Contradicted by available evidence'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.evidence_items AS evidence
    WHERE evidence.claim_id = claim.id
      AND evidence.source_url ~* '^https://[^/?#]+/[^/?#]+'
  );

UPDATE public.articles AS article
SET assessment_status = 'in_progress'
WHERE EXISTS (
  SELECT 1
  FROM public.claims AS claim
  WHERE claim.article_id = article.id
    AND claim.status IN ('Needs verification', 'Insufficient evidence')
);
