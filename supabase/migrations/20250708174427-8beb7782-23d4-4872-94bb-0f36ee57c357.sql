-- Create article for the existing published story
INSERT INTO public.articles (
  author_id,
  title,
  content,
  excerpt,
  category,
  image_url,
  slug,
  published,
  featured,
  publication_date,
  created_at,
  updated_at
) VALUES (
  '0af2d1d5-f949-4988-8691-ae889417cffc',
  'ajmhnsg',
  'juhgyhaSADSCXV KOIJHUIGYFTHCADBSFDVC OIUYTGDSCBFDCBV OIOUYTYGAdsfDC OIUYUTGFSDFFC IUYTGFZDZX',
  'kjhgfxcvbhjnkjlijuhy joiuytfgfdrghjkhugyfh ihuyjtghf',
  'Sports',
  'https://xpmclamtmlogogcpogbq.supabase.co/storage/v1/object/public/article-images/featured-1751995118513-q72m2l0d9b8.jpg',
  'ajmhnsg',
  true,
  false,
  now(),
  now(),
  now()
);