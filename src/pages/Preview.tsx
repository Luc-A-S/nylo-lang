
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, incrementAccessCount } = useNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [messages, setMessages] = useState<Array<{text: string, isBot: boolean}>>([]);

  useEffect(() => {
    if (!chatbot) {
      navigate('/dashboard');
      return;
    }
    
    // Atualiza o chatbot para pegar o estado mais recente
    const updatedChatbot = getChatbot(id || '');
    setChatbot(updatedChatbot);
    
    // Se o chatbot está online, inicia a conversa
    if (updatedChatbot?.isOnline) {
      incrementAccessCount(chatbot.id);
      setMessages([{ text: 'Olá! Como posso ajudar você hoje?', isBot: true }]);
    }
  }, [chatbot?.isOnline, id, navigate, getChatbot, incrementAccessCount]);

  const sendMessage = (text: string) => {
    if (!chatbot?.isOnline) return;
    
    setMessages(prev => [...prev, { text, isBot: false }]);
    
    // Simula resposta do bot
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Obrigado pela sua mensagem! Este é um preview do chatbot.', 
        isBot: true 
      }]);
    }, 1000);
  };

  if (!chatbot) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl floating-animation"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <h1 className="text-lg font-semibold text-white">{chatbot.name} - Preview</h1>
                <p className="text-sm text-gray-400">
                  Status: 
                  <span className={chatbot.isOnline ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {chatbot.isOnline ? 'Online' : 'Offline'}
                  </span>
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate(`/editor/${chatbot.id}`)}
              className="gradient-blue hover:opacity-90"
            >
              Editar Chatbot
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <Card className="card-dark border-0 nylo-shadow h-[600px] flex flex-col">
          {chatbot.isOnline ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-blue rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{chatbot.settings.businessName}</h3>
                    <p className="text-xs text-green-400">● Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isBot
                          ? 'bg-white/10 text-white'
                          : 'gradient-blue text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 glass-effect border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        sendMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      const input = document.querySelector('input') as HTMLInputElement;
                      if (input?.value.trim()) {
                        sendMessage(input.value);
                        input.value = '';
                      }
                    }}
                    className="gradient-blue hover:opacity-90"
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Chatbot Offline State */
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chatbot Offline</h3>
              <p className="text-gray-400 mb-6 max-w-sm">
                Este chatbot está atualmente desativado. Para testá-lo, você precisa ativá-lo primeiro no editor.
              </p>
              <Button 
                onClick={() => navigate(`/editor/${chatbot.id}`)}
                className="gradient-blue hover:opacity-90"
              >
                Ir para o Editor
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Preview;
