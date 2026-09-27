UPDATE public.articles
SET category = 'Business'
WHERE is_demo = TRUE
  AND category = 'Sports & Media Ethics'
  AND title ILIKE 'Hype vs. Podium:%';
