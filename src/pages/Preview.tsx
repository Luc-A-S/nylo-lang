
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { PreviewHeader } from '@/components/PreviewHeader';
import { ChatInterface } from '@/components/ChatInterface';
import { PreviewStats } from '@/components/PreviewStats';
import { useVirtualizedMessages } from '@/hooks/useVirtualizedMessages';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [chatbot] = useState(getChatbot(id || ''));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFlow, setCurrentFlow] = useState('inicio');
  const [isWaitingForName, setIsWaitingForName] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [parsedFlows, setParsedFlows] = useState<ParsedFlow>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Usar debounce para input do usuário
  const debouncedUserInput = useDebounce(userInput, 300);

  // Virtualizar mensagens para melhor performance
  const { visibleMessages, hasMore, loadMore } = useVirtualizedMessages(messages);

  console.log('Preview: Component initialized', { id, chatbot: !!chatbot });

  // Memoizar parsing do código para evitar re-processamento
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
  }, []);

  useEffect(() => {
    console.log('Preview: useEffect triggered', { id, chatbot: !!chatbot });
    
    if (!chatbot) {
      console.log('Preview: Chatbot not found, redirecting to dashboard');
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
  }, [chatbot, navigate, parseNyloCode]);

  const addBotMessage = useCallback((text: string, buttons?: { text: string; action: string }[]) => {
    const newMessage: ChatMessage = {
      id: `bot-${Date.now()}-${Math.random()}`,
      text,
      isBot: true,
      buttons,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
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
    if (parsedFlows.inicio) {
      addBotMessage(parsedFlows.inicio.message, parsedFlows.inicio.buttons);
    }
  }, [parsedFlows, addBotMessage]);

  if (!chatbot) {
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

      <PreviewHeader
        chatbot={chatbot}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onRestart={handleRestart}
        onGenerateLink={handleGenerateLink}
      />

      {/* Chat Interface */}
      <div className={`container mx-auto px-4 py-4 md:py-8 relative z-10 ${isFullscreen ? 'max-w-none h-full' : 'max-w-4xl'}`}>
        <ChatInterface
          chatbot={chatbot}
          visibleMessages={visibleMessages}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onButtonClick={handleButtonClick}
          isWaitingForName={isWaitingForName}
          userInput={userInput}
          onUserInputChange={setUserInput}
          onSendMessage={handleSendMessage}
          isFullscreen={isFullscreen}
          messagesLength={messages.length}
        />

        {/* Stats */}
        {!isFullscreen && (
          <PreviewStats
            messages={messages}
            currentFlow={currentFlow}
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
