
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, updateChatbot } = useNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [sourceCode, setSourceCode] = useState(chatbot?.sourceCode || '');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
  
  const highlightSyntax = (code: string) => {
    let highlighted = code;
    
    // Highlight keywords
    nyloKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-nylo-blue font-semibold">${keyword}</span>`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/#.*$/gm, '<span class="text-nylo-gray-500 italic">$&</span>');
    
    return highlighted;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-nylo-blue/5 via-white to-nylo-cyan/5">
      {/* Header */}
      <header className="border-b border-nylo-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-nylo-gray-600 hover:text-nylo-blue"
              >
                ← Voltar
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold text-nylo-black">{chatbot.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={chatbot.isOnline ? "default" : "secondary"}
                    className={chatbot.isOnline 
                      ? "bg-green-100 text-green-700 border-green-200" 
                      : "bg-nylo-gray-100 text-nylo-gray-600 border-nylo-gray-200"
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
                className="border-nylo-gray-200"
              >
                Preview
              </Button>
              <Button 
                variant="outline" 
                onClick={handleToggleOnline}
                className={chatbot.isOnline 
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-green-200 text-green-600 hover:bg-green-50"
                }
              >
                {chatbot.isOnline ? 'Desativar' : 'Ativar'}
              </Button>
              <Button 
                onClick={handleSave}
                className="gradient-blue hover:opacity-90 nylo-shadow"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b border-nylo-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-nylo-black">Editor NyloLang</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  Nylo v1.0
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <Textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full h-full font-mono text-sm border-nylo-gray-200 focus:border-nylo-blue resize-none"
              placeholder="# Digite seu código NyloLang aqui..."
              style={{ minHeight: '500px' }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-nylo-gray-200 bg-white">
          <Tabs defaultValue="snippets" className="h-full">
            <TabsList className="w-full justify-start px-4 pt-4">
              <TabsTrigger value="snippets">Snippets</TabsTrigger>
              <TabsTrigger value="help">Ajuda</TabsTrigger>
            </TabsList>
            
            <TabsContent value="snippets" className="px-4 pb-4 space-y-4">
              <div>
                <h3 className="font-semibold text-nylo-black mb-3">Código Pronto</h3>
                <div className="space-y-3">
                  {snippets.map((snippet, index) => (
                    <Card key={index} className="border-nylo-gray-200 cursor-pointer hover:bg-nylo-gray-50 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-nylo-black">{snippet.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs text-nylo-gray-600 bg-nylo-gray-50 p-2 rounded overflow-x-auto">
                          {snippet.code}
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setSourceCode(prev => prev + '\n\n' + snippet.code);
                            toast.success('Snippet adicionado!');
                          }}
                          className="w-full mt-2 text-nylo-blue hover:text-nylo-cyan hover:bg-nylo-blue/5"
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
                  <h3 className="font-semibold text-nylo-black mb-3">Tokens NyloLang</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-nylo-blue">mensagem:</code>
                      <span className="text-nylo-gray-600">Define uma mensagem</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-nylo-blue">botao:</code>
                      <span className="text-nylo-gray-600">Cria um botão</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-nylo-blue">fluxo:</code>
                      <span className="text-nylo-gray-600">Define um fluxo</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-nylo-blue">inicio:</code>
                      <span className="text-nylo-gray-600">Fluxo inicial</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-nylo-blue">fim</code>
                      <span className="text-nylo-gray-600">Finaliza o código</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-nylo-black mb-2">Exemplo Básico</h4>
                  <pre className="text-xs bg-nylo-gray-50 p-3 rounded overflow-x-auto">
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
