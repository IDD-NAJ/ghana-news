
import React from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}

interface ArticleContentFormProps {
  formData: ArticleFormData;
  error: string;
  onTitleChange: (title: string) => void;
  onFormDataChange: (updates: Partial<ArticleFormData>) => void;
}

const ArticleContentForm: React.FC<ArticleContentFormProps> = ({
  formData,
  error,
  onTitleChange,
  onFormDataChange
}) => {
  return (
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
            onChange={(e) => onTitleChange(e.target.value)}
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
            onChange={(e) => onFormDataChange({ slug: e.target.value })}
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
            onChange={(e) => onFormDataChange({ excerpt: e.target.value })}
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
            onChange={(e) => onFormDataChange({ content: e.target.value })}
            placeholder="Write your article content here"
            rows={15}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleContentForm;
