import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, Share, Bot } from 'lucide-react';

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

  if (!chatbot) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl floating-animation"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/editor/${chatbot.id}`)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Editor
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">Preview: {chatbot.name}</h1>
                <Badge 
                  variant="outline" 
                  className="text-xs text-primary border-primary/30"
                >
                  Modo Teste
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setMessages([]);
                  setCurrentFlow('inicio');
                  setIsWaitingForName(false);
                  if (parsedFlows.inicio) {
                    addBotMessage(parsedFlows.inicio.message, parsedFlows.inicio.buttons);
                  }
                }}
                className="glass-effect border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reiniciar Chat
              </Button>
              <Button 
                onClick={handleGenerateLink}
                className="gradient-blue hover:opacity-90 nylo-shadow"
              >
                <Share className="w-4 h-4 mr-2" />
                Gerar Link Público
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Card className="h-[600px] card-dark border-0 nylo-shadow overflow-hidden">
          {/* Chat Header */}
          <div className="gradient-blue p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{chatbot.settings.businessName}</h3>
                <div className="flex items-center space-x-2 text-sm text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ height: '480px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-700 text-white'
                      : 'gradient-blue text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  {message.buttons && (
                    <div className="mt-3 space-y-2">
                      {message.buttons.map((button, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => handleButtonClick(button.action)}
                          className="w-full text-left border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          {isWaitingForName && (
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite seu nome..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary"
                />
                <Button
                  onClick={handleSendMessage}
                  className="gradient-blue hover:opacity-90"
                >
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Preview;
