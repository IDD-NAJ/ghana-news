import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ArrowLeft, Save, Upload, X, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import ImageUploader from './ImageUploader';
import { useArticleImages } from '../hooks/useArticleImages';

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

const categories = [
  'Politics',
  'Sports',
  'Entertainment',
  'Business',
  'Opinion',
  'Lifestyle',
  'Technology',
  'Education',
  'Culture'
];

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
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);

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

  const handleFeaturedImageUpload = async (file: File) => {
    setIsUploadingFeatured(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `featured-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) {
        setError('Failed to upload featured image');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setFeaturedImageFile(null);
    } catch (err) {
      console.error('Error uploading featured image:', err);
      setError('Failed to upload featured image');
    } finally {
      setIsUploadingFeatured(false);
    }
  };

  const handleFeaturedImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFeaturedImageFile(file);
      handleFeaturedImageUpload(file);
    }
    event.target.value = '';
  };

  const removeFeaturedImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setFeaturedImageFile(null);
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
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button onClick={onClose} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {article ? 'Edit Article' : 'New Article'}
              </h1>
            </div>
            <Button onClick={handleSave} disabled={isLoading} className="bg-ghana-green hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-url-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the article"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content here"
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>

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
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Publication Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.publication_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, publication_date: e.target.value }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set when this article should be considered published
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL (Legacy)
                  </label>
                  <div className="space-y-3">
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Or upload an image:</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFeaturedImageSelect}
                          className="hidden"
                          id="featured-image-upload"
                          disabled={isUploadingFeatured}
                        />
                        <label htmlFor="featured-image-upload">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUploadingFeatured}
                            asChild
                          >
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              {isUploadingFeatured ? 'Uploading...' : 'Upload'}
                            </span>
                          </Button>
                        </label>
                        {formData.image_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={removeFeaturedImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Featured image preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use the Images section above for better image management
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Published
                  </label>
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Featured
                  </label>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
