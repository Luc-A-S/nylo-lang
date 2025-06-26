
import { useState } from 'react';
import { Template } from '@/data/templates';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { useNavigate } from 'react-router-dom';
import { TemplateCategoryGrid } from './TemplateCategoryGrid';
import { TemplateList } from './TemplateList';
import { TemplatePreview } from './TemplatePreview';

interface TemplateSelectorProps {
  onClose: () => void;
}

export const TemplateSelector = ({ onClose }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'ecommerce' | 'empresa' | 'faq' | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { createChatbotFromTemplate } = useSupabaseNylo();
  const navigate = useNavigate();

  const handleSelectTemplate = async (template: Template) => {
    const newBot = await createChatbotFromTemplate(template, template.name);
    onClose();
    navigate(`/editor/${newBot.id}`);
  };

  if (previewTemplate) {
    return (
      <TemplatePreview
        template={previewTemplate}
        onUseTemplate={handleSelectTemplate}
        onBack={() => setPreviewTemplate(null)}
      />
    );
  }

  if (selectedCategory) {
    return (
      <TemplateList
        category={selectedCategory}
        onTemplateSelect={handleSelectTemplate}
        onTemplatePreview={setPreviewTemplate}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <TemplateCategoryGrid
      onCategorySelect={setSelectedCategory}
    />
  );
};
