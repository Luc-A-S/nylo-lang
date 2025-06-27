
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot, Template } from '@/types/chatbot';
import { DEFAULT_NYLO_CODE, createDefaultSettings } from '@/utils/chatbotDefaults';

export const useChatbotOperations = (user: User | null, setChatbots: React.Dispatch<React.SetStateAction<Chatbot[]>>) => {
  const [isOperating, setIsOperating] = useState(false);

  const createChatbot = async (name: string, description?: string): Promise<Chatbot> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for createChatbot');
      throw new Error('User not authenticated');
    }

    if (isOperating) {
      throw new Error('Operation already in progress');
    }

    console.log('SupabaseNyloContext: Creating chatbot', { name, description, userId: user.id });
    setIsOperating(true);

    const defaultSettings = createDefaultSettings(name);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name,
          description,
          nylo_code: DEFAULT_NYLO_CODE,
          settings: defaultSettings as any,
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
    } finally {
      setIsOperating(false);
    }
  };

  const createChatbotFromTemplate = async (template: Template, name: string, description?: string): Promise<Chatbot> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for createChatbotFromTemplate');
      throw new Error('User not authenticated');
    }

    if (isOperating) {
      throw new Error('Operation already in progress');
    }

    console.log('SupabaseNyloContext: Creating chatbot from template', { template: template.id, name, description, userId: user.id });
    setIsOperating(true);

    const defaultSettings = createDefaultSettings(name);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name,
          description,
          nylo_code: template.sourceCode,
          settings: defaultSettings as any,
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
    } finally {
      setIsOperating(false);
    }
  };

  const updateChatbot = async (id: string, updates: Partial<Chatbot>): Promise<void> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for updateChatbot');
      throw new Error('User not authenticated');
    }

    if (isOperating) {
      throw new Error('Operation already in progress');
    }

    console.log('SupabaseNyloContext: Updating chatbot', { id, updates });
    setIsOperating(true);

    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.sourceCode !== undefined) updateData.nylo_code = updates.sourceCode;
    if (updates.isOnline !== undefined) updateData.is_online = updates.isOnline;
    if (updates.settings !== undefined) updateData.settings = updates.settings as any;

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('SupabaseNyloContext: Error updating chatbot:', error);
        toast.error('Erro ao atualizar chatbot: ' + error.message);
        throw error;
      }

      console.log('SupabaseNyloContext: Chatbot updated successfully', data);

      setChatbots(prev => prev.map(bot => {
        if (bot.id === id) {
          return {
            ...bot,
            ...updates,
            publicLink: data.public_link,
            lastUpdated: new Date(),
          };
        }
        return bot;
      }));

      toast.success('Chatbot atualizado com sucesso!');
    } catch (error) {
      console.error('SupabaseNyloContext: Update chatbot failed:', error);
      throw error;
    } finally {
      setIsOperating(false);
    }
  };

  const deleteChatbot = async (id: string): Promise<void> => {
    if (!user) {
      console.error('SupabaseNyloContext: User not authenticated for deleteChatbot');
      throw new Error('User not authenticated');
    }

    if (isOperating) {
      throw new Error('Operation already in progress');
    }

    console.log('SupabaseNyloContext: Deleting chatbot', { id, userId: user.id });
    setIsOperating(true);

    try {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('SupabaseNyloContext: Error deleting chatbot:', error);
        toast.error('Erro ao excluir chatbot: ' + error.message);
        throw error;
      }

      console.log('SupabaseNyloContext: Chatbot deleted successfully');

      setChatbots(prev => prev.filter(bot => bot.id !== id));
      toast.success('Chatbot excluído com sucesso!');
    } catch (error) {
      console.error('SupabaseNyloContext: Delete chatbot failed:', error);
      throw error;
    } finally {
      setIsOperating(false);
    }
  };

  return {
    createChatbot,
    createChatbotFromTemplate,
    updateChatbot,
    deleteChatbot,
    isOperating
  };
};
