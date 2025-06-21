
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, ExternalLink, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

const Share = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChatbot, generatePublicLink } = useNylo();
  const [chatbot] = useState(getChatbot(id || ''));
  const [publicLink, setPublicLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!chatbot) {
      navigate('/dashboard');
      return;
    }

    // Gera ou usa o link público existente
    const link = chatbot.publicLink || generatePublicLink(chatbot.id);
    setPublicLink(`https://${link}`);
    
    // Gera QR Code (usando API pública)
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://${link}`)}`;
    setQrCodeUrl(qrApi);
  }, [chatbot, generatePublicLink, navigate]);

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
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl floating-animation"></div>
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
                Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">Compartilhar: {chatbot.name}</h1>
                <p className="text-sm text-gray-400">Seu chatbot está pronto para ser compartilhado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Link Público */}
          <Card className="card-dark border-0 nylo-shadow">
            <CardHeader>
              <CardTitle className="gradient-text">Link Público</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  URL do Chatbot
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={publicLink}
                    readOnly
                    className="glass-effect border-white/20 text-white"
                  />
                  <Button
                    onClick={() => copyToClipboard(publicLink)}
                    className="gradient-blue hover:opacity-90"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={openInNewTab}
                  className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir em Nova Guia
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/preview/${chatbot.id}`)}
                  className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Testar Preview
                </Button>
              </div>

              <div className="pt-4 border-t border-white/20">
                <h4 className="font-medium text-white mb-2">Código de Incorporação</h4>
                <textarea
                  value={generateEmbedCode()}
                  readOnly
                  className="w-full h-32 p-3 text-xs glass-effect border-white/20 rounded-lg text-gray-300 font-mono"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(generateEmbedCode())}
                  className="mt-2 text-primary hover:text-primary-light hover:bg-primary/10"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar Código HTML
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="card-dark border-0 nylo-shadow">
            <CardHeader>
              <CardTitle className="gradient-text">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg border border-gray-600">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code do Chatbot"
                    className="w-48 h-48"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                Escaneie este código QR para acessar o chatbot diretamente no celular
              </p>

              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qr CodeUrl;
                  link.download = `qr-code-${chatbot.name}.png`;
                  link.click();
                }}
                variant="outline"
                className="glass-effect border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <Card className="mt-8 card-dark border-0 nylo-shadow">
          <CardHeader>
            <CardTitle className="text-white">Estatísticas do Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">0</div>
                <div className="text-sm text-gray-400">Conversas Iniciadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
                <div className="text-sm text-gray-400">Mensagens Enviadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {chatbot.isOnline ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-gray-400">Status Atual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {new Date(chatbot.lastUpdated).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">Última Atualização</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dicas de Compartilhamento */}
        <Card className="mt-8 card-dark border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-white">💡 Dicas de Compartilhamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
                <strong>Redes Sociais:</strong> Compartilhe o link em suas redes sociais para alcançar mais clientes.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
                <strong>Site/Blog:</strong> Use o código de incorporação para adicionar o chat diretamente em seu site.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
                <strong>QR Code:</strong> Imprima o QR Code em materiais físicos como cartões de visita ou panfletos.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
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
