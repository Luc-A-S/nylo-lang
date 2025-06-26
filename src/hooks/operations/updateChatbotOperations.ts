
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot } from '@/types/chatbot';

export const useUpdateChatbotOperations = (user: User | null, setChatbots: React.Dispatch<React.SetStateAction<Chatbot[]>>) => {
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
    if (updates.settings !== undefined) updateData.settings = updates.settings as any; // Cast to any to satisfy Json type

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
            publicLink: data.public_link, // Update with the latest public link from DB
            lastUpdated: new Date(),
          };
        }
        return bot;
      }));

      toast.success('Chatbot atualizado com sucesso!');
    } catch (error) {
      console.error('SupabaseNyloContext: Update chatbot failed:', error);
      throw error;
    }
  };

  return {
    updateChatbot,
  };
};
