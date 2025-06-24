
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Chatbot {
  id: string;
  name: string;
  description?: string;
  sourceCode: string;
  isOnline: boolean;
  publicLink?: string;
  accessCount: number;
  todayAccessCount: number;
  lastUpdated: Date;
  createdAt: Date;
}

interface Template {
  id: string;
  name: string;
  description: string;
  sourceCode: string;
}

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
}

const SupabaseNyloContext = createContext<SupabaseNyloContextType | undefined>(undefined);

export function SupabaseNyloProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SupabaseNyloContext: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('SupabaseNyloContext: Auth state changed', { event, session: !!session, user: !!session?.user });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        console.log('SupabaseNyloContext: User signed in, refreshing chatbots');
        // Load chatbots when user logs in
        setTimeout(() => {
          refreshChatbots();
        }, 100);
      } else if (event === 'SIGNED_OUT') {
        console.log('SupabaseNyloContext: User signed out, clearing chatbots');
        // Clear chatbots when user logs out
        setChatbots([]);
      }
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('SupabaseNyloContext: Initial session check', { session: !!session, user: !!session?.user });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('SupabaseNyloContext: Initial session found, refreshing chatbots');
        setTimeout(() => {
          refreshChatbots();
        }, 100);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshChatbots = async () => {
    console.log('SupabaseNyloContext: refreshChatbots called', { user: !!user });
    
    if (!user) {
      console.log('SupabaseNyloContext: No user found, skipping chatbot refresh');
      return;
    }

    console.log('SupabaseNyloContext: Refreshing chatbots for user', user.id);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('user_id', user.id)  // Add user filter
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SupabaseNyloContext: Error fetching chatbots:', error);
        toast.error('Erro ao carregar chatbots: ' + error.message);
        return;
      }

      console.log('SupabaseNyloContext: Fetched chatbots:', data?.length || 0, data);

      const transformedChatbots: Chatbot[] = (data || []).map(bot => ({
        id: bot.id,
        name: bot.name,
        description: bot.description,
        sourceCode: bot.nylo_code,
        isOnline: bot.is_online,
        publicLink: bot.public_link,
        accessCount: bot.access_count || 0,
        todayAccessCount: bot.today_access_count || 0,
        lastUpdated: new Date(bot.updated_at),
        createdAt: new Date(bot.created_at),
      }));

      setChatbots(transformedChatbots);
      console.log('SupabaseNyloContext: Chatbots set in state:', transformedChatbots.length);
    } catch (error) {
      console.error('SupabaseNyloContext: Error refreshing chatbots:', error);
      toast.error('Erro inesperado ao carregar chatbots');
    }
  };

  const createChatbot = async (name: string, description?: string): Promise<Chatbot> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for createChatbot');
      throw new Error('User not authenticated');
    }

    console.log('SupabaseNyloContext: Creating chatbot', { name, description, userId: user.id });

    const defaultSourceCode = `inicio:
  mensagem:
    "Olá! Como posso ajudar você hoje?"
    botao 1:
      "Sobre nós" -> sobre
    botao 2:
      "Suporte" -> suporte

fluxo sobre:
  mensagem:
    "Somos uma empresa inovadora!"

fluxo suporte:
  mensagem:
    "Como podemos ajudar?"

fim`;

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name,
          description,
          nylo_code: defaultSourceCode,
        })
        .select()
        .single();

      if (error) {
        console.error('SupabaseNyloContext: Error creating chatbot:', error);
        toast.error('Erro ao criar chatbot: ' + error.message);
        throw error;
      }

      console.log('SupabaseNyloContext: Chatbot created successfully', data);

      const newChatbot: Chatbot = {
        id: data.id,
        name: data.name,
        description: data.description,
        sourceCode: data.nylo_code,
        isOnline: data.is_online,
        publicLink: data.public_link,
        accessCount: data.access_count,
        todayAccessCount: data.today_access_count,
        lastUpdated: new Date(data.updated_at),
        createdAt: new Date(data.created_at),
      };

      setChatbots(prev => [newChatbot, ...prev]);
      return newChatbot;
    } catch (error) {
      console.error('SupabaseNyloContext: Create chatbot failed:', error);
      throw error;
    }
  };

  const createChatbotFromTemplate = async (template: Template, name: string, description?: string): Promise<Chatbot> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for createChatbotFromTemplate');
      throw new Error('User not authenticated');
    }

    console.log('SupabaseNyloContext: Creating chatbot from template', { template: template.id, name, description, userId: user.id });

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name,
          description,
          nylo_code: template.sourceCode,
        })
        .select()
        .single();

      if (error) {
        console.error('SupabaseNyloContext: Error creating chatbot from template:', error);
        toast.error('Erro ao criar chatbot do template: ' + error.message);
        throw error;
      }

      console.log('SupabaseNyloContext: Chatbot created from template successfully', data);

      const newChatbot: Chatbot = {
        id: data.id,
        name: data.name,
        description: data.description,
        sourceCode: data.nylo_code,
        isOnline: data.is_online,
        publicLink: data.public_link,
        accessCount: data.access_count,
        todayAccessCount: data.today_access_count,
        lastUpdated: new Date(data.updated_at),
        createdAt: new Date(data.created_at),
      };

      setChatbots(prev => [newChatbot, ...prev]);
      return newChatbot;
    } catch (error) {
      console.error('SupabaseNyloContext: Create chatbot from template failed:', error);
      throw error;
    }
  };

  const getChatbot = (id: string): Chatbot | null => {
    return chatbots.find(bot => bot.id === id) || null;
  };

  const updateChatbot = async (id: string, updates: Partial<Chatbot>): Promise<void> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for updateChatbot');
      throw new Error('User not authenticated');
    }

    console.log('SupabaseNyloContext: Updating chatbot', { id, updates });

    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.sourceCode !== undefined) updateData.nylo_code = updates.sourceCode;
    if (updates.isOnline !== undefined) updateData.is_online = updates.isOnline;

    try {
      const { error } = await supabase
        .from('chatbots')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only update their own chatbots

      if (error) {
        console.error('SupabaseNyloContext: Error updating chatbot:', error);
        toast.error('Erro ao atualizar chatbot: ' + error.message);
        throw error;
      }

      console.log('SupabaseNyloContext: Chatbot updated successfully');

      setChatbots(prev => prev.map(bot => {
        if (bot.id === id) {
          return {
            ...bot,
            ...updates,
            lastUpdated: new Date(),
          };
        }
        return bot;
      }));
    } catch (error) {
      console.error('SupabaseNyloContext: Update chatbot failed:', error);
      throw error;
    }
  };

  const deleteChatbot = async (id: string): Promise<void> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for deleteChatbot');
      throw new Error('User not authenticated');
    }

    console.log('SupabaseNyloContext: Deleting chatbot', { id, userId: user.id });

    try {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own chatbots

      if (error) {
        console.error('SupabaseNyloContext: Error deleting chatbot:', error);
        toast.error('Erro ao excluir chatbot: ' + error.message);
        throw error;
      }

      console.log('SupabaseNyloContext: Chatbot deleted successfully');

      setChatbots(prev => prev.filter(bot => bot.id !== id));
    } catch (error) {
      console.error('SupabaseNyloContext: Delete chatbot failed:', error);
      throw error;
    }
  };

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
