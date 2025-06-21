
import { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatBot {
  id: string;
  name: string;
  description: string;
  sourceCode: string;
  isOnline: boolean;
  lastUpdated: Date;
  publicLink?: string;
  accessCount?: number;
  todayAccessCount?: number;
  accessHistory?: Array<{
    date: Date;
    count: number;
    uniqueVisitors: number;
  }>;
  settings: {
    brandingColor: string;
    businessName: string;
    welcomeMessage: string;
  };
}

interface NyloContextType {
  chatbots: ChatBot[];
  createChatbot: (name: string, description: string) => ChatBot;
  updateChatbot: (id: string, updates: Partial<ChatBot>) => void;
  deleteChatbot: (id: string) => void;
  getChatbot: (id: string) => ChatBot | undefined;
  generatePublicLink: (id: string) => string;
  incrementAccessCount: (id: string) => void;
}

const NyloContext = createContext<NyloContextType | undefined>(undefined);

export const useNylo = () => {
  const context = useContext(NyloContext);
  if (!context) {
    throw new Error('useNylo must be used within a NyloProvider');
  }
  return context;
};

const defaultTemplate = `inicio:
  mensagem:
    "Olá! Que bom ver você por aqui. Como posso te ajudar hoje?"
    botao 1:
      "Quero saber mais sobre produtos" -> produtos
    botao 2:
      "Preciso de suporte técnico" -> suporte
    botao 3:
      "Falar com atendente" -> atendimento_humano

fluxo produtos:
  mensagem:
    "Ótimo! Temos várias opções incríveis para você."
    "Qual categoria te interessa mais?"
    botao 1:
      "Eletrônicos" -> eletronicos
    botao 2:
      "Roupas e Acessórios" -> roupas
    botao 3:
      "Voltar ao início" -> inicio

fluxo suporte:
  mensagem:
    "Estou aqui para te ajudar com qualquer problema técnico!"
    "Qual é a sua dúvida?"
    botao 1:
      "Problema com login" -> login_help
    botao 2:
      "Site não carrega" -> site_help
    botao 3:
      "Falar com especialista" -> atendimento_humano

fluxo atendimento_humano:
  mensagem:
    "Perfeito! Vou conectar você com um de nossos atendentes."
    "Por favor, informe seu nome para iniciarmos:"

fim`;

export const NyloProvider = ({ children }: { children: ReactNode }) => {
  const [chatbots, setChatbots] = useState<ChatBot[]>([
    {
      id: '1',
      name: 'Bot de Exemplo',
      description: 'Chatbot de demonstração com fluxo completo',
      sourceCode: defaultTemplate,
      isOnline: true,
      lastUpdated: new Date(),
      accessCount: 127,
      todayAccessCount: 8,
      accessHistory: [
        { date: new Date(Date.now() - 86400000), count: 15, uniqueVisitors: 12 },
        { date: new Date(Date.now() - 172800000), count: 23, uniqueVisitors: 18 },
        { date: new Date(Date.now() - 259200000), count: 31, uniqueVisitors: 24 },
      ],
      settings: {
        brandingColor: '#356CFF',
        businessName: 'Minha Empresa',
        welcomeMessage: 'Olá! Como posso ajudar?'
      }
    }
  ]);

  const createChatbot = (name: string, description: string): ChatBot => {
    const newBot: ChatBot = {
      id: Date.now().toString(),
      name,
      description,
      sourceCode: defaultTemplate,
      isOnline: false,
      lastUpdated: new Date(),
      accessCount: 0,
      todayAccessCount: 0,
      accessHistory: [],
      settings: {
        brandingColor: '#356CFF',
        businessName: name,
        welcomeMessage: 'Olá! Como posso ajudar?'
      }
    };

    setChatbots(prev => [...prev, newBot]);
    return newBot;
  };

  const updateChatbot = (id: string, updates: Partial<ChatBot>) => {
    setChatbots(prev => prev.map(bot => 
      bot.id === id 
        ? { ...bot, ...updates, lastUpdated: new Date() }
        : bot
    ));
  };

  const deleteChatbot = (id: string) => {
    setChatbots(prev => prev.filter(bot => bot.id !== id));
  };

  const getChatbot = (id: string): ChatBot | undefined => {
    return chatbots.find(bot => bot.id === id);
  };

  const generatePublicLink = (id: string): string => {
    const link = `nylo.app/${id}`;
    updateChatbot(id, { publicLink: link });
    return link;
  };

  const incrementAccessCount = (id: string) => {
    setChatbots(prev => prev.map(bot => 
      bot.id === id 
        ? { 
            ...bot, 
            accessCount: (bot.accessCount || 0) + 1,
            todayAccessCount: (bot.todayAccessCount || 0) + 1,
            lastUpdated: new Date()
          }
        : bot
    ));
  };

  return (
    <NyloContext.Provider value={{
      chatbots,
      createChatbot,
      updateChatbot,
      deleteChatbot,
      getChatbot,
      generatePublicLink,
      incrementAccessCount
    }}>
      {children}
    </NyloContext.Provider>
  );
};
