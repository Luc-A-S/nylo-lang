
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Chatbot, Template } from '@/types/chatbot';
import { useChatbotData } from '@/hooks/useChatbotData';
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
  refreshChatbots: () => Promise<void>;
  generatePublicLink: (id: string) => string;
}

const SupabaseNyloContext = createContext<SupabaseNyloContextType | undefined>(undefined);

export function SupabaseNyloProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const { chatbots, setChatbots, refreshChatbots } = useChatbotData(user, session);
  const { createChatbot, createChatbotFromTemplate, updateChatbot, deleteChatbot } = useChatbotOperations(user, setChatbots);

  // Memoize the getChatbot function to prevent unnecessary re-renders
  const getChatbot = useCallback((id: string): Chatbot | null => {
    return chatbots.find(bot => bot.id === id) || null;
  }, [chatbots]);

  // Memoize the generatePublicLink function
  const generatePublicLink = useCallback((id: string): string => {
    const chatbot = getChatbot(id);
    if (!chatbot || !chatbot.publicLink) return '';
    return chatbot.publicLink;
  }, [getChatbot]);

  useEffect(() => {
    console.log('SupabaseNyloContext: Setting up auth state listener');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('SupabaseNyloContext: Initial session check', { 
          session: !!session, 
          user: !!session?.user 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('SupabaseNyloContext: Initial session found, refreshing chatbots');
          await refreshChatbots();
        }
      } catch (error) {
        console.error('SupabaseNyloContext: Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('SupabaseNyloContext: Auth state changed', { 
        event, 
        session: !!session, 
        user: !!session?.user 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log('SupabaseNyloContext: User signed in, refreshing chatbots');
        try {
          await refreshChatbots();
        } catch (error) {
          console.error('SupabaseNyloContext: Error refreshing chatbots:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('SupabaseNyloContext: User signed out, clearing chatbots');
        setChatbots([]);
      }
      
      if (event !== 'TOKEN_REFRESHED') {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to prevent loops

  const contextValue = {
    user,
    session,
    chatbots,
    loading,
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
    loading 
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
