
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot } from '@/types/chatbot';

export const useDeleteChatbotOperations = (user: User | null, setChatbots: React.Dispatch<React.SetStateAction<Chatbot[]>>) => {
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
    }
  };

  return {
    deleteChatbot,
  };
};
