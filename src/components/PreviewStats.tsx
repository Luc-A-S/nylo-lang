
import React from 'react';
import { Card } from '@/components/ui/card';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  buttons?: { text: string; action: string }[];
  timestamp: Date;
}

interface PreviewStatsProps {
  messages: ChatMessage[];
  currentFlow: string;
}

export const PreviewStats: React.FC<PreviewStatsProps> = ({ messages, currentFlow }) => {
  return (
    <div className="mt-4 md:mt-6 grid grid-cols-3 gap-3 md:gap-4 text-center">
      <Card className="card-dark border-0 p-3 md:p-4">
        <p className="text-lg md:text-2xl font-bold text-primary">{messages.length}</p>
        <p className="text-xs md:text-sm text-gray-400">Mensagens</p>
      </Card>
      <Card className="card-dark border-0 p-3 md:p-4">
        <p className="text-lg md:text-2xl font-bold text-green-400">{messages.filter(m => !m.isBot).length}</p>
        <p className="text-xs md:text-sm text-gray-400">Respostas</p>
      </Card>
      <Card className="card-dark border-0 p-3 md:p-4">
        <p className="text-lg md:text-2xl font-bold text-blue-400 truncate">{currentFlow}</p>
        <p className="text-xs md:text-sm text-gray-400">Fluxo Atual</p>
      </Card>
    </div>
  );
};
