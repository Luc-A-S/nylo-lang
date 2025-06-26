
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot, Template } from '@/types/chatbot';
import { DEFAULT_NYLO_CODE, createDefaultSettings } from '@/utils/chatbotDefaults';

export const useCreateChatbotOperations = (user: User | null, setChatbots: React.Dispatch<React.SetStateAction<Chatbot[]>>) => {
  const createChatbot = async (name: string, description?: string): Promise<Chatbot> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for createChatbot');
      throw new Error('User not authenticated');
    }

    console.log('SupabaseNyloContext: Creating chatbot', { name, description, userId: user.id });

    const defaultSettings = createDefaultSettings(name);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name,
          description,
          nylo_code: DEFAULT_NYLO_CODE,
          settings: defaultSettings as any, // Cast to any to satisfy Json type
          is_online: false,
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
        accessCount: data.access_count || 0,
        todayAccessCount: data.today_access_count || 0,
        lastUpdated: new Date(data.updated_at),
        createdAt: new Date(data.created_at),
        settings: defaultSettings,
      };

      setChatbots(prev => [newChatbot, ...prev]);
      toast.success('Chatbot criado com sucesso!');
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

    const defaultSettings = createDefaultSettings(name);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name,
          description,
          nylo_code: template.sourceCode,
          settings: defaultSettings as any, // Cast to any to satisfy Json type
          is_online: false,
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
        accessCount: data.access_count || 0,
        todayAccessCount: data.today_access_count || 0,
        lastUpdated: new Date(data.updated_at),
        createdAt: new Date(data.created_at),
        settings: defaultSettings,
      };

      setChatbots(prev => [newChatbot, ...prev]);
      toast.success('Chatbot criado com sucesso!');
      return newChatbot;
    } catch (error) {
      console.error('SupabaseNyloContext: Create chatbot from template failed:', error);
      throw error;
    }
  };

  return {
    createChatbot,
    createChatbotFromTemplate,
  };
};
