GRANT SELECT, INSERT ON public.comments TO anon;

DROP POLICY IF EXISTS "Allow anonymous article comments" ON public.comments;
CREATE POLICY "Allow anonymous article comments"
  ON public.comments
  FOR INSERT
  TO anon
  WITH CHECK (
    article_id IS NOT NULL
    AND claim_id IS NULL
    AND category = 'Opinion'
    AND char_length(trim(content)) BETWEEN 1 AND 2000
    AND char_length(trim(author_pseudonym)) BETWEEN 1 AND 60
  );

GRANT SELECT, INSERT, UPDATE ON public.article_reactions TO anon;

DROP POLICY IF EXISTS "Allow anonymous article reaction reads" ON public.article_reactions;
CREATE POLICY "Allow anonymous article reaction reads"
  ON public.article_reactions
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anonymous article reaction votes" ON public.article_reactions;
CREATE POLICY "Allow anonymous article reaction votes"
  ON public.article_reactions
  FOR INSERT
  TO anon
  WITH CHECK (
    session_id IS NOT NULL
    AND reaction IN ('Well-supported', 'Needs more evidence', 'Disputed', 'Not sure')
  );

DROP POLICY IF EXISTS "Allow anonymous article reaction updates" ON public.article_reactions;
CREATE POLICY "Allow anonymous article reaction updates"
  ON public.article_reactions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (
    session_id IS NOT NULL
    AND reaction IN ('Well-supported', 'Needs more evidence', 'Disputed', 'Not sure')
  );

NOTIFY pgrst, 'reload schema';
