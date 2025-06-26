
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  buttons?: { text: string; action: string }[];
  timestamp: Date;
}

interface OptimizedChatMessageProps {
  message: ChatMessage;
  index: number;
  brandingColor?: string;
  onButtonClick: (action: string) => void;
}

// Componente memoizado para evitar re-renders desnecessários
export const OptimizedChatMessage = memo(({ 
  message, 
  index, 
  brandingColor = '#356CFF',
  onButtonClick 
}: OptimizedChatMessageProps) => {
  console.log('OptimizedChatMessage: Rendering message', message.id);

  return (
    <div
      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
          message.isBot
            ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg'
            : 'text-white shadow-lg'
        }`}
        style={!message.isBot ? {
          background: `linear-gradient(135deg, ${brandingColor}, ${brandingColor}dd)`
        } : {}}
      >
        <p className="text-xs md:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
        {message.buttons && (
          <div className="mt-2 md:mt-3 space-y-1 md:space-y-2">
            {message.buttons.map((button, buttonIndex) => (
              <Button
                key={`${message.id}-btn-${buttonIndex}`}
                size="sm"
                variant="outline"
                onClick={() => onButtonClick(button.action)}
                className="w-full text-left border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 text-xs md:text-sm h-8 md:h-auto"
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1 md:mt-2 opacity-70">
          {message.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
});

OptimizedChatMessage.displayName = 'OptimizedChatMessage';
