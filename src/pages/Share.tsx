
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNylo } from '@/contexts/NyloContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    <div className="min-h-screen bg-gradient-to-br from-ny

ilo-blue/5 via-white to-nylo-cyan/5">
      {/* Header */}
      <header className="border-b border-nylo-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-nylo-gray-600 hover:text-nylo-blue"
              >
                ← Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-nylo-black">Compartilhar: {chatbot.name}</h1>
                <p className="text-sm text-nylo-gray-600">Seu chatbot está pronto para ser compartilhado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Link Público */}
          <Card className="border-0 nylo-shadow">
            <CardHeader>
              <CardTitle className="gradient-text">Link Público</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-nylo-gray-700 mb-2 block">
                  URL do Chatbot
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={publicLink}
                    readOnly
                    className="border-nylo-gray-200 bg-nylo-gray-50"
                  />
                  <Button
                    onClick={() => copyToClipboard(publicLink)}
                    className="gradient-blue hover:opacity-90"
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={openInNewTab}
                  className="flex-1 border-nylo-gray-200"
                >
                  Abrir em Nova Guia
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/preview/${chatbot.id}`)}
                  className="flex-1 border-nylo-gray-200"
                >
                  Testar Preview
                </Button>
              </div>

              <div className="pt-4 border-t border-nylo-gray-200">
                <h4 className="font-medium text-nylo-black mb-2">Código de Incorporação</h4>
                <textarea
                  value={generateEmbedCode()}
                  readOnly
                  className="w-full h-32 p-3 text-xs border border-nylo-gray-200 rounded-lg bg-nylo-gray-50 font-mono"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(generateEmbedCode())}
                  className="mt-2 text-nylo-blue hover:text-nylo-cyan hover:bg-nylo-blue/5"
                >
                  Copiar Código HTML
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="border-0 nylo-shadow">
            <CardHeader>
              <CardTitle className="gradient-text">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg border border-nylo-gray-200">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code do Chatbot"
                    className="w-48 h-48"
                  />
                </div>
              </div>
              
              <p className="text-sm text-nylo-gray-600">
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
                className="border-nylo-gray-200"
              >
                Baixar QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <Card className="mt-8 border-0 nylo-shadow">
          <CardHeader>
            <CardTitle className="text-nylo-black">Estatísticas do Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-nylo-blue mb-1">0</div>
                <div className="text-sm text-nylo-gray-600">Conversas Iniciadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-nylo-cyan mb-1">0</div>
                <div className="text-sm text-nylo-gray-600">Mensagens Enviadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {chatbot.isOnline ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-nylo-gray-600">Status Atual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {new Date(chatbot.lastUpdated).toLocaleDateString()}
                </div>
                <div className="text-sm text-nylo-gray-600">Última Atualização</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dicas de Compartilhamento */}
        <Card className="mt-8 border-0 bg-gradient-to-r from-nylo-blue/5 to-nylo-cyan/5">
          <CardHeader>
            <CardTitle className="text-nylo-black">💡 Dicas de Compartilhamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-nylo-blue rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-nylo-gray-700">
                <strong>Redes Sociais:</strong> Compartilhe o link em suas redes sociais para alcançar mais clientes.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-nylo-cyan rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-nylo-gray-700">
                <strong>Site/Blog:</strong> Use o código de incorporação para adicionar o chat diretamente em seu site.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-nylo-gray-700">
                <strong>QR Code:</strong> Imprima o QR Code em materiais físicos como cartões de visita ou panfletos.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-nylo-gray-700">
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
