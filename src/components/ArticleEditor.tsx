import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ImageUploader from './ImageUploader';
import { useArticleImages } from '../hooks/useArticleImages';
import ArticleEditorHeader from './ArticleEditorHeader';
import ArticleContentForm from './ArticleContentForm';
import ArticleSettingsPanel from './ArticleSettingsPanel';
import UrlArticleImporter from './UrlArticleImporter';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  slug: string;
  publication_date: string;
}

interface ArticleEditorProps {
  article: Article | null;
  onClose: () => void;
}

interface ImageUploadItem {
  id?: string;
  file?: File;
  url: string;
  caption: string;
  display_order: number;
  isUploading?: boolean;
  isNew?: boolean;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    published: false,
    featured: false,
    image_url: '',
    slug: '',
    publication_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadImages, setUploadImages] = useState<ImageUploadItem[]>([]);

  const { images: existingImages, loading: imagesLoading } = useArticleImages(article?.id);

  useEffect(() => {
    if (article) {
      // Format the publication_date for datetime-local input
      const publicationDate = new Date(article.publication_date);
      const formattedDate = new Date(publicationDate.getTime() - publicationDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        published: article.published,
        featured: article.featured,
        image_url: article.image_url || '',
        slug: article.slug,
        publication_date: formattedDate
      });
    } else {
      // Set default publication date to current date/time for new articles
      const now = new Date();
      const formattedNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setFormData(prev => ({
        ...prev,
        publication_date: formattedNow
      }));
    }
  }, [article]);

  useEffect(() => {
    if (existingImages.length > 0) {
      const convertedImages: ImageUploadItem[] = existingImages.map(img => ({
        id: img.id,
        url: img.image_url,
        caption: img.caption || '',
        display_order: img.display_order,
        isNew: false
      }));
      setUploadImages(convertedImages);
    }
  }, [existingImages]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleArticleImported = (articleData: {
    title: string;
    content: string;
    excerpt: string;
    image_url?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      title: articleData.title,
      content: articleData.content,
      excerpt: articleData.excerpt,
      image_url: articleData.image_url || '',
      slug: generateSlug(articleData.title)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required');
        return;
      }

      // Convert the datetime-local input back to ISO string
      const publicationDate = new Date(formData.publication_date).toISOString();

      const articleData = {
        ...formData,
        publication_date: publicationDate,
        author_id: user.id,
        updated_at: new Date().toISOString()
      };

      let savedArticleId = article?.id;

      if (article) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id);

        if (error) {
          setError(error.message);
          return;
        }
      } else {
        // Create new article
        const { data, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select('id')
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        savedArticleId = data.id;
      }

      if (savedArticleId && uploadImages.some(img => img.isNew)) {
        for (const image of uploadImages) {
          if (image.isNew && image.file) {
            try {
              const fileExt = image.file.name.split('.').pop();
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
              
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('article-images')
                .upload(fileName, image.file);

              if (uploadError) {
                console.error('Error uploading image:', uploadError);
                continue;
              }

              const { data: { publicUrl } } = supabase.storage
                .from('article-images')
                .getPublicUrl(fileName);

              await supabase
                .from('article_images')
                .insert({
                  article_id: savedArticleId,
                  image_url: publicUrl,
                  caption: image.caption,
                  display_order: image.display_order
                });

            } catch (err) {
              console.error('Error processing image:', err);
            }
          }
        }
      }

      onClose();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleEditorHeader
        isEditing={!!article}
        isLoading={isLoading}
        onBack={onClose}
        onSave={handleSave}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!article && (
              <UrlArticleImporter onArticleImported={handleArticleImported} />
            )}

            <ArticleContentForm
              formData={formData}
              error={error}
              onTitleChange={handleTitleChange}
              onFormDataChange={handleFormDataChange}
            />

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  articleId={article?.id}
                  images={uploadImages}
                  onImagesChange={setUploadImages}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <ArticleSettingsPanel
              settings={{
                category: formData.category,
                published: formData.published,
                featured: formData.featured,
                image_url: formData.image_url,
                publication_date: formData.publication_date
              }}
              onSettingsChange={handleFormDataChange}
              onError={setError}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
