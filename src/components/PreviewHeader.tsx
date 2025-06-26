
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Share, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Chatbot } from '@/types/chatbot';

interface PreviewHeaderProps {
  chatbot: Chatbot;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRestart: () => void;
  onGenerateLink: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  chatbot,
  isFullscreen,
  onToggleFullscreen,
  onRestart,
  onGenerateLink
}) => {
  const navigate = useNavigate();

  return (
    <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div>
              <h1 className="text-base md:text-lg font-semibold text-white truncate">Preview: {chatbot.name}</h1>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className="text-xs text-primary border-primary/30"
                >
                  Modo Teste
                </Badge>
                {isFullscreen && (
                  <Badge 
                    variant="outline" 
                    className="text-xs text-green-400 border-green-400/30"
                  >
                    Tela Cheia
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto overflow-x-auto">
            <Button 
              variant="outline" 
              onClick={onToggleFullscreen}
              className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3 md:w-4 md:h-4" /> : <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />}
              <span className="hidden sm:inline ml-2">{isFullscreen ? 'Sair' : 'Expandir'}</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onRestart}
              className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
            >
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline ml-2">Reiniciar</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/settings/${chatbot.id}`)}
              className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
            >
              <Settings className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline ml-2">Config</span>
            </Button>
            <Button 
              onClick={onGenerateLink}
              className="gradient-blue hover:opacity-90 nylo-shadow transition-all text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
            >
              <Share className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline ml-2">Compartilhar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
