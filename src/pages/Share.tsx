import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Download, Eye, BarChart3, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Share = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot } = useSupabaseNylo();
  const [chatbot, setChatbot] = useState(getChatbot(id || ''));
  const [publicLink, setPublicLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const foundChatbot = getChatbot(id);
    if (!foundChatbot) {
      navigate('/dashboard');
      return;
    }

    setChatbot(foundChatbot);

    // Create internal link
    const internalUrl = `${window.location.origin}/chat/${foundChatbot.id}`;
    setPublicLink(internalUrl);
    
    // Generate QR Code
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(internalUrl)}`;
    setQrCodeUrl(qrApi);
  }, [id, getChatbot, navigate]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  const openInNewTab = () => {
    window.open(publicLink, '_blank');
  };

  const generateEmbedCode = () => {
    return `<iframe 
  src="${publicLink}" 
  width="400" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</iframe>`;
  };

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl floating-animation"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div>
                <h1 className="text-base md:text-lg font-semibold text-white truncate max-w-48 sm:max-w-none">
                  Compartilhar: {chatbot.name}
                </h1>
                <p className="text-xs md:text-sm text-gray-400">Seu chatbot está pronto para ser compartilhado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl relative z-10">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="card-dark border-0 nylo-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-white mb-1">{chatbot.accessCount || 0}</div>
              <div className="text-xs text-gray-400">Total de Acessos</div>
            </CardContent>
          </Card>
          
          <Card className="card-dark border-0 nylo-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-blue-400 mb-1">{chatbot.todayAccessCount || 0}</div>
              <div className="text-xs text-gray-400">Acessos Hoje</div>
            </CardContent>
          </Card>
          
          <Card className="card-dark border-0 nylo-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-green-400 mb-1">0</div>
              <div className="text-xs text-gray-400">
                <span className="hidden sm:inline">Visitantes Únicos</span>
                <span className="sm:hidden">Únicos</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dark border-0 nylo-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`w-3 h-3 rounded-full ${chatbot.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              </div>
              <div className={`text-lg md:text-2xl font-bold mb-1 ${chatbot.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                {chatbot.isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="text-xs text-gray-400">Status Atual</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Link Público */}
          <Card className="card-dark border-0 nylo-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="gradient-text text-lg md:text-xl">Link Público</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  URL do Chatbot
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    value={publicLink}
                    readOnly
                    className="glass-effect border-white/20 text-white text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(publicLink)}
                    className="gradient-blue hover:opacity-90 px-4 whitespace-nowrap"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Copiar</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={openInNewTab}
                  className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Abrir Chatbot</span>
                  <span className="sm:hidden">Abrir</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/preview/${chatbot.id}`)}
                  className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Testar Preview</span>
                  <span className="sm:hidden">Preview</span>
                </Button>
              </div>

              <div className="pt-4 border-t border-white/20">
                <h4 className="font-medium text-white mb-2 text-sm md:text-base">Código de Incorporação</h4>
                <textarea
                  value={generateEmbedCode()}
                  readOnly
                  className="w-full h-24 md:h-32 p-3 text-xs glass-effect border-white/20 rounded-lg text-gray-300 font-mono"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(generateEmbedCode())}
                  className="mt-2 text-primary hover:text-primary-light hover:bg-primary/10 text-xs md:text-sm"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar Código HTML
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="card-dark border-0 nylo-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="gradient-text text-lg md:text-xl">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-600">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code do Chatbot"
                    className="w-32 h-32 md:w-48 md:h-48"
                  />
                </div>
              </div>
              
              <p className="text-xs md:text-sm text-gray-400 px-2">
                Escaneie este código QR para acessar o chatbot diretamente no celular
              </p>

              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrCodeUrl;
                  link.download = `qr-code-${chatbot.name}.png`;
                  link.click();
                }}
                variant="outline"
                className="glass-effect border-white/20 text-white hover:bg-white/10 text-sm"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dicas de Compartilhamento */}
        <Card className="mt-6 md:mt-8 card-dark border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-white text-lg md:text-xl">💡 Dicas de Compartilhamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs md:text-sm text-gray-300">
                <strong>Redes Sociais:</strong> Compartilhe o link em suas redes sociais para alcançar mais clientes.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs md:text-sm text-gray-300">
                <strong>Site/Blog:</strong> Use o código de incorporação para adicionar o chat diretamente em seu site.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs md:text-sm text-gray-300">
                <strong>QR Code:</strong> Imprima o QR Code em materiais físicos como cartões de visita ou panfletos.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs md:text-sm text-gray-300">
                <strong>WhatsApp:</strong> Envie o link diretamente para seus contatos via WhatsApp.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Share;
