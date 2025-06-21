
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Share, Bot, Settings, Maximize2, Minimize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  buttons?: { text: string; action: string }[];
  timestamp: Date;
}

interface ParsedFlow {
  [key: string]: {
    message: string;
    buttons?: { text: string; action: string }[];
  };
}

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, generatePublicLink } = useNylo();
  const [chatbot] = useState(getChatbot(id || ''));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFlow, setCurrentFlow] = useState('inicio');
  const [isWaitingForName, setIsWaitingForName] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [parsedFlows, setParsedFlows] = useState<ParsedFlow>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatbot) {
      navigate('/dashboard');
      return;
    }

    // Parse do código NyloLang
    const flows = parseNyloCode(chatbot.sourceCode);
    setParsedFlows(flows);
    
    // Inicia o chat
    if (flows.inicio) {
      addBotMessage(flows.inicio.message, flows.inicio.buttons);
    }
  }, [chatbot, navigate]);

  const parseNyloCode = (code: string): ParsedFlow => {
    const flows: ParsedFlow = {};
    const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    let currentFlowName = '';
    let currentMessage = '';
    let currentButtons: { text: string; action: string }[] = [];
    let inMessage = false;
    let inButtons = false;

    for (const line of lines) {
      if (line.includes(':') && (line.startsWith('inicio') || line.startsWith('fluxo'))) {
        // Salva o fluxo anterior se existir
        if (currentFlowName && currentMessage) {
          flows[currentFlowName] = {
            message: currentMessage.trim(),
            buttons: currentButtons.length > 0 ? [...currentButtons] : undefined
          };
        }
        
        // Inicia novo fluxo
        currentFlowName = line.startsWith('inicio') ? 'inicio' : line.split(' ')[1].replace(':', '');
        currentMessage = '';
        currentButtons = [];
        inMessage = false;
        inButtons = false;
      } else if (line === 'mensagem:') {
        inMessage = true;
        inButtons = false;
      } else if (line.startsWith('botao')) {
        inButtons = true;
        const buttonMatch = line.match(/botao \d+:/);
        if (buttonMatch) {
          // Botão será processado na próxima linha
        }
      } else if (line.startsWith('"') && line.endsWith('"')) {
        const text = line.slice(1, -1);
        if (inMessage) {
          currentMessage += (currentMessage ? '\n' : '') + text;
        }
      } else if (line.includes('" ->')) {
        const match = line.match(/"([^"]*)" -> (\w+)/);
        if (match && inButtons) {
          currentButtons.push({
            text: match[1],
            action: match[2]
          });
        }
      } else if (line === 'fim') {
        // Salva o último fluxo
        if (currentFlowName && currentMessage) {
          flows[currentFlowName] = {
            message: currentMessage.trim(),
            buttons: currentButtons.length > 0 ? [...currentButtons] : undefined
          };
        }
        break;
      }
    }

    return flows;
  };

  const addBotMessage = (text: string, buttons?: { text: string; action: string }[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: true,
      buttons,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleButtonClick = (action: string) => {
    if (action === 'atendimento_humano') {
      addBotMessage("Perfeito! Para conectar você com um atendente, preciso do seu nome:");
      setIsWaitingForName(true);
      return;
    }

    const flow = parsedFlows[action];
    if (flow) {
      setCurrentFlow(action);
      addBotMessage(flow.message, flow.buttons);
    } else {
      addBotMessage("Desculpe, não consegui processar sua solicitação.");
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    addUserMessage(userInput);

    if (isWaitingForName) {
      addBotMessage(`Olá, ${userInput}! Você está sendo conectado com um de nossos atendentes. Em breve alguém entrará em contato.`);
      setIsWaitingForName(false);
    }

    setUserInput('');
  };

  const handleGenerateLink = () => {
    if (!chatbot) return;
    const link = generatePublicLink(chatbot.id);
    navigate(`/share/${chatbot.id}`);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentFlow('inicio');
    setIsWaitingForName(false);
    if (parsedFlows.inicio) {
      addBotMessage(parsedFlows.inicio.message, parsedFlows.inicio.buttons);
    }
  };

  if (!chatbot) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-lg font-semibold text-white">Preview: {chatbot.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs text-primary border-primary/30"
                  >
                    Modo Teste
                  </Badge>
                  {isFullscreen && (
                    <Badge 
                      variant="outline" 
                      className="text-xs text-green-400 border-green-400/30"
                    >
                      Tela Cheia
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/settings/${chatbot.id}`)}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                onClick={handleGenerateLink}
                className="gradient-blue hover:opacity-90 nylo-shadow transition-all"
              >
                <Share className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className={`container mx-auto px-4 py-8 relative z-10 ${isFullscreen ? 'max-w-none h-full' : 'max-w-4xl'}`}>
        <Card className={`card-dark border-0 nylo-shadow overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-[calc(100vh-160px)]' : 'h-[600px]'}`}>
          {/* Chat Header */}
          <div 
            className="p-4 text-white transition-colors duration-300"
            style={{ background: `linear-gradient(135deg, ${chatbot.settings.brandingColor}, ${chatbot.settings.brandingColor}dd)` }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{chatbot.settings.businessName}</h3>
                <div className="flex items-center space-x-2 text-sm text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online • Respondendo em segundos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            className={`flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth ${isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-[480px]'}`}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: `${chatbot.settings.brandingColor}30 transparent`
            }}
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    message.isBot
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg'
                      : 'text-white shadow-lg'
                  }`}
                  style={!message.isBot ? {
                    background: `linear-gradient(135deg, ${chatbot.settings.brandingColor}, ${chatbot.settings.brandingColor}dd)`
                  } : {}}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  {message.buttons && (
                    <div className="mt-3 space-y-2">
                      {message.buttons.map((button, buttonIndex) => (
                        <Button
                          key={buttonIndex}
                          size="sm"
                          variant="outline"
                          onClick={() => handleButtonClick(button.action)}
                          className="w-full text-left border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {isWaitingForName && (
            <div className="p-4 border-t border-white/10 bg-black/10">
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite seu nome..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary transition-all duration-300"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${chatbot.settings.brandingColor}, ${chatbot.settings.brandingColor}dd)` 
                  }}
                >
                  Enviar
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Pressione Enter para enviar
              </p>
            </div>
          )}
        </Card>

        {/* Stats */}
        {!isFullscreen && (
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <Card className="card-dark border-0 p-4">
              <p className="text-2xl font-bold text-primary">{messages.length}</p>
              <p className="text-sm text-gray-400">Mensagens</p>
            </Card>
            <Card className="card-dark border-0 p-4">
              <p className="text-2xl font-bold text-green-400">{messages.filter(m => !m.isBot).length}</p>
              <p className="text-sm text-gray-400">Respostas do Usuário</p>
            </Card>
            <Card className="card-dark border-0 p-4">
              <p className="text-2xl font-bold text-blue-400">{currentFlow}</p>
              <p className="text-sm text-gray-400">Fluxo Atual</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
