INSERT INTO public.articles (
  id,
  title,
  summary,
  body_paragraphs,
  source_name,
  author,
  published_at,
  category,
  source_url,
  image_url,
  is_demo,
  intake_method,
  assessment_status
)
VALUES (
  'a0000000-0000-4000-8000-000000000007',
  'Lake restoration plans: what is documented so far?',
  'A clearly labeled demo story showing CivicLens claim tiers, image fallback, community comments, and reaction voting.',
  ARRAY[
    'This illustrative CivicLens demo describes a proposed lake restoration project and shows how individual claims can be presented for review.',
    'No source documents are attached to this demo. The proposed project scope and projected groundwater recharge figures remain unverified examples, not reports of confirmed events.'
  ],
  'CivicLens Demo Desk',
  'CivicLens Demo',
  NOW(),
  'Environment',
  NULL,
  NULL,
  TRUE,
  'manual',
  'in_progress'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  body_paragraphs = EXCLUDED.body_paragraphs,
  source_name = EXCLUDED.source_name,
  author = EXCLUDED.author,
  published_at = EXCLUDED.published_at,
  category = EXCLUDED.category,
  source_url = EXCLUDED.source_url,
  image_url = EXCLUDED.image_url,
  is_demo = EXCLUDED.is_demo,
  intake_method = EXCLUDED.intake_method,
  assessment_status = EXCLUDED.assessment_status;

INSERT INTO public.claims (
  id,
  article_id,
  claim_text,
  speaker_or_source,
  status,
  status_explanation,
  missing_information,
  generated_questions
)
VALUES
  (
    'c0000000-0000-4000-8000-000000000071',
    'a0000000-0000-4000-8000-000000000007',
    'The proposed restoration project will cover five connected lakes.',
    'Illustrative demo claim',
    'Insufficient evidence',
    'This demo has no linked project plan or public tender to verify the proposed scope.',
    ARRAY['A specific public project plan or tender'],
    ARRAY['Which primary document defines the project scope?']
  ),
  (
    'c0000000-0000-4000-8000-000000000072',
    'a0000000-0000-4000-8000-000000000007',
    'The restoration is projected to increase groundwater recharge by 35%.',
    'Illustrative demo claim',
    'Needs verification',
    'No baseline study or published method is attached to support this illustrative projection.',
    ARRAY['A published baseline study and calculation method'],
    ARRAY['Who measured the baseline recharge rate?']
  )
ON CONFLICT (id) DO UPDATE SET
  article_id = EXCLUDED.article_id,
  claim_text = EXCLUDED.claim_text,
  speaker_or_source = EXCLUDED.speaker_or_source,
  status = EXCLUDED.status,
  status_explanation = EXCLUDED.status_explanation,
  missing_information = EXCLUDED.missing_information,
  generated_questions = EXCLUDED.generated_questions;

INSERT INTO public.comments (
  id,
  article_id,
  category,
  author_pseudonym,
  content,
  created_at
)
VALUES
  (
    'd0000000-0000-4000-8000-000000000071',
    'a0000000-0000-4000-8000-000000000007',
    'Opinion',
    'Demo reader · sample',
    'Illustrative comment: a public project plan would help verify the proposed scope.',
    NOW() - INTERVAL '2 hours'
  ),
  (
    'd0000000-0000-4000-8000-000000000072',
    'a0000000-0000-4000-8000-000000000007',
    'Opinion',
    'Demo reader · sample',
    'Illustrative comment: please publish the baseline data behind the recharge estimate.',
    NOW() - INTERVAL '1 hour'
  )
ON CONFLICT (id) DO UPDATE SET
  article_id = EXCLUDED.article_id,
  category = EXCLUDED.category,
  author_pseudonym = EXCLUDED.author_pseudonym,
  content = EXCLUDED.content,
  created_at = EXCLUDED.created_at;

INSERT INTO public.article_reactions (article_id, session_id, reaction)
VALUES
  ('a0000000-0000-4000-8000-000000000007', 'e0000000-0000-4000-8000-000000000071', 'Well-supported'),
  ('a0000000-0000-4000-8000-000000000007', 'e0000000-0000-4000-8000-000000000072', 'Needs more evidence'),
  ('a0000000-0000-4000-8000-000000000007', 'e0000000-0000-4000-8000-000000000073', 'Disputed'),
  ('a0000000-0000-4000-8000-000000000007', 'e0000000-0000-4000-8000-000000000074', 'Not sure')
ON CONFLICT (article_id, session_id) DO UPDATE SET
  reaction = EXCLUDED.reaction,
  updated_at = NOW();
