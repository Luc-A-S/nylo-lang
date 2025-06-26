
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  userInput: string;
  onUserInputChange: (value: string) => void;
  onSendMessage: () => void;
  isWaitingForName: boolean;
  brandingColor?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  userInput,
  onUserInputChange,
  onSendMessage,
  isWaitingForName,
  brandingColor = '#356CFF',
  disabled = false
}) => {
  if (!isWaitingForName) {
    return null;
  }

  return (
    <div className="p-3 md:p-4 border-t border-white/10 bg-black/10">
      <div className="flex space-x-2">
        <Input
          value={userInput}
          onChange={(e) => onUserInputChange(e.target.value)}
          placeholder="Digite seu nome..."
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          className="glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary transition-all duration-300 text-sm md:text-base"
          disabled={disabled}
        />
        <Button
          onClick={onSendMessage}
          disabled={!userInput.trim() || disabled}
          className="transition-all duration-300 hover:scale-105 text-sm md:text-base px-3 md:px-4"
          style={{ 
            background: `linear-gradient(135deg, ${brandingColor}, ${brandingColor}dd)` 
          }}
        >
          Enviar
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Pressione Enter para enviar
      </p>
    </div>
  );
};
