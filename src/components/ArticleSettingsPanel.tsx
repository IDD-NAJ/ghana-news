
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Calendar } from 'lucide-react';
import FeaturedImageUploader from './FeaturedImageUploader';

interface ArticleSettings {
  category: string;
  published: boolean;
  featured: boolean;
  image_url: string;
  publication_date: string;
}

interface ArticleSettingsPanelProps {
  settings: ArticleSettings;
  onSettingsChange: (updates: Partial<ArticleSettings>) => void;
  onError: (error: string) => void;
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

const ArticleSettingsPanel: React.FC<ArticleSettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onError
}) => {
  return (
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
            value={settings.category}
            onValueChange={(value) => onSettingsChange({ category: value })}
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
            value={settings.publication_date}
            onChange={(e) => onSettingsChange({ publication_date: e.target.value })}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Set when this article should be considered published
          </p>
        </div>

        <FeaturedImageUploader
          imageUrl={settings.image_url}
          onImageUrlChange={(url) => onSettingsChange({ image_url: url })}
          onError={onError}
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Published
          </label>
          <Switch
            checked={settings.published}
            onCheckedChange={(checked) => onSettingsChange({ published: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Featured
          </label>
          <Switch
            checked={settings.featured}
            onCheckedChange={(checked) => onSettingsChange({ featured: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleSettingsPanel;
