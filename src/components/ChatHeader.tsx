
import React from 'react';
import { Bot } from 'lucide-react';
import { Chatbot } from '@/types/chatbot';

interface ChatHeaderProps {
  chatbot: Chatbot;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chatbot }) => {
  return (
    <div 
      className="p-3 md:p-4 text-white transition-colors duration-300"
      style={{ background: `linear-gradient(135deg, ${chatbot.settings?.brandingColor || '#356CFF'}, ${chatbot.settings?.brandingColor || '#356CFF'}dd)` }}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <Bot className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm md:text-base truncate">{chatbot.settings?.businessName || chatbot.name}</h3>
          <div className="flex items-center space-x-2 text-xs md:text-sm text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="truncate">Online • Respondendo em segundos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
