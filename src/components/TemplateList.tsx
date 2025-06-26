
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTemplatesByCategory, Template } from '@/data/templates';
import { ShoppingBag, Building2, HelpCircle, Eye } from 'lucide-react';

interface TemplateListProps {
  category: 'ecommerce' | 'empresa' | 'faq';
  onTemplateSelect: (template: Template) => void;
  onTemplatePreview: (template: Template) => void;
  onBack: () => void;
}

const categoryIcons = {
  ecommerce: ShoppingBag,
  empresa: Building2,
  faq: HelpCircle
};

const categoryLabels = {
  ecommerce: 'E-commerce',
  empresa: 'Empresa',
  faq: 'FAQ'
};

export const TemplateList = ({ category, onTemplateSelect, onTemplatePreview, onBack }: TemplateListProps) => {
  const categoryTemplates = getTemplatesByCategory(category);
  const Icon = categoryIcons[category];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-white">
            Templates de {categoryLabels[category]}
          </h3>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="text-white border-white/20"
        >
          Voltar às Categorias
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categoryTemplates.map((template) => (
          <Card key={template.id} className="card-dark border-white/20 hover:border-primary/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              <p className="text-gray-300 text-sm">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="glass-effect p-3 rounded-lg border border-white/10 mb-4">
                <p className="text-gray-300 text-sm italic">"{template.preview}"</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTemplatePreview(template)}
                  className="flex-1 text-white border-white/20 hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => onTemplateSelect(template)}
                  className="flex-1 gradient-blue"
                >
                  Usar Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
