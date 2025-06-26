
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/data/templates';

interface TemplatePreviewProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
  onBack: () => void;
}

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

export const TemplatePreview = ({ template, onUseTemplate, onBack }: TemplatePreviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Preview do Template</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-white border-white/20"
          >
            Voltar
          </Button>
          <Button
            onClick={() => onUseTemplate(template)}
            className="gradient-blue"
          >
            Usar Este Template
          </Button>
        </div>
      </div>

      <Card className="card-dark border-white/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge className={`${categoryColors[template.category]} text-white`}>
              {categoryLabels[template.category]}
            </Badge>
            <CardTitle className="text-white">{template.name}</CardTitle>
          </div>
          <p className="text-gray-300">{template.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Preview da Conversa</h4>
            <div className="glass-effect p-4 rounded-lg border border-white/10">
              <p className="text-gray-300">{template.preview}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Código NyloLang</h4>
            <div className="glass-effect p-4 rounded-lg border border-white/10">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
                {template.sourceCode}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
