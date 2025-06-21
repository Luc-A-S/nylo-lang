import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Bot, BarChart3, Settings, Share2, Eye, ShoppingBag, Building2, HelpCircle } from 'lucide-react';
import { useNylo } from '@/contexts/NyloContext';
import { useNavigate } from 'react-router-dom';
import { TemplateSelector } from '@/components/TemplateSelector';
import { templates, getTemplatesByCategory } from '@/data/templates';

const Dashboard = () => {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const { chatbots, createChatbot, createChatbotFromTemplate } = useNylo();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    const newBot = createChatbot('Novo Chatbot', 'Descrição do chatbot');
    navigate(`/editor/${newBot.id}`);
  };

  const handleSelectTemplate = (template: any) => {
    const newBot = createChatbotFromTemplate(template);
    navigate(`/editor/${newBot.id}`);
  };

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

  if (showTemplateSelector) {
    return (
      <div className="min-h-screen p-6 container-responsive">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-responsive-2xl font-bold gradient-text">Templates</h1>
            <Button
              variant="outline"
              onClick={() => setShowTemplateSelector(false)}
              className="text-white border-white/20"
            >
              Voltar ao Dashboard
            </Button>
          </div>
          <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 container-responsive">
      <div className="max-w-6xl mx-auto spacing-responsive">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-responsive-2xl font-bold gradient-text">Dashboard</h1>
            <p className="text-gray-400 text-responsive-base">Gerencie seus chatbots</p>
          </div>
          <div className="flex gap-3 mobile-full-width">
            <Button
              onClick={() => setShowTemplateSelector(true)}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 mobile-full-width"
            >
              <Bot className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button
              onClick={handleCreateNew}
              className="gradient-blue mobile-full-width"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo
            </Button>
          </div>
        </div>

        {/* Quick Templates Section */}
        <div className="mb-12">
          <h2 className="text-responsive-lg font-semibold text-white mb-6">Templates Rápidos</h2>
          <div className="grid-responsive-3">
            {Object.entries(categoryLabels).map(([category, label]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              const categoryTemplates = getTemplatesByCategory(category as any);
              const firstTemplate = categoryTemplates[0];
              
              return (
                <Card 
                  key={category}
                  className="card-dark border-white/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                  onClick={() => firstTemplate && handleSelectTemplate(firstTemplate)}
                >
                  <CardHeader className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto ${categoryColors[category as keyof typeof categoryColors]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{label}</CardTitle>
                      <p className="text-gray-400 text-sm mt-2">
                        {categoryTemplates.length} template{categoryTemplates.length > 1 ? 's' : ''} disponível{categoryTemplates.length > 1 ? 'eis' : ''}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {firstTemplate && (
                        <div className="glass-effect p-3 rounded-lg border border-white/10">
                          <p className="text-gray-300 text-sm italic">"{firstTemplate.preview}"</p>
                        </div>
                      )}
                      <Button className="w-full gradient-blue hover:opacity-90 transition-opacity">
                        Usar Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Existing Chatbots */}
        <div>
          <h2 className="text-responsive-lg font-semibold text-white mb-6">Meus Chatbots</h2>
          {chatbots.length > 0 ? (
            <div className="grid-responsive-2">
              {chatbots.map((bot) => (
                <Card key={bot.id} className="card-dark border-white/20 hover:border-primary/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{bot.name}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{bot.description}</p>
                      </div>
                      <Badge variant={bot.isOnline ? "default" : "secondary"} className="ml-2">
                        {bot.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Acessos hoje:</span>
                      <span className="text-white font-medium">{bot.todayAccessCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Total de acessos:</span>
                      <span className="text-white font-medium">{bot.accessCount || 0}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/editor/${bot.id}`)}
                        className="flex-1 gradient-blue"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/preview/${bot.id}`)}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/settings/${bot.id}`)}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/share/${bot.id}`)}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-dark border-white/20 text-center p-8">
              <div className="space-y-4">
                <Bot className="w-16 h-16 mx-auto text-gray-500" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum chatbot ainda</h3>
                  <p className="text-gray-400 mb-6">Comece criando seu primeiro chatbot ou use um template</p>
                  <div className="flex gap-3 justify-center mobile-stack">
                    <Button
                      onClick={() => setShowTemplateSelector(true)}
                      variant="outline"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Ver Templates
                    </Button>
                    <Button
                      onClick={handleCreateNew}
                      className="gradient-blue"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Bot
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
