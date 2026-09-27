CREATE INDEX IF NOT EXISTS idx_comments_article_created_at
  ON public.comments(article_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.article_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  reaction VARCHAR(50) NOT NULL CHECK (
    reaction IN ('Well-supported', 'Needs more evidence', 'Disputed', 'Not sure')
  ),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (article_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_article_reactions_article_id
  ON public.article_reactions(article_id);

ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
