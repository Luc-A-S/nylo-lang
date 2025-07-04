import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { supabase } from '@/integrations/supabase/client';
import { templates as templateData } from '@/data/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Plus, BookOpen, Edit, Eye, Share, Trash2, LogOut, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { chatbots, createChatbot, deleteChatbot, createChatbotFromTemplate, user } = useSupabaseNylo();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newBotName, setNewBotName] = useState('');
  const [newBotDescription, setNewBotDescription] = useState('');

  const templates = [
    {
      id: 'ecommerce-1',
      name: 'E-commerce',
      description: 'Atendimento para lojas online',
      icon: '🏪',
      color: 'bg-green-500',
      defaultName: 'Atendimento E-commerce'
    },
    {
      id: 'empresa-1',
      name: 'Empresa',
      description: 'Atendimento corporativo',
      icon: '🏢',
      color: 'bg-blue-500',
      defaultName: 'Atendimento Empresarial'
    },
    {
      id: 'faq-1',
      name: 'FAQ',
      description: 'Perguntas frequentes',
      icon: '❓',
      color: 'bg-purple-500',
      defaultName: 'FAQ Automático'
    }
  ];

  const handleCreateBot = async () => {
    if (!newBotName.trim()) {
      toast.error('Nome do chatbot é obrigatório');
      return;
    }

    try {
      const newBot = await createChatbot(newBotName, newBotDescription);
      setIsCreateDialogOpen(false);
      setNewBotName('');
      setNewBotDescription('');
      toast.success('Chatbot criado com sucesso!');
      navigate(`/editor/${newBot.id}`);
    } catch (error) {
      console.error('Error creating chatbot:', error);
      toast.error('Erro ao criar chatbot');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setNewBotName(template.defaultName);
      setNewBotDescription('');
      setIsTemplateDialogOpen(true);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!newBotName.trim()) {
      toast.error('Nome do chatbot é obrigatório');
      return;
    }

    const templateObject = templateData.find(t => t.id === selectedTemplate);
    if (!templateObject) {
      toast.error('Template não encontrado');
      return;
    }

    try {
      const newBot = await createChatbotFromTemplate(templateObject, newBotName, newBotDescription);
      setIsTemplateDialogOpen(false);
      setNewBotName('');
      setNewBotDescription('');
      setSelectedTemplate('');
      toast.success('Chatbot criado com sucesso!');
      navigate(`/editor/${newBot.id}`);
    } catch (error) {
      console.error('Error creating chatbot from template:', error);
      toast.error('Erro ao criar chatbot');
    }
  };

  const handleDeleteBot = async (id: string, name: string) => {
    try {
      await deleteChatbot(id);
      toast.success('Chatbot excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast.error('Erro ao excluir chatbot');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erro ao fazer logout');
      } else {
        navigate('/');
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-80 md:h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '-3s'}}></div>
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 gradient-blue rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-white">Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-400">Gerencie seus chatbots</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/learn')}
              className="text-primary hover:text-primary-light hover:bg-primary/10 text-xs md:text-sm px-2 md:px-4 h-8 md:h-10"
            >
              <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Aprender Nylo</span>
              <span className="sm:hidden">Aprender</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs md:text-sm px-2 md:px-4 h-8 md:h-10"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Sair
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="card-dark border-red-500/30 nylo-shadow w-[90vw] max-w-md mx-auto">
                <AlertDialogHeader className="text-left">
                  <AlertDialogTitle className="text-white text-lg md:text-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <LogOut className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="min-w-0">Sair da Plataforma</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300 leading-relaxed text-sm md:text-base pt-2">
                    Tem certeza que deseja sair da plataforma Nylo?
                    <br /><br />
                    <span className="text-gray-400">Você precisará fazer login novamente para acessar seus chatbots.</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
                  <AlertDialogCancel className="glass-effect border-white/20 text-white hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white border-0 w-full sm:w-auto order-1 sm:order-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sim, sair
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Meus Chatbots</h2>
            <p className="text-sm md:text-base text-gray-400">
              {chatbots.length} {chatbots.length === 1 ? 'chatbot criado' : 'chatbots criados'}
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-blue hover:opacity-90 nylo-shadow text-sm md:text-base px-4 md:px-6 h-10 md:h-12 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Novo Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent className="card-dark border-primary/30 nylo-shadow text-white w-[90vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="gradient-text text-lg md:text-xl">Criar Novo Chatbot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Nome do Chatbot *
                  </label>
                  <Input
                    placeholder="Ex: Atendimento Loja Online"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Descrição (opcional)
                  </label>
                  <Textarea
                    placeholder="Descreva o propósito do seu chatbot..."
                    value={newBotDescription}
                    onChange={(e) => setNewBotDescription(e.target.value)}
                    className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary min-h-[80px]"
                  />
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10 order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateBot}
                    className="flex-1 gradient-blue hover:opacity-90 order-1 sm:order-2"
                  >
                    Criar Chatbot
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {chatbots.length === 0 ? (
          <Card className="card-dark border-dashed border-2 border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
              <div className="w-12 h-12 md:w-16 md:h-16 gradient-blue rounded-2xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                Nenhum chatbot criado ainda
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-6 max-w-sm">
                Crie seu primeiro chatbot e comece a automatizar o atendimento do seu negócio
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gradient-blue hover:opacity-90 nylo-shadow w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Chatbot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {chatbots.map((bot) => (
              <Card key={bot.id} className="card-dark border-0 nylo-shadow hover:scale-[1.02] transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg text-white group-hover:text-primary transition-colors truncate">
                        {bot.name}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-gray-400 mt-1 line-clamp-2">
                        {bot.description || 'Sem descrição'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <Badge 
                        variant={bot.isOnline ? "default" : "secondary"}
                        className={`text-xs ${bot.isOnline 
                          ? "bg-green-500/20 text-green-400 border-green-400/30" 
                          : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                        }`}
                      >
                        {bot.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-6 w-6 md:h-8 md:w-8"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="card-dark border-red-500/30 nylo-shadow w-[90vw] max-w-md mx-auto">
                          <AlertDialogHeader className="text-left">
                            <AlertDialogTitle className="text-white text-lg md:text-xl flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <Trash2 className="w-5 h-5 text-red-400" />
                              </div>
                              <span className="min-w-0">Excluir Chatbot</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300 leading-relaxed text-sm md:text-base pt-2">
                              Tem certeza que deseja excluir o chatbot <span className="font-semibold text-white">"{bot.name}"</span>?
                              <br /><br />
                              <span className="text-red-400 font-medium">Esta ação não pode ser desfeita.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
                            <AlertDialogCancel className="glass-effect border-white/20 text-white hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteBot(bot.id, bot.name)}
                              className="bg-red-500 hover:bg-red-600 text-white border-0 w-full sm:w-auto order-1 sm:order-2"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs md:text-sm text-gray-500">
                    Última atualização: {formatDate(bot.lastUpdated)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 bg-black/20 p-2 rounded">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Acessos: {bot.accessCount || 0}
                    </span>
                    <span>Hoje: {bot.todayAccessCount || 0}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/editor/${bot.id}`)}
                      className="flex-1 gradient-blue hover:opacity-90 text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/preview/${bot.id}`)}
                      className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                  
                  {bot.publicLink && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => navigate(`/share/${bot.id}`)}
                      className="w-full text-primary hover:text-primary-light hover:bg-primary/10 text-xs"
                    >
                      <Share className="w-3 h-3 mr-1" />
                      Ver Link Público →
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Templates Section */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Templates Prontos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className="card-dark border-white/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${template.color} rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-lg md:text-xl">{template.icon}</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2 text-sm md:text-base">{template.name}</h4>
                  <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">{template.description}</p>
                  <Button className="w-full gradient-blue hover:opacity-90 transition-opacity text-xs md:text-sm">
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Template Dialog */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className="card-dark border-primary/30 nylo-shadow text-white w-[90vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="gradient-text text-lg md:text-xl">
                Criar Chatbot com Template {templates.find(t => t.id === selectedTemplate)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Nome do Chatbot *
                </label>
                <Input
                  placeholder="Ex: Atendimento Loja Online"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Descrição (opcional)
                </label>
                <Textarea
                  placeholder="Descreva o propósito do seu chatbot..."
                  value={newBotDescription}
                  onChange={(e) => setNewBotDescription(e.target.value)}
                  className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary min-h-[80px]"
                />
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsTemplateDialogOpen(false)}
                  className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10 order-2 sm:order-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateFromTemplate}
                  className="flex-1 gradient-blue hover:opacity-90 order-1 sm:order-2"
                >
                  Criar com Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
