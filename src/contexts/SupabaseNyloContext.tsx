
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
    console.log('SupabaseNyloContext: getChatbot called', { id, chatbotsCount: chatbots.length });
    return chatbots.find(bot => bot.id === id) || null;
  }, [chatbots]);

  // Memoize the generatePublicLink function to create internal links
  const generatePublicLink = useCallback((id: string): string => {
    console.log('SupabaseNyloContext: generatePublicLink called', { id });
    return `/chat/${id}`;
  }, []);

  useEffect(() => {
    console.log('SupabaseNyloContext: Setting up auth state listener');
    
    let mounted = true;
    let isInitialized = false;

    const initializeAuth = async () => {
      try {
        console.log('SupabaseNyloContext: Starting auth initialization');
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SupabaseNyloContext: Error getting session:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;
        
        console.log('SupabaseNyloContext: Initial session check', { 
          session: !!session, 
          user: !!session?.user 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        isInitialized = true;
        
        // Defer chatbot refresh to avoid blocking auth
        if (session?.user) {
          console.log('SupabaseNyloContext: User found, deferring chatbots refresh');
          setTimeout(() => {
            if (mounted) {
              refreshChatbots().catch(error => {
                console.error('SupabaseNyloContext: Deferred chatbot refresh failed:', error);
              });
            }
          }, 100);
        }
      } catch (error) {
        console.error('SupabaseNyloContext: Error in auth initialization:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener FIRST - critical to avoid deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('SupabaseNyloContext: Auth state changed', { 
        event, 
        session: !!session, 
        user: !!session?.user,
        isInitialized 
      });
      
      // Only synchronous state updates here - NO async calls to prevent deadlock
      setSession(session);
      setUser(session?.user ?? null);
      
      // Defer any async operations to prevent auth loop
      if (isInitialized) {
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log('SupabaseNyloContext: User signed in, deferring chatbots refresh');
          setTimeout(() => {
            if (mounted) {
              refreshChatbots().catch(error => {
                console.error('SupabaseNyloContext: Deferred refresh failed:', error);
              });
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('SupabaseNyloContext: User signed out, clearing chatbots');
          setChatbots([]);
        }
        
        if (event !== 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      }
    });

    // THEN initialize auth
    initializeAuth();

    return () => {
      console.log('SupabaseNyloContext: Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent recreation

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
