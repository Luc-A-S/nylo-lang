
import { useState, useEffect, useMemo } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  buttons?: { text: string; action: string }[];
  timestamp: Date;
}

// Hook para virtualização de mensagens grandes
export const useVirtualizedMessages = (
  messages: ChatMessage[], 
  maxVisibleMessages = 50
) => {
  const [startIndex, setStartIndex] = useState(0);

  // Calcular mensagens visíveis
  const visibleMessages = useMemo(() => {
    const endIndex = Math.min(startIndex + maxVisibleMessages, messages.length);
    return messages.slice(startIndex, endIndex);
  }, [messages, startIndex, maxVisibleMessages]);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    if (messages.length > maxVisibleMessages) {
      const newStartIndex = Math.max(0, messages.length - maxVisibleMessages);
      setStartIndex(newStartIndex);
    }
  }, [messages.length, maxVisibleMessages]);

  return {
    visibleMessages,
    totalMessages: messages.length,
    hasMore: messages.length > maxVisibleMessages,
    loadMore: () => {
      setStartIndex(Math.max(0, startIndex - 20));
    }
  };
};
