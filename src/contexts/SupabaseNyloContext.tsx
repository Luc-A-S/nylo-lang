
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Chatbot, Template } from '@/types/chatbot';
import { useOptimizedChatbotData } from '@/hooks/useOptimizedChatbotData';
import { useChatbotOperations } from '@/hooks/useChatbotOperations';

interface SupabaseNyloContextType {
  user: User | null;
  session: Session | null;
  chatbots: Chatbot[];
  loading: boolean;
  createChatbot: (name: string, description?: string) => Promise<Chatbot>;
  createChatbotFromTemplate: (template: Template, name: string, description?: string) => Promise<Chatbot>;
  getChatbot: (id: string) => Chatbot | null;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => Promise<void>;
  deleteChatbot: (id: string) => Promise<void>;
  refreshChatbots: (force?: boolean) => void;
  generatePublicLink: (id: string) => string;
}

const SupabaseNyloContext = createContext<SupabaseNyloContextType | undefined>(undefined);

export function SupabaseNyloProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Usar hook otimizado
  const { chatbots, setChatbots, refreshChatbots, loading: chatbotsLoading } = useOptimizedChatbotData(user, session);
  const { createChatbot, createChatbotFromTemplate, updateChatbot, deleteChatbot } = useChatbotOperations(user, setChatbots);

  useEffect(() => {
    console.log('SupabaseNyloContext: Setting up auth state listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('SupabaseNyloContext: Initial session check', { 
        session: !!session, 
        user: !!session?.user 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('SupabaseNyloContext: Initial session found, refreshing chatbots');
        // Usar timeout para evitar chamadas simultâneas
        setTimeout(() => refreshChatbots(true), 100);
      }
      setAuthLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('SupabaseNyloContext: Auth state changed', { 
        event, 
        session: !!session, 
        user: !!session?.user 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log('SupabaseNyloContext: User signed in, refreshing chatbots');
        setTimeout(() => refreshChatbots(true), 100);
      } else if (event === 'SIGNED_OUT') {
        console.log('SupabaseNyloContext: User signed out, clearing chatbots');
        setChatbots([]);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshChatbots, setChatbots]);

  const getChatbot = (id: string): Chatbot | null => {
    return chatbots.find(bot => bot.id === id) || null;
  };

  const generatePublicLink = (id: string): string => {
    const chatbot = getChatbot(id);
    if (!chatbot || !chatbot.publicLink) return '';
    return chatbot.publicLink;
  };

  const contextValue = {
    user,
    session,
    chatbots,
    loading: authLoading || chatbotsLoading,
    createChatbot,
    createChatbotFromTemplate,
    getChatbot,
    updateChatbot,
    deleteChatbot,
    refreshChatbots,
    generatePublicLink,
  };

  console.log('SupabaseNyloContext: Context value', { 
    user: !!user, 
    session: !!session, 
    chatbots: chatbots.length, 
    loading: authLoading || chatbotsLoading
  });

  return (
    <SupabaseNyloContext.Provider value={contextValue}>
      {children}
    </SupabaseNyloContext.Provider>
  );
}

export function useSupabaseNylo() {
  const context = useContext(SupabaseNyloContext);
  if (context === undefined) {
    throw new Error('useSupabaseNylo must be used within a SupabaseNyloProvider');
  }
  return context;
}
