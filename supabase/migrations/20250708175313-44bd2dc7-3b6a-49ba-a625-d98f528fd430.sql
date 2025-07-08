-- Update the orphaned article to use an existing author
UPDATE public.articles 
SET author_id = '139d8943-f30a-4827-8c39-1e94eb1b6f9b'
WHERE author_id = '2ad97aa4-5d0a-4bf7-8888-ee92af33e723';

-- Now add the foreign key constraint
ALTER TABLE public.articles
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;