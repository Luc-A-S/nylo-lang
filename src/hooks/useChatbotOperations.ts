
import { User } from '@supabase/supabase-js';
import { Chatbot } from '@/types/chatbot';
import { useCreateChatbotOperations } from './operations/createChatbotOperations';
import { useUpdateChatbotOperations } from './operations/updateChatbotOperations';
import { useDeleteChatbotOperations } from './operations/deleteChatbotOperations';

export const useChatbotOperations = (user: User | null, setChatbots: React.Dispatch<React.SetStateAction<Chatbot[]>>) => {
  const { createChatbot, createChatbotFromTemplate } = useCreateChatbotOperations(user, setChatbots);
  const { updateChatbot } = useUpdateChatbotOperations(user, setChatbots);
  const { deleteChatbot } = useDeleteChatbotOperations(user, setChatbots);

  return {
    createChatbot,
    createChatbotFromTemplate,
    updateChatbot,
    deleteChatbot
  };
};
