import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { templates, getTemplatesByCategory, Template } from '@/data/templates';
import { ShoppingBag, Building2, HelpCircle, Eye } from 'lucide-react';
import { useNylo } from '@/contexts/NyloContext';
import { useNavigate } from 'react-router-dom';

interface TemplateSelectorProps {
  onClose: () => void;
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

export const TemplateSelector = ({ onClose }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'ecommerce' | 'empresa' | 'faq' | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { createChatbotFromTemplate } = useNylo();
  const navigate = useNavigate();

  const categories = ['ecommerce', 'empresa', 'faq'] as const;

  const handleSelectTemplate = (template: Template) => {
    const newBot = createChatbotFromTemplate(template);
    onClose();
    navigate(`/editor/${newBot.id}`);
  };

  if (previewTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Preview do Template</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewTemplate(null)}
              className="text-white border-white/20"
            >
              Voltar
            </Button>
            <Button
              onClick={() => handleSelectTemplate(previewTemplate)}
              className="gradient-blue"
            >
              Usar Este Template
            </Button>
          </div>
        </div>

        <Card className="card-dark border-white/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge className={`${categoryColors[previewTemplate.category]} text-white`}>
                {categoryLabels[previewTemplate.category]}
              </Badge>
              <CardTitle className="text-white">{previewTemplate.name}</CardTitle>
            </div>
            <p className="text-gray-300">{previewTemplate.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Mensagem de Boas-vindas</h4>
              <div className="glass-effect p-4 rounded-lg border border-white/10">
                <p className="text-gray-300">{previewTemplate.config.welcomeMessage}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-2">Fluxos Configurados</h4>
              <div className="space-y-3">
                {previewTemplate.config.flows.map((flow, index) => (
                  <div key={index} className="glass-effect p-4 rounded-lg border border-white/10">
                    <h5 className="font-medium text-primary mb-1">{flow.name}</h5>
                    <p className="text-sm text-gray-400 mb-2">
                      Palavras-chave: {flow.trigger.join(', ')}
                    </p>
                    <p className="text-gray-300 text-sm">{flow.responses[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedCategory) {
    const categoryTemplates = getTemplatesByCategory(selectedCategory);
    const Icon = categoryIcons[selectedCategory];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">
              Templates de {categoryLabels[selectedCategory]}
            </h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setSelectedCategory(null)}
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
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 text-white border-white/20 hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSelectTemplate(template)}
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
  }

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
              onClick={() => setSelectedCategory(category)}
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
