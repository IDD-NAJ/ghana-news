
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';

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
  created_at: string;
  author_id: string;
}

interface ArticleViewDialogProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

const ArticleViewDialog: React.FC<ArticleViewDialogProps> = ({
  article,
  open,
  onClose,
}) => {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{article.title}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{article.category}</Badge>
            <Badge variant={article.published ? "default" : "secondary"}>
              {article.published ? "Published" : "Draft"}
            </Badge>
            {article.featured && <Badge variant="default">Featured</Badge>}
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full max-h-64 object-cover rounded-lg mb-4"
            />
          )}
          
          {article.excerpt && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Excerpt</h3>
              <p className="text-gray-600 italic">{article.excerpt}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            <div className="prose max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            <p>Created: {new Date(article.created_at).toLocaleString()}</p>
            <p>Slug: {article.slug}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewDialog;
