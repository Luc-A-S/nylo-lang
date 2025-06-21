
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    <div className="min-h-screen bg-gradient-to-br from-nylo-blue/5 via-white to-nylo-cyan/5">
      {/* Header */}
      <header className="border-b border-nylo-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 gradient-blue rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-nylo-black">Dashboard</h1>
              <p className="text-sm text-nylo-gray-600">Gerencie seus chatbots</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/learn')}
              className="text-nylo-blue hover:text-nylo-cyan hover:bg-nylo-blue/5"
            >
              Aprender Nylo
            </Button>
            <Button 
              variant="outline" 
              className="border-nylo-gray-200 text-nylo-gray-700 hover:bg-nylo-gray-50"
            >
              Configurações
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-nylo-black mb-2">Meus Chatbots</h2>
            <p className="text-nylo-gray-600">
              {chatbots.length} {chatbots.length === 1 ? 'chatbot criado' : 'chatbots criados'}
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-blue hover:opacity-90 nylo-shadow">
                + Novo Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent className="border-0 nylo-shadow">
              <DialogHeader>
                <DialogTitle className="gradient-text">Criar Novo Chatbot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-nylo-gray-700 mb-2 block">
                    Nome do Chatbot *
                  </label>
                  <Input
                    placeholder="Ex: Atendimento Loja Online"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    className="border-nylo-gray-200 focus:border-nylo-blue"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-nylo-gray-700 mb-2 block">
                    Descrição (opcional)
                  </label>
                  <Textarea
                    placeholder="Descreva o propósito do seu chatbot..."
                    value={newBotDescription}
                    onChange={(e) => setNewBotDescription(e.target.value)}
                    className="border-nylo-gray-200 focus:border-nylo-blue min-h-[80px]"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
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
          <Card className="border-dashed border-2 border-nylo-gray-200 bg-nylo-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-nylo-blue/10 rounded-2xl flex items-center justify-center mb-4">
                <div className="w-8 h-8 gradient-blue rounded-lg"></div>
              </div>
              <h3 className="text-lg font-semibold text-nylo-gray-700 mb-2">
                Nenhum chatbot criado ainda
              </h3>
              <p className="text-nylo-gray-500 mb-6 max-w-sm">
                Crie seu primeiro chatbot e comece a automatizar o atendimento do seu negócio
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gradient-blue hover:opacity-90 nylo-shadow"
              >
                + Criar Primeiro Chatbot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((bot) => (
              <Card key={bot.id} className="border-0 nylo-shadow hover:scale-[1.02] transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-nylo-black group-hover:text-nylo-blue transition-colors">
                        {bot.name}
                      </CardTitle>
                      <p className="text-sm text-nylo-gray-600 mt-1 line-clamp-2">
                        {bot.description || 'Sem descrição'}
                      </p>
                    </div>
                    <Badge 
                      variant={bot.isOnline ? "default" : "secondary"}
                      className={bot.isOnline 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-nylo-gray-100 text-nylo-gray-600 border-nylo-gray-200"
                      }
                    >
                      {bot.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-nylo-gray-500">
                    Última atualização: {formatDate(bot.lastUpdated)}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/editor/${bot.id}`)}
                      className="flex-1 gradient-blue hover:opacity-90 text-xs"
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/preview/${bot.id}`)}
                      className="flex-1 border-nylo-gray-200 text-nylo-gray-700 hover:bg-nylo-gray-50 text-xs"
                    >
                      Preview
                    </Button>
                  </div>
                  
                  {bot.publicLink && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => navigate(`/share/${bot.id}`)}
                      className="w-full text-nylo-blue hover:text-nylo-cyan hover:bg-nylo-blue/5 text-xs"
                    >
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
          <h3 className="text-xl font-semibold text-nylo-black mb-6">Templates Prontos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 border-nylo-blue/30 bg-nylo-blue/5 hover:bg-nylo-blue/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🏪</span>
                </div>
                <h4 className="font-semibold text-nylo-black mb-2">E-commerce</h4>
                <p className="text-sm text-nylo-gray-600">Suporte para lojas online</p>
              </CardContent>
            </Card>
            
            <Card className="border-dashed border-2 border-nylo-cyan/30 bg-nylo-cyan/5 hover:bg-nylo-cyan/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-nylo-cyan rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🏢</span>
                </div>
                <h4 className="font-semibold text-nylo-black mb-2">Empresa</h4>
                <p className="text-sm text-nylo-gray-600">Atendimento corporativo</p>
              </CardContent>
            </Card>
            
            <Card className="border-dashed border-2 border-purple-300 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">❓</span>
                </div>
                <h4 className="font-semibold text-nylo-black mb-2">FAQ</h4>
                <p className="text-sm text-nylo-gray-600">Perguntas frequentes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
