
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
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
  const { getChatbot, generatePublicLink } = useSupabaseNylo();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFlow, setCurrentFlow] = useState('inicio');
  const [isWaitingForName, setIsWaitingForName] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('Preview: Component initialized', { id, chatbot: !!chatbot });

  // Memoize parsed flows to avoid recalculating on every render
  const parsedFlows = useMemo(() => {
    if (!chatbot?.sourceCode) return {};
    return parseNyloCode(chatbot.sourceCode);
  }, [chatbot?.sourceCode]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chatbot and chat
  useEffect(() => {
    console.log('Preview: useEffect triggered', { id, chatbot: !!chatbot });
    
    if (!id) {
      console.log('Preview: No ID provided, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    const foundChatbot = getChatbot(id);
    
    if (!foundChatbot) {
      console.log('Preview: Chatbot not found, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    setChatbot(foundChatbot);
    setIsLoading(false);
    
    // Initialize chat with the first flow
    const flows = parseNyloCode(foundChatbot.sourceCode);
    if (flows.inicio && messages.length === 0) {
      addBotMessage(flows.inicio.message, flows.inicio.buttons);
    }
  }, [id, getChatbot, navigate]); // Removed messages from dependencies to prevent loops

  const parseNyloCode = useCallback((code: string): ParsedFlow => {
    const flows: ParsedFlow = {};
    const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    let currentFlowName = '';
    let currentMessage = '';
    let currentButtons: { text: string; action: string }[] = [];
    let inMessage = false;
    let inButtons = false;

    for (const line of lines) {
      if (line.includes(':') && (line.startsWith('inicio') || line.startsWith('fluxo'))) {
        // Save previous flow if exists
        if (currentFlowName && currentMessage) {
          flows[currentFlowName] = {
            message: currentMessage.trim(),
            buttons: currentButtons.length > 0 ? [...currentButtons] : undefined
          };
        }
        
        // Start new flow
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
        // Save last flow
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
  }, []);

  const addBotMessage = useCallback((text: string, buttons?: { text: string; action: string }[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: true,
      buttons,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleButtonClick = useCallback((action: string) => {
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
  }, [parsedFlows, addBotMessage]);

  const handleSendMessage = useCallback(() => {
    if (!userInput.trim()) return;

    addUserMessage(userInput);

    if (isWaitingForName) {
      addBotMessage(`Olá, ${userInput}! Você está sendo conectado com um de nossos atendentes. Em breve alguém entrará em contato.`);
      setIsWaitingForName(false);
    }

    setUserInput('');
  }, [userInput, isWaitingForName, addUserMessage, addBotMessage]);

  const handleGenerateLink = useCallback(() => {
    if (!chatbot) return;
    const link = generatePublicLink(chatbot.id);
    navigate(`/share/${chatbot.id}`);
  }, [chatbot, generatePublicLink, navigate]);

  const handleRestart = useCallback(() => {
    setMessages([]);
    setCurrentFlow('inicio');
    setIsWaitingForName(false);
    setUserInput('');
    if (parsedFlows.inicio) {
      addBotMessage(parsedFlows.inicio.message, parsedFlows.inicio.buttons);
    }
  }, [parsedFlows, addBotMessage]);

  if (isLoading || !chatbot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div>
                <h1 className="text-base md:text-lg font-semibold text-white truncate">Preview: {chatbot.name}</h1>
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
            
            <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto overflow-x-auto">
              <Button 
                variant="outline" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
              >
                {isFullscreen ? <Minimize2 className="w-3 h-3 md:w-4 md:h-4" /> : <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />}
                <span className="hidden sm:inline ml-2">{isFullscreen ? 'Sair' : 'Expandir'}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline ml-2">Reiniciar</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/settings/${chatbot.id}`)}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
              >
                <Settings className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline ml-2">Config</span>
              </Button>
              <Button 
                onClick={handleGenerateLink}
                className="gradient-blue hover:opacity-90 nylo-shadow transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
              >
                <Share className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline ml-2">Compartilhar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className={`container mx-auto px-4 py-4 md:py-8 relative z-10 ${isFullscreen ? 'max-w-none h-full' : 'max-w-4xl'}`}>
        <Card className={`card-dark border-0 nylo-shadow overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]' : 'h-[500px] md:h-[600px]'}`}>
          {/* Chat Header */}
          <div 
            className="p-3 md:p-4 text-white transition-colors duration-300"
            style={{ background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)` }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm md:text-base truncate">{chatbot.settings?.businessName || chatbot.name}</h3>
                <div className="flex items-center space-x-2 text-xs md:text-sm text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="truncate">Online • Respondendo em segundos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            className={`flex-1 p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto scroll-smooth ${isFullscreen ? 'h-[calc(100vh-240px)] md:h-[calc(100vh-300px)]' : 'h-[380px] md:h-[480px]'}`}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: `${chatbot.settings?.brandingColor || '#356CFF'}30 transparent`
            }}
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    message.isBot
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg'
                      : 'text-white shadow-lg'
                  }`}
                  style={!message.isBot ? {
                    background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)`
                  } : {}}
                >
                  <p className="text-xs md:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  {message.buttons && (
                    <div className="mt-2 md:mt-3 space-y-1 md:space-y-2">
                      {message.buttons.map((button, buttonIndex) => (
                        <Button
                          key={buttonIndex}
                          size="sm"
                          variant="outline"
                          onClick={() => handleButtonClick(button.action)}
                          className="w-full text-left border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 text-xs md:text-sm h-8 md:h-auto"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1 md:mt-2 opacity-70">
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
            <div className="p-3 md:p-4 border-t border-white/10 bg-black/10">
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite seu nome..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary transition-all duration-300 text-sm md:text-base"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="transition-all duration-300 hover:scale-105 text-sm md:text-base px-3 md:px-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)` 
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
          <div className="mt-4 md:mt-6 grid grid-cols-3 gap-3 md:gap-4 text-center">
            <Card className="card-dark border-0 p-3 md:p-4">
              <p className="text-lg md:text-2xl font-bold text-primary">{messages.length}</p>
              <p className="text-xs md:text-sm text-gray-400">Mensagens</p>
            </Card>
            <Card className="card-dark border-0 p-3 md:p-4">
              <p className="text-lg md:text-2xl font-bold text-green-400">{messages.filter(m => !m.isBot).length}</p>
              <p className="text-xs md:text-sm text-gray-400">Respostas</p>
            </Card>
            <Card className="card-dark border-0 p-3 md:p-4">
              <p className="text-lg md:text-2xl font-bold text-blue-400 truncate">{currentFlow}</p>
              <p className="text-xs md:text-sm text-gray-400">Fluxo Atual</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
