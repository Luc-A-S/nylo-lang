
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
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
  const { getChatbot, updateChatbot, deleteChatbot } = useSupabaseNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [settings, setSettings] = useState(chatbot?.settings || {
    brandingColor: '#356CFF',
    businessName: '',
    welcomeMessage: ''
  });

  console.log('Settings: Component initialized', { id, chatbot: !!chatbot });

  useEffect(() => {
    console.log('Settings: useEffect triggered', { id, chatbot: !!chatbot });
    
    if (!chatbot) {
      console.log('Settings: Chatbot not found, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    setSettings(chatbot.settings || {
      brandingColor: '#356CFF',
      businessName: chatbot.name,
      welcomeMessage: 'Olá! Como posso ajudar você hoje?'
    });
  }, [chatbot, navigate]);

  const handleSave = async () => {
    if (!chatbot) return;
    
    console.log('Settings: Saving chatbot settings', { id: chatbot.id, settings });
    
    try {
      await updateChatbot(chatbot.id, { settings });
      setChatbot(prev => prev ? { ...prev, settings } : null);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Settings: Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    }
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

  const handleDelete = async () => {
    if (!chatbot) return;
    
    try {
      await deleteChatbot(chatbot.id);
      toast.success('Chatbot excluído com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Settings: Error deleting chatbot:', error);
      toast.error('Erro ao excluir chatbot');
    }
  };

  const handleCopyLink = () => {
    if (!chatbot?.publicLink) return;
    
    navigator.clipboard.writeText(`https://${chatbot.publicLink}`);
    toast.success('Link copiado para a área de transferência!');
  };

  if (!chatbot) {
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
        <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div>
                <h1 className="text-base md:text-lg font-semibold text-white truncate">Configurações: {chatbot.name}</h1>
                <Badge 
                  variant={chatbot.isOnline ? "default" : "secondary"}
                  className={`text-xs mt-1 ${chatbot.isOnline 
                    ? "bg-green-500/20 text-green-400 border-green-400/30" 
                    : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                  }`}
                >
                  {chatbot.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto">
              <Button 
                onClick={handleSave}
                className="gradient-blue hover:opacity-90 nylo-shadow text-xs md:text-sm px-3 md:px-4 h-8 md:h-10"
              >
                <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Salvar Alterações</span>
                <span className="sm:hidden">Salvar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl relative z-10">
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-nylo-card/50 backdrop-blur-lg border border-white/10 p-1 md:p-2 rounded-lg h-auto gap-1">
            <TabsTrigger 
              value="appearance" 
              className="flex flex-col items-center justify-center px-2 md:px-4 py-3 md:py-4 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 text-xs md:text-sm"
            >
              <Palette className="w-3 h-3 md:w-4 md:h-4 mb-1" />
              Aparência
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex flex-col items-center justify-center px-2 md:px-4 py-3 md:py-4 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 text-xs md:text-sm"
            >
              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mb-1" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger 
              value="sharing" 
              className="flex flex-col items-center justify-center px-2 md:px-4 py-3 md:py-4 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 text-xs md:text-sm"
            >
              <Globe className="w-3 h-3 md:w-4 md:h-4 mb-1" />
              <span className="hidden sm:inline">Compartilhamento</span>
              <span className="sm:hidden">Compartilhar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex flex-col items-center justify-center px-2 md:px-4 py-3 md:py-4 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 text-xs md:text-sm"
            >
              <BarChart3 className="w-3 h-3 md:w-4 md:h-4 mb-1" />
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base md:text-lg">
                  <Palette className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Personalização Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-white text-sm md:text-base">Nome do Negócio</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => setSettings(prev => ({...prev, businessName: e.target.value}))}
                    placeholder="Ex: Minha Empresa"
                    className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandingColor" className="text-white text-sm md:text-base">Cor Principal</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Input
                      id="brandingColor"
                      type="color"
                      value={settings.brandingColor}
                      onChange={(e) => setSettings(prev => ({...prev, brandingColor: e.target.value}))}
                      className="w-16 h-10 md:w-20 md:h-12 glass-effect border-white/20"
                    />
                    <Input
                      value={settings.brandingColor}
                      onChange={(e) => setSettings(prev => ({...prev, brandingColor: e.target.value}))}
                      placeholder="#356CFF"
                      className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary flex-1 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="p-3 md:p-4 glass-effect rounded-lg border border-white/20">
                  <p className="text-xs md:text-sm text-gray-400 mb-2">Preview do Header</p>
                  <div 
                    className="p-3 md:p-4 rounded-lg text-white"
                    style={{ backgroundColor: settings.brandingColor }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm md:text-base truncate">{settings.businessName || 'Nome do Negócio'}</h3>
                        <div className="flex items-center space-x-2 text-xs md:text-sm text-white/80">
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
                <CardTitle className="text-white flex items-center text-base md:text-lg">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Configuração de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage" className="text-white text-sm md:text-base">Mensagem de Boas-vindas</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings(prev => ({...prev, welcomeMessage: e.target.value}))}
                    placeholder="Olá! Como posso ajudar você hoje?"
                    className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary min-h-[100px] text-sm md:text-base"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base md:text-lg">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Compartilhamento e Acesso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chatbot.publicLink && (
                  <div className="space-y-2">
                    <Label className="text-white text-sm md:text-base">Link Público</Label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        value={`https://${chatbot.publicLink}`}
                        readOnly
                        className="glass-effect border-white/20 text-white bg-white/5 flex-1 text-sm md:text-base"
                      />
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleCopyLink}
                          className="border-white/20 text-white hover:bg-white/10 px-3 h-10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`https://${chatbot.publicLink}`, '_blank')}
                          className="border-white/20 text-white hover:bg-white/10 px-3 h-10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-3 md:p-4 glass-effect rounded-lg border border-white/20">
                  <div className="text-center">
                    <p className="text-lg md:text-2xl font-bold text-primary">{chatbot.accessCount || 0}</p>
                    <p className="text-xs md:text-sm text-gray-400">Total de Acessos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg md:text-2xl font-bold text-green-400">{chatbot.todayAccessCount || 0}</p>
                    <p className="text-xs md:text-sm text-gray-400">Acessos Hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="card-dark border-0 nylo-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base md:text-lg">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Configurações Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 glass-effect rounded-lg border border-white/20 gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm md:text-base">Exportar Configurações</h3>
                    <p className="text-xs md:text-sm text-gray-400">Baixe um arquivo JSON com todas as configurações</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="border-white/20 text-white hover:bg-white/10 text-xs md:text-sm w-full sm:w-auto"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 glass-effect rounded-lg border border-white/20 gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm md:text-base">Importar Configurações</h3>
                    <p className="text-xs md:text-sm text-gray-400">Carregue configurações de um arquivo JSON</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 text-xs md:text-sm w-full sm:w-auto"
                  >
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Importar
                  </Button>
                </div>

                <Separator className="bg-white/20" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 glass-effect rounded-lg border border-red-500/20 bg-red-500/5 gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm md:text-base">Excluir Chatbot</h3>
                    <p className="text-xs md:text-sm text-gray-400">Esta ação não pode ser desfeita</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs md:text-sm w-full sm:w-auto"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Excluir
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
                          Tem certeza que deseja excluir o chatbot <span className="font-semibold text-white">"{chatbot.name}"</span>?
                          <br /><br />
                          <span className="text-red-400 font-medium">Esta ação não pode ser desfeita.</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
                        <AlertDialogCancel className="glass-effect border-white/20 text-white hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600 text-white border-0 w-full sm:w-auto order-1 sm:order-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sim, excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
