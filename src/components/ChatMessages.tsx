
import React from 'react';
import { Button } from '@/components/ui/button';
import { OptimizedChatMessage } from '@/components/OptimizedChatMessage';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  buttons?: { text: string; action: string }[];
  timestamp: Date;
}

interface ChatMessagesProps {
  visibleMessages: ChatMessage[];
  hasMore: boolean;
  onLoadMore: () => void;
  onButtonClick: (action: string) => void;
  brandingColor?: string;
  isFullscreen: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  visibleMessages,
  hasMore,
  onLoadMore,
  onButtonClick,
  brandingColor,
  isFullscreen
}) => {
  return (
    <div 
      className={`flex-1 p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto scroll-smooth ${isFullscreen ? 'h-[calc(100vh-240px)] md:h-[calc(100vh-300px)]' : 'h-[380px] md:h-[480px]'}`}
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: `${brandingColor || '#356CFF'}30 transparent`
      }}
    >
      {hasMore && (
        <Button
          variant="ghost"
          onClick={onLoadMore}
          className="w-full text-gray-400 hover:text-white"
        >
          Carregar mensagens anteriores
        </Button>
      )}
      {visibleMessages.map((message, index) => (
        <OptimizedChatMessage
          key={message.id}
          message={message}
          index={index}
          brandingColor={brandingColor}
          onButtonClick={onButtonClick}
        />
      ))}
    </div>
  );
};
