
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, Zap, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleEmailLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '-3s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Header */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto gradient-blue rounded-3xl flex items-center justify-center nylo-glow pulse-glow">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-bold gradient-text">Nylo</h1>
              <p className="text-lg text-gray-300">Crie chatbots intuitivos sem complicação</p>
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <Zap className="w-4 h-4" />
                <span>Powered by NyloLang</span>
              </div>
            </div>
          </div>

          {/* Card de Login */}
          <Card className="card-dark border-0 nylo-shadow">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12 glass-effect text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-nylo-card text-gray-400">ou</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input 
                    type="email" 
                    placeholder="seu@email.com"
                    className="h-12 glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20"
                  />
                  <Button 
                    onClick={handleEmailLogin}
                    disabled={isLoading}
                    className="w-full h-12 gradient-blue hover:opacity-90 transition-all duration-300 nylo-shadow text-white font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Entrando...
                      </div>
                    ) : (
                      'Entrar com Email'
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-400">
                  Não tem conta? <span className="text-primary cursor-pointer hover:underline font-medium">Criar gratuitamente</span>
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/learn')}
                  className="text-primary hover:text-primary-light hover:bg-primary/10 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Primeiro acesso? Aprenda Nylo →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 text-center animate-fade-in">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto glass-effect rounded-xl flex items-center justify-center border border-primary/30">
                <div className="w-6 h-6 gradient-blue rounded-lg"></div>
              </div>
              <p className="text-sm text-gray-300 font-medium">Visual Builder</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto glass-effect rounded-xl flex items-center justify-center border border-purple-500/30">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-gray-300 font-medium">NyloLang</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto glass-effect rounded-xl flex items-center justify-center border border-blue-500/30">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm text-gray-300 font-medium">Preview Live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
