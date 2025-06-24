
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Power, PowerOff, Save, Code, HelpCircle, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import CodeEditor from '@/components/CodeEditor';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, updateChatbot } = useSupabaseNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [sourceCode, setSourceCode] = useState(chatbot?.sourceCode || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log('Editor: Component initialized', { id, chatbot: !!chatbot });

  useEffect(() => {
    console.log('Editor: useEffect triggered', { id, chatbot: !!chatbot });
    
    if (!id) {
      console.log('Editor: No ID provided, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    const foundChatbot = getChatbot(id);
    console.log('Editor: Found chatbot', { id, foundChatbot: !!foundChatbot });
    
    if (!foundChatbot) {
      console.log('Editor: Chatbot not found, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    
    setChatbot(foundChatbot);
    setSourceCode(foundChatbot.sourceCode);
  }, [id, getChatbot, navigate]);

  const handleSave = async () => {
    if (!chatbot) return;
    
    console.log('Editor: Saving chatbot', { id: chatbot.id, sourceCodeLength: sourceCode.length });
    
    try {
      await updateChatbot(chatbot.id, { sourceCode });
      toast.success('Chatbot salvo com sucesso!');
    } catch (error) {
      console.error('Editor: Error saving chatbot:', error);
      toast.error('Erro ao salvar chatbot');
    }
  };

  const handleToggleOnline = async () => {
    if (!chatbot) return;
    
    const newStatus = !chatbot.isOnline;
    console.log('Editor: Toggling online status', { id: chatbot.id, newStatus });
    
    try {
      await updateChatbot(chatbot.id, { isOnline: newStatus });
      setChatbot(prev => prev ? { ...prev, isOnline: newStatus } : null);
      toast.success(`Chatbot ${newStatus ? 'ativado' : 'desativado'}!`);
    } catch (error) {
      console.error('Editor: Error toggling online status:', error);
      toast.error('Erro ao alterar status do chatbot');
    }
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
        <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl floating-animation"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div>
                <h1 className="text-base md:text-lg font-semibold text-white truncate max-w-32 sm:max-w-none">{chatbot.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={chatbot.isOnline ? "default" : "secondary"}
                    className={`text-xs ${chatbot.isOnline 
                      ? "bg-green-500/20 text-green-400 border-green-400/30" 
                      : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                    }`}
                  >
                    {chatbot.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/preview/${chatbot.id}`)}
                className="glass-effect border-white/20 text-white hover:bg-white/10 text-xs md:text-sm px-2 md:px-4 h-8 md:h-10"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleToggleOnline}
                className={`text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 ${chatbot.isOnline 
                  ? "border-red-400/30 text-red-400 hover:bg-red-400/10"
                  : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                }`}
              >
                {chatbot.isOnline ? (
                  <>
                    <PowerOff className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden sm:inline">Desativar</span>
                  </>
                ) : (
                  <>
                    <Power className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden sm:inline">Ativar</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSave}
                className="gradient-blue hover:opacity-90 nylo-shadow text-xs md:text-sm px-2 md:px-4 h-8 md:h-10"
              >
                <Save className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Salvar</span>
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10 h-8 w-8 md:h-10 md:w-10"
              >
                {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex h-[calc(100vh-80px)] relative z-10">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 md:p-4 bg-black/20 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center text-sm md:text-base">
                <Code className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Editor NyloLang
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Nylo v1.0
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <CodeEditor
              value={sourceCode}
              onChange={setSourceCode}
              language="yaml"
            />
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 border-l border-white/10 bg-black/20 backdrop-blur-sm">
          <Tabs defaultValue="help" className="h-full">
            <TabsList className="w-full justify-start px-4 pt-4 bg-transparent">
              <TabsTrigger 
                value="help"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-gray-400"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Ajuda
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="help" className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-3">Tokens NyloLang</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-primary">mensagem:</code>
                      <span className="text-gray-400">Define uma mensagem</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">botao:</code>
                      <span className="text-gray-400">Cria um botão</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">fluxo:</code>
                      <span className="text-gray-400">Define um fluxo</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">inicio:</code>
                      <span className="text-gray-400">Fluxo inicial</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">fim</code>
                      <span className="text-gray-400">Finaliza o código</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div>
                  <h4 className="font-medium text-white mb-2">Exemplo Básico</h4>
                  <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-gray-300">
{`inicio:
  mensagem:
    "Olá! Como posso ajudar?"
    botao 1:
      "Produto" -> produtos
    botao 2:
      "Suporte" -> suporte

fluxo produtos:
  mensagem:
    "Veja nossos produtos!"

fim`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Mobile - Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 w-80 max-w-[90vw] h-full bg-black/80 backdrop-blur-md border-l border-white/10">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Ajuda</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="font-semibold text-white mb-3">Tokens NyloLang</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-primary">mensagem:</code>
                      <span className="text-gray-400">Define uma mensagem</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">botao:</code>
                      <span className="text-gray-400">Cria um botão</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">fluxo:</code>
                      <span className="text-gray-400">Define um fluxo</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">inicio:</code>
                      <span className="text-gray-400">Fluxo inicial</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-primary">fim</code>
                      <span className="text-gray-400">Finaliza o código</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div>
                  <h4 className="font-medium text-white mb-2">Exemplo Básico</h4>
                  <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-gray-300">
{`inicio:
  mensagem:
    "Olá! Como posso ajudar?"
    botao 1:
      "Produto" -> produtos
    botao 2:
      "Suporte" -> suporte

fluxo produtos:
  mensagem:
    "Veja nossos produtos!"

fim`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
