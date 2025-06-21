
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Plus, BookOpen, Edit, Eye, Share, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { chatbots, createChatbot, deleteChatbot } = useNylo();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [newBotDescription, setNewBotDescription] = useState('');

  const handleCreateBot = () => {
    if (!newBotName.trim()) {
      toast.error('Nome do chatbot é obrigatório');
      return;
    }

    const newBot = createChatbot(newBotName, newBotDescription);
    setIsCreateDialogOpen(false);
    setNewBotName('');
    setNewBotDescription('');
    toast.success('Chatbot criado com sucesso!');
    navigate(`/editor/${newBot.id}`);
  };

  const handleDeleteBot = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o chatbot "${name}"? Esta ação não pode ser desfeita.`)) {
      deleteChatbot(id);
      toast.success('Chatbot excluído com sucesso!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '-3s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 gradient-blue rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400">Gerencie seus chatbots</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/learn')}
              className="text-primary hover:text-primary-light hover:bg-primary/10"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Aprender Nylo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Meus Chatbots</h2>
            <p className="text-gray-400">
              {chatbots.length} {chatbots.length === 1 ? 'chatbot criado' : 'chatbots criados'}
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-blue hover:opacity-90 nylo-shadow">
                <Plus className="w-4 h-4 mr-2" />
                Novo Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent className="card-dark border-0 nylo-shadow">
              <DialogHeader>
                <DialogTitle className="gradient-text">Criar Novo Chatbot</DialogTitle>
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
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateBot}
                    className="flex-1 gradient-blue hover:opacity-90"
                  >
                    Criar Chatbot
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chatbots Grid */}
        {chatbots.length === 0 ? (
          <Card className="card-dark border-dashed border-2 border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum chatbot criado ainda
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm">
                Crie seu primeiro chatbot e comece a automatizar o atendimento do seu negócio
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gradient-blue hover:opacity-90 nylo-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Chatbot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((bot) => (
              <Card key={bot.id} className="card-dark border-0 nylo-shadow hover:scale-[1.02] transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                        {bot.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {bot.description || 'Sem descrição'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={bot.isOnline ? "default" : "secondary"}
                        className={bot.isOnline 
                          ? "bg-green-500/20 text-green-400 border-green-400/30" 
                          : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                        }
                      >
                        {bot.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBot(bot.id, bot.name)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-8 w-8"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-500">
                    Última atualização: {formatDate(bot.lastUpdated)}
                  </div>
                  
                  <div className="flex space-x-2">
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
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-white mb-6">Templates Prontos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-dark border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🏪</span>
                </div>
                <h4 className="font-semibold text-white mb-2">E-commerce</h4>
                <p className="text-sm text-gray-400">Suporte para lojas online</p>
              </CardContent>
            </Card>
            
            <Card className="card-dark border-dashed border-2 border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🏢</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Empresa</h4>
                <p className="text-sm text-gray-400">Atendimento corporativo</p>
              </CardContent>
            </Card>
            
            <Card className="card-dark border-dashed border-2 border-purple-400/30 bg-purple-400/5 hover:bg-purple-400/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">❓</span>
                </div>
                <h4 className="font-semibold text-white mb-2">FAQ</h4>
                <p className="text-sm text-gray-400">Perguntas frequentes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
