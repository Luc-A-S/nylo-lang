
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
  initialized: boolean;
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
  const [initialized, setInitialized] = useState(false);

  const { chatbots, setChatbots, refreshChatbots } = useChatbotData(user, session);
  const { createChatbot, createChatbotFromTemplate, updateChatbot, deleteChatbot } = useChatbotOperations(user, setChatbots);

  // Memoize functions to prevent unnecessary re-renders
  const getChatbot = useCallback((id: string): Chatbot | null => {
    console.log('SupabaseNyloContext: getChatbot called', { id, chatbotsCount: chatbots.length });
    return chatbots.find(bot => bot.id === id) || null;
  }, [chatbots]);

  const generatePublicLink = useCallback((id: string): string => {
    console.log('SupabaseNyloContext: generatePublicLink called', { id });
    return `/chat/${id}`;
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    console.log('SupabaseNyloContext: Initializing auth state');

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SupabaseNyloContext: Error getting initial session:', error);
        }
        
        if (mounted) {
          console.log('SupabaseNyloContext: Setting initial session', { hasSession: !!session });
          setSession(session);
          setUser(session?.user ?? null);
          setInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('SupabaseNyloContext: Error in auth initialization:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('SupabaseNyloContext: Auth state changed', { event, hasSession: !!session });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (initialized) {
        setLoading(false);
      }
    });

    // Initialize
    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove all dependencies to prevent recreation

  // Load chatbots when user changes
  useEffect(() => {
    if (initialized && user && chatbots.length === 0) {
      console.log('SupabaseNyloContext: Loading chatbots for authenticated user');
      refreshChatbots().catch(error => {
        console.error('SupabaseNyloContext: Failed to load chatbots:', error);
      });
    }
  }, [user, initialized, chatbots.length, refreshChatbots]);

  const contextValue = {
    user,
    session,
    chatbots,
    loading,
    initialized,
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
    loading,
    initialized
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
