
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Save } from 'lucide-react';

interface ArticleEditorHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  onBack: () => void;
  onSave: () => void;
}

const ArticleEditorHeader: React.FC<ArticleEditorHeaderProps> = ({
  isEditing,
  isLoading,
  onBack,
  onSave
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
          <Button onClick={onSave} disabled={isLoading} className="bg-ghana-green hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ArticleEditorHeader;
