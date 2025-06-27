
import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot } from '@/types/chatbot';
import { transformSupabaseChatbot } from '@/utils/chatbotTransformers';

export const useChatbotData = (user: User | null, session: Session | null) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  const refreshChatbots = useCallback(async () => {
    const currentUser = user || session?.user;
    
    console.log('useChatbotData: refreshChatbots called', { 
      user: !!user, 
      session: !!session,
      userId: currentUser?.id 
    });
    
    if (!currentUser) {
      console.log('useChatbotData: No user found, clearing chatbots');
      setChatbots([]);
      return;
    }

    console.log('useChatbotData: Refreshing chatbots for user', currentUser.id);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useChatbotData: Error fetching chatbots:', error);
        toast.error('Erro ao carregar chatbots: ' + error.message);
        return;
      }

      console.log('useChatbotData: Fetched chatbots:', data?.length || 0, data);

      const transformedChatbots: Chatbot[] = (data || []).map(transformSupabaseChatbot);

      setChatbots(transformedChatbots);
      console.log('useChatbotData: Chatbots set in state:', transformedChatbots.length);
    } catch (error) {
      console.error('useChatbotData: Error refreshing chatbots:', error);
      toast.error('Erro inesperado ao carregar chatbots');
    }
  }, [user?.id, session?.user?.id]);

  return {
    chatbots,
    setChatbots,
    refreshChatbots
  };
};
