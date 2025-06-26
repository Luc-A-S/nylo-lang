
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chatbot } from '@/types/chatbot';
import { transformSupabaseChatbot } from '@/utils/chatbotTransformers';

// Hook otimizado com cache e debounce
export const useOptimizedChatbotData = (user: User | null, session: Session | null) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<{ [key: string]: any }>({});

  // Debounce para evitar múltiplas chamadas
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);

  const refreshChatbots = useCallback(async (force = false) => {
    console.log('useOptimizedChatbotData: refreshChatbots called', { 
      user: !!user, 
      session: !!session,
      userId: user?.id || session?.user?.id,
      force 
    });
    
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('useOptimizedChatbotData: No user found, skipping chatbot refresh');
      setChatbots([]);
      return;
    }

    const cacheKey = `chatbots_${currentUser.id}`;
    
    // Verificar cache se não forçar refresh
    if (!force && cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 30000) {
      console.log('useOptimizedChatbotData: Using cached data');
      setChatbots(cache[cacheKey].data);
      return;
    }

    setLoading(true);
    console.log('useOptimizedChatbotData: Fetching chatbots from API');

    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useOptimizedChatbotData: Error fetching chatbots:', error);
        toast.error('Erro ao carregar chatbots: ' + error.message);
        return;
      }

      console.log('useOptimizedChatbotData: Fetched chatbots:', data?.length || 0);

      const transformedChatbots: Chatbot[] = (data || []).map(transformSupabaseChatbot);

      // Atualizar cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: transformedChatbots,
          timestamp: Date.now()
        }
      }));

      setChatbots(transformedChatbots);
      console.log('useOptimizedChatbotData: Chatbots set in state:', transformedChatbots.length);
    } catch (error) {
      console.error('useOptimizedChatbotData: Error refreshing chatbots:', error);
      toast.error('Erro inesperado ao carregar chatbots');
    } finally {
      setLoading(false);
    }
  }, [user, session, cache]);

  // Refresh com debounce
  const debouncedRefresh = useCallback((force = false) => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    const timeout = setTimeout(() => {
      refreshChatbots(force);
    }, 300);

    setRefreshTimeout(timeout);
  }, [refreshChatbots, refreshTimeout]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshTimeout]);

  // Memoizar retorno para evitar re-renders desnecessários
  const memoizedReturn = useMemo(() => ({
    chatbots,
    setChatbots,
    refreshChatbots: debouncedRefresh,
    loading
  }), [chatbots, setChatbots, debouncedRefresh, loading]);

  return memoizedReturn;
};
