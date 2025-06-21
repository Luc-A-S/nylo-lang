import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Eye, Power, PowerOff, Save, Code, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import CodeEditor from '@/components/CodeEditor';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, updateChatbot } = useNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [sourceCode, setSourceCode] = useState(chatbot?.sourceCode || '');

  useEffect(() => {
    if (!chatbot) {
      navigate('/dashboard');
      return;
    }
    setSourceCode(chatbot.sourceCode);
  }, [chatbot, navigate]);

  const handleSave = () => {
    if (!chatbot) return;
    
    updateChatbot(chatbot.id, { sourceCode });
    toast.success('Chatbot salvo com sucesso!');
  };

  const handleToggleOnline = () => {
    if (!chatbot) return;
    
    const newStatus = !chatbot.isOnline;
    updateChatbot(chatbot.id, { isOnline: newStatus });
    setChatbot(prev => prev ? { ...prev, isOnline: newStatus } : null);
    toast.success(`Chatbot ${newStatus ? 'ativado' : 'desativado'}!`);
  };

  const nyloKeywords = ['mensagem', 'botao', 'fluxo', 'inicio', 'fim', 'ir_para'];
  
  const snippets = [
    {
      title: 'Mensagem Simples',
      code: `mensagem:
  "Olá! Como posso te ajudar?"`
    },
    {
      title: 'Mensagem com Botões',
      code: `mensagem:
  "Escolha uma opção:"
  botao 1:
    "Opção A" -> fluxo_a
  botao 2:
    "Opção B" -> fluxo_b`
    },
    {
      title: 'Novo Fluxo',
      code: `fluxo nome_do_fluxo:
  mensagem:
    "Conteúdo do fluxo"`
    },
    {
      title: 'Atendimento Humano',
      code: `fluxo atendimento_humano:
  mensagem:
    "Conectando com atendente..."
    "Por favor, informe seu nome:"`
    }
  ];

  if (!chatbot) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl floating-animation"></div>
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
                <h1 className="text-lg font-semibold text-white">{chatbot.name}</h1>
                <div className="flex items-center space-x-2">
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
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/preview/${chatbot.id}`)}
                className="glass-effect border-white/20 text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                onClick={handleToggleOnline}
                className={chatbot.isOnline 
                  ? "border-red-400/30 text-red-400 hover:bg-red-400/10"
                  : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                }
              >
                {chatbot.isOnline ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-2" />
                    Desativar
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-2" />
                    Ativar
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSave}
                className="gradient-blue hover:opacity-90 nylo-shadow"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex h-[calc(100vh-80px)] relative z-10">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-black/20 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center">
                <Code className="w-4 h-4 mr-2" />
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

        {/* Sidebar */}
        <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-sm">
          <Tabs defaultValue="snippets" className="h-full">
            <TabsList className="w-full justify-start px-4 pt-4 bg-transparent">
              <TabsTrigger 
                value="snippets" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-gray-400"
              >
                <Code className="w-4 h-4 mr-2" />
                Snippets
              </TabsTrigger>
              <TabsTrigger 
                value="help"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-gray-400"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Ajuda
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="snippets" className="px-4 pb-4 space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-3">Código Pronto</h3>
                <div className="space-y-3">
                  {snippets.map((snippet, index) => (
                    <Card key={index} className="card-dark cursor-pointer hover:bg-white/5 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">{snippet.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs text-gray-400 bg-black/30 p-2 rounded overflow-x-auto">
                          {snippet.code}
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setSourceCode(prev => prev + '\n\n' + snippet.code);
                            toast.success('Snippet adicionado!');
                          }}
                          className="w-full mt-2 text-primary hover:text-primary-light hover:bg-primary/10"
                        >
                          Inserir
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
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
      </div>
    </div>
  );
};

export default Editor;
