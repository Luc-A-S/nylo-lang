
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatbotSettings {
  brandingColor: string;
  businessName: string;
  welcomeMessage: string;
}

export interface AccessHistoryDay {
  date: string;
  count: number;
  uniqueVisitors: number;
}

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  isOnline: boolean;
  createdAt: Date;
  lastUpdated: Date;
  sourceCode: string;
  settings: ChatbotSettings;
  publicLink?: string;
  accessCount?: number;
  todayAccessCount?: number;
  accessHistory?: AccessHistoryDay[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'empresa' | 'faq';
  preview: string;
  sourceCode: string;
}

interface NyloContextType {
  chatbots: Chatbot[];
  createChatbot: (name: string, description?: string) => Chatbot;
  createChatbotFromTemplate: (template: Template, customName?: string, description?: string) => Chatbot;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => void;
  deleteChatbot: (id: string) => void;
  getChatbot: (id: string) => Chatbot | undefined;
  generatePublicLink: (id: string) => string;
}

const NyloContext = createContext<NyloContextType | undefined>(undefined);

export const useNylo = () => {
  const context = useContext(NyloContext);
  if (!context) {
    throw new Error('useNylo must be used within a NyloProvider');
  }
  return context;
};

interface NyloProviderProps {
  children: ReactNode;
}

export const NyloProvider = ({ children }: NyloProviderProps) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  const createChatbot = (name: string, description?: string): Chatbot => {
    const now = new Date();
    const newChatbot: Chatbot = {
      id: Date.now().toString(),
      name,
      description,
      isOnline: false,
      createdAt: now,
      lastUpdated: now,
      sourceCode: `inicio:
  mensagem:
    "Olá! Como posso te ajudar?"
    botao 1:
      "Produto" -> produtos
    botao 2:
      "Suporte" -> suporte

fluxo produtos:
  mensagem:
    "Veja nossos produtos!"

fluxo suporte:
  mensagem:
    "Como posso te ajudar?"

fim`,
      settings: {
        brandingColor: '#356CFF',
        businessName: name,
        welcomeMessage: 'Olá! Como posso te ajudar?'
      },
      accessCount: 0,
      todayAccessCount: 0,
      accessHistory: []
    };
    
    setChatbots(prev => [...prev, newChatbot]);
    return newChatbot;
  };

  const createChatbotFromTemplate = (template: Template, customName?: string, description?: string): Chatbot => {
    const now = new Date();
    const newChatbot: Chatbot = {
      id: Date.now().toString(),
      name: customName || template.name,
      description: description || template.description,
      isOnline: false,
      createdAt: now,
      lastUpdated: now,
      sourceCode: template.sourceCode,
      settings: {
        brandingColor: '#356CFF',
        businessName: customName || template.name,
        welcomeMessage: 'Olá! Como posso te ajudar?'
      },
      accessCount: 0,
      todayAccessCount: 0,
      accessHistory: []
    };
    
    setChatbots(prev => [...prev, newChatbot]);
    return newChatbot;
  };

  const updateChatbot = (id: string, updates: Partial<Chatbot>) => {
    setChatbots(prev => 
      prev.map(bot => 
        bot.id === id ? { ...bot, ...updates, lastUpdated: new Date() } : bot
      )
    );
  };

  const deleteChatbot = (id: string) => {
    setChatbots(prev => prev.filter(bot => bot.id !== id));
  };

  const getChatbot = (id: string): Chatbot | undefined => {
    return chatbots.find(bot => bot.id === id);
  };

  const generatePublicLink = (id: string): string => {
    const chatbot = getChatbot(id);
    if (!chatbot) return '';
    
    if (!chatbot.publicLink) {
      const link = `${chatbot.name.toLowerCase().replace(/\s+/g, '-')}-${id}.nylo.app`;
      updateChatbot(id, { publicLink: link });
      return link;
    }
    
    return chatbot.publicLink;
  };

  return (
    <NyloContext.Provider value={{
      chatbots,
      createChatbot,
      createChatbotFromTemplate,
      updateChatbot,
      deleteChatbot,
      getChatbot,
      generatePublicLink
    }}>
      {children}
    </NyloContext.Provider>
  );
};
