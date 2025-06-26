
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot } from '@/types/chatbot';
import { transformSupabaseChatbot } from '@/utils/chatbotTransformers';

export const useChatbotData = (user: User | null, session: Session | null) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  const refreshChatbots = async () => {
    console.log('SupabaseNyloContext: refreshChatbots called', { 
      user: !!user, 
      session: !!session,
      userId: user?.id || session?.user?.id 
    });
    
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('SupabaseNyloContext: No user found, skipping chatbot refresh');
      setChatbots([]);
      return;
    }

    console.log('SupabaseNyloContext: Refreshing chatbots for user', currentUser.id);

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SupabaseNyloContext: Error fetching chatbots:', error);
        toast.error('Erro ao carregar chatbots: ' + error.message);
        return;
      }

      console.log('SupabaseNyloContext: Fetched chatbots:', data?.length || 0, data);

      const transformedChatbots: Chatbot[] = (data || []).map(transformSupabaseChatbot);

      setChatbots(transformedChatbots);
      console.log('SupabaseNyloContext: Chatbots set in state:', transformedChatbots.length);
    } catch (error) {
      console.error('SupabaseNyloContext: Error refreshing chatbots:', error);
      toast.error('Erro inesperado ao carregar chatbots');
    }
  };

  return {
    chatbots,
    setChatbots,
    refreshChatbots
  };
};
