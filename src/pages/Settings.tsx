
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Save, 
  Palette, 
  MessageSquare, 
  Globe, 
  BarChart3,
  Download,
  Upload,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, updateChatbot, deleteChatbot } = useNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [settings, setSettings] = useState(chatbot?.settings || {
    brandingColor: '#356CFF',
    businessName: '',
    welcomeMessage: ''
  });

  useEffect(() => {
    if (!chatbot) {
      navigate('/dashboard');
      return;
    }
    setSettings(chatbot.settings);
  }, [chatbot, navigate]);

  const handleSave = () => {
    if (!chatbot) return;
    
    updateChatbot(chatbot.id, { settings });
    toast.success('Configurações salvas com sucesso!');
  };

  const handleExport = () => {
    if (!chatbot) return;
    
    const dataStr = JSON.stringify(chatbot, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${chatbot.name.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Configuração exportada!');
  };

  const handleDelete = () => {
    if (!chatbot) return;
    
    const confirmed = window.confirm('Tem certeza que deseja excluir este chatbot? Esta ação não pode ser desfeita.');
    if (confirmed) {
      deleteChatbot(chatbot.id);
      toast.success('Chatbot excluído com sucesso!');
      navigate('/dashboard');
    }
  };

  const handleCopyLink = () => {
    if (!chatbot?.publicLink) return;
    
    navigator.clipboard.writeText(`https://${chatbot.publicLink}`);
    toast.success('Link copiado para a área de transferência!');
  };

  if (!chatbot) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <div>
                <h1 className="text-lg font-semibold text-white">Configurações: {chatbot.name}</h1>
                <Badge 
                  variant={chatbot.isOnline ? "default" : "secondary"}
                  className={chatbot.isOnline 
                    ? "bg-green-500/20 text-green-400 border-green-400/30" 
                    : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                  }
                >
                  {chatbot.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleSave}
                className="gradient-blue hover:opacity-90 nylo-shadow"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-nylo-card/50 backdrop-blur-lg border border-white/10 p-1 rounded-lg">
            <TabsTrigger 
              value="appearance" 
              className="flex items-center justify-center px-4 py-3 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <Palette className="w-4 h-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center justify-center px-4 py-3 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger 
              value="sharing" 
              className="flex items-center justify-center px-4 py-3 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <Globe className="w-4 h-4 mr-2" />
              Compartilhamento
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex items-center justify-center px-4 py-3 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Personalização Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-white">Nome do Negócio</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => setSettings(prev => ({...prev, businessName: e.target.value}))}
                    placeholder="Ex: Minha Empresa"
                    className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandingColor" className="text-white">Cor Principal</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="brandingColor"
                      type="color"
                      value={settings.brandingColor}
                      onChange={(e) => setSettings(prev => ({...prev, brandingColor: e.target.value}))}
                      className="w-20 h-12 glass-effect border-white/20"
                    />
                    <Input
                      value={settings.brandingColor}
                      onChange={(e) => setSettings(prev => ({...prev, brandingColor: e.target.value}))}
                      placeholder="#356CFF"
                      className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="p-4 glass-effect rounded-lg border border-white/20">
                  <p className="text-sm text-gray-400 mb-2">Preview do Header</p>
                  <div 
                    className="p-4 rounded-lg text-white"
                    style={{ backgroundColor: settings.brandingColor }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{settings.businessName || 'Nome do Negócio'}</h3>
                        <div className="flex items-center space-x-2 text-sm text-white/80">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Configuração de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage" className="text-white">Mensagem de Boas-vindas</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings(prev => ({...prev, welcomeMessage: e.target.value}))}
                    placeholder="Olá! Como posso ajudar você hoje?"
                    className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Compartilhamento e Acesso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chatbot.publicLink && (
                  <div className="space-y-2">
                    <Label className="text-white">Link Público</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={`https://${chatbot.publicLink}`}
                        readOnly
                        className="glass-effect border-white/20 text-white bg-white/5"
                      />
                      <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(`https://${chatbot.publicLink}`, '_blank')}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 glass-effect rounded-lg border border-white/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{chatbot.accessCount || 0}</p>
                    <p className="text-sm text-gray-400">Total de Acessos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{chatbot.todayAccessCount || 0}</p>
                    <p className="text-sm text-gray-400">Acessos Hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Configurações Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/20">
                  <div>
                    <h3 className="font-medium text-white">Exportar Configurações</h3>
                    <p className="text-sm text-gray-400">Baixe um arquivo JSON com todas as configurações</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/20">
                  <div>
                    <h3 className="font-medium text-white">Importar Configurações</h3>
                    <p className="text-sm text-gray-400">Carregue configurações de um arquivo JSON</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                </div>

                <Separator className="bg-white/20" />

                <div className="flex items-center justify-between p-4 glass-effect rounded-lg border border-red-500/20 bg-red-500/5">
                  <div>
                    <h3 className="font-medium text-white">Excluir Chatbot</h3>
                    <p className="text-sm text-gray-400">Esta ação não pode ser desfeita</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
