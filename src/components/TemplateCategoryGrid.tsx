
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTemplatesByCategory } from '@/data/templates';
import { ShoppingBag, Building2, HelpCircle } from 'lucide-react';

interface TemplateCategoryGridProps {
  onCategorySelect: (category: 'ecommerce' | 'empresa' | 'faq') => void;
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

const categoryColors = {
  ecommerce: 'bg-green-500',
  empresa: 'bg-blue-500',
  faq: 'bg-purple-500'
};

export const TemplateCategoryGrid = ({ onCategorySelect }: TemplateCategoryGridProps) => {
  const categories = ['ecommerce', 'empresa', 'faq'] as const;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-white">Escolha um Template</h3>
        <p className="text-gray-300">Comece rapidamente com um template pré-configurado</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const templates = getTemplatesByCategory(category);
          
          return (
            <Card 
              key={category}
              className="card-dark border-white/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
              onClick={() => onCategorySelect(category)}
            >
              <CardHeader className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto ${categoryColors[category]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">{categoryLabels[category]}</CardTitle>
                  <p className="text-gray-400 text-sm mt-2">
                    {templates.length} template{templates.length > 1 ? 's' : ''} disponível{templates.length > 1 ? 'eis' : ''}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full gradient-blue hover:opacity-90 transition-opacity">
                  Ver Templates
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
