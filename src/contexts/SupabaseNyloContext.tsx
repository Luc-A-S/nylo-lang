
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Load chatbots when user logs in
        setTimeout(() => {
          refreshChatbots();
        }, 0);
      } else {
        // Clear chatbots when user logs out
        setChatbots([]);
      }
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        refreshChatbots();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshChatbots = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chatbots:', error);
        return;
      }

      const transformedChatbots: Chatbot[] = data.map(bot => ({
        id: bot.id,
        name: bot.name,
        description: bot.description,
        sourceCode: bot.nylo_code,
        isOnline: bot.is_online,
        publicLink: bot.public_link,
        accessCount: bot.access_count,
        todayAccessCount: bot.today_access_count,
        lastUpdated: new Date(bot.updated_at),
        createdAt: new Date(bot.created_at),
      }));

      setChatbots(transformedChatbots);
    } catch (error) {
      console.error('Error refreshing chatbots:', error);
    }
  };

  const createChatbot = async (name: string, description?: string): Promise<Chatbot> => {
    if (!user) throw new Error('User not authenticated');

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
      console.error('Error creating chatbot:', error);
      throw error;
    }

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
  };

  const createChatbotFromTemplate = async (template: Template, name: string, description?: string): Promise<Chatbot> => {
    if (!user) throw new Error('User not authenticated');

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
      console.error('Error creating chatbot from template:', error);
      throw error;
    }

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
  };

  const getChatbot = (id: string): Chatbot | null => {
    return chatbots.find(bot => bot.id === id) || null;
  };

  const updateChatbot = async (id: string, updates: Partial<Chatbot>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.sourceCode !== undefined) updateData.nylo_code = updates.sourceCode;
    if (updates.isOnline !== undefined) updateData.is_online = updates.isOnline;

    const { error } = await supabase
      .from('chatbots')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating chatbot:', error);
      throw error;
    }

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
  };

  const deleteChatbot = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting chatbot:', error);
      throw error;
    }

    setChatbots(prev => prev.filter(bot => bot.id !== id));
  };

  return (
    <SupabaseNyloContext.Provider value={{
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
    }}>
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
