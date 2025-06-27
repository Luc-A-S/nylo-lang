
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { templates } from '@/data/templates';
import { Template } from '@/types/chatbot';
import { Sparkles, Zap, MessageSquare, Bot } from 'lucide-react';

interface TemplateSelectorProps {
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onClose }) => {
  const { createChatbot, createChatbotFromTemplate } = useSupabaseNylo();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      if (selectedTemplate) {
        await createChatbotFromTemplate(selectedTemplate, name, description);
      } else {
        await createChatbot(name, description);
      }
      onClose();
    } catch (error) {
      console.error('Error creating chatbot:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'empresa':
        return <MessageSquare className="w-5 h-5" />;
      case 'ecommerce':
        return <Zap className="w-5 h-5" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Criar Novo Chatbot</h2>
        <p className="text-gray-400 text-sm">
          Escolha um template ou comece do zero
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Templates Disponíveis</h3>
        
        {/* Blank Template */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
            selectedTemplate === null 
              ? 'border-primary bg-primary/10' 
              : 'card-dark border-white/10 hover:border-primary/50'
          }`}
          onClick={() => setSelectedTemplate(null)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Template em Branco</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    Comece do zero com um chatbot básico
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-primary border-primary/30">
                Básico
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Predefined Templates */}
        <div className="grid gap-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/10'
                  : 'card-dark border-white/10 hover:border-primary/50'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      {getTemplateIcon(template.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-white text-base truncate">{template.name}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      template.category === 'empresa' 
                        ? 'text-green-400 border-green-400/30'
                        : template.category === 'ecommerce'
                        ? 'text-blue-400 border-blue-400/30'
                        : 'text-purple-400 border-purple-400/30'
                    }`}
                  >
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Configurações</h3>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="name" className="text-white text-sm">Nome do Chatbot *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Atendimento Loja Virtual"
              className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary transition-colors mt-1"
              maxLength={50}
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-white text-sm">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito do seu chatbot..."
              className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary transition-colors mt-1 min-h-[80px] resize-none"
              maxLength={200}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isCreating}
          className="glass-effect border-white/20 text-white hover:bg-white/10"
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleCreate}
          disabled={!name.trim() || isCreating}
          className="gradient-blue hover:opacity-90 nylo-shadow min-w-[100px]"
        >
          {isCreating ? 'Criando...' : 'Criar Chatbot'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;
