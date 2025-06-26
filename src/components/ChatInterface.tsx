
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { Chatbot } from '@/types/chatbot';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  buttons?: { text: string; action: string }[];
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatbot: Chatbot;
  visibleMessages: ChatMessage[];
  hasMore: boolean;
  onLoadMore: () => void;
  onButtonClick: (action: string) => void;
  isWaitingForName: boolean;
  userInput: string;
  onUserInputChange: (value: string) => void;
  onSendMessage: () => void;
  isFullscreen: boolean;
  messagesLength: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatbot,
  visibleMessages,
  hasMore,
  onLoadMore,
  onButtonClick,
  isWaitingForName,
  userInput,
  onUserInputChange,
  onSendMessage,
  isFullscreen,
  messagesLength
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesLength]);

  return (
    <Card className={`card-dark border-0 nylo-shadow overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]' : 'h-[500px] md:h-[600px]'}`}>
      <ChatHeader chatbot={chatbot} />
      
      <ChatMessages
        visibleMessages={visibleMessages}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onButtonClick={onButtonClick}
        brandingColor={chatbot.settings?.brandingColor}
        isFullscreen={isFullscreen}
      />
      
      <div ref={messagesEndRef} />
      
      <ChatInput
        userInput={userInput}
        onUserInputChange={onUserInputChange}
        onSendMessage={onSendMessage}
        isWaitingForName={isWaitingForName}
        brandingColor={chatbot.settings?.brandingColor}
      />
    </Card>
  );
};
