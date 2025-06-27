
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

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

interface ChatbotData {
  id: string;
  name: string;
  nylo_code: string;
  settings: any;
}

const Chat = () => {
  const { id } = useParams();
  const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFlow, setCurrentFlow] = useState('inicio');
  const [isWaitingForName, setIsWaitingForName] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [parsedFlows, setParsedFlows] = useState<ParsedFlow>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('Chat: Component initialized', { id });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

  // Load chatbot data
  useEffect(() => {
    const loadChatbot = async () => {
      if (!id) {
        console.log('Chat: No ID provided');
        setIsLoading(false);
        return;
      }

      console.log('Chat: Loading chatbot', { id });

      try {
        const { data, error } = await supabase
          .from('chatbots')
          .select('id, name, nylo_code, settings')
          .eq('id', id)
          .eq('is_online', true)
          .single();

        if (error) {
          console.error('Chat: Error loading chatbot:', error);
          setIsLoading(false);
          return;
        }

        console.log('Chat: Chatbot loaded successfully', data);
        setChatbot(data);

        // Parse flows and initialize chat
        const flows = parseNyloCode(data.nylo_code);
        setParsedFlows(flows);
        
        if (flows.inicio) {
          addBotMessage(flows.inicio.message, flows.inicio.buttons);
        }
      } catch (error) {
        console.error('Chat: Error loading chatbot:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatbot();
  }, [id, parseNyloCode, addBotMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Carregando chatbot...</div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Chatbot não encontrado</h1>
          <p className="text-gray-400">Este chatbot pode estar offline ou não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] bg-gray-800 border-gray-700 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div 
          className="p-4 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)` 
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">
                {chatbot.settings?.businessName || chatbot.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-gray-700 text-white'
                    : 'text-white'
                }`}
                style={!message.isBot ? {
                  background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)`
                } : {}}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                {message.buttons && (
                  <div className="mt-3 space-y-2">
                    {message.buttons.map((button, buttonIndex) => (
                      <Button
                        key={buttonIndex}
                        size="sm"
                        variant="outline"
                        onClick={() => handleButtonClick(button.action)}
                        className="w-full text-left border-blue-400/20 text-blue-400 hover:bg-blue-400 hover:text-white text-sm"
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
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Digite seu nome..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                style={{ 
                  background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)` 
                }}
              >
                Enviar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Chat;
