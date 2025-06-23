
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Zap, Users, Shield, Rocket } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-wave"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl animate-wave" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-wave" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse hidden md:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6 md:space-y-8 animate-fade-in">
          {/* Enhanced Logo e Header */}
          <div className="text-center space-y-4 md:space-y-6">
            <div className="relative">
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto gradient-blue rounded-3xl flex items-center justify-center nylo-glow animate-glow-pulse">
                <Bot className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold gradient-text animate-gradient-wave bg-gradient-to-r from-primary via-purple-500 to-primary bg-300% animate-gradient-wave">Nylo</h1>
              <p className="text-base md:text-lg text-gray-300 px-4">Crie chatbots intuitivos sem complicação</p>
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-primary">
                <Zap className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                <span>Powered by NyloLang</span>
              </div>
            </div>
          </div>

          {/* Card de Entrada */}
          <Card className="card-dark border-0 nylo-shadow hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] mx-2 md:mx-0">
            <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  Bem-vindo ao Nylo
                </h2>
                <p className="text-sm md:text-base text-gray-300">
                  Comece a criar chatbots inteligentes agora mesmo
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full h-10 md:h-12 gradient-blue hover:opacity-90 transition-all duration-300 nylo-shadow text-white font-medium hover:scale-[1.02] text-sm md:text-base"
                >
                  Começar Agora
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 text-center px-2 md:px-0">
            <div className="space-y-2 md:space-y-3 group">
              <div className="w-8 h-8 md:w-12 md:h-12 mx-auto glass-effect rounded-xl flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-all duration-300 group-hover:scale-110">
                <div className="w-4 h-4 md:w-6 md:h-6 gradient-blue rounded-lg"></div>
              </div>
              <p className="text-xs md:text-sm text-gray-300 font-medium group-hover:text-white transition-colors">Visual Builder</p>
            </div>
            <div className="space-y-2 md:space-y-3 group">
              <div className="w-8 h-8 md:w-12 md:h-12 mx-auto glass-effect rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300 group-hover:scale-110">
                <Bot className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
              </div>
              <p className="text-xs md:text-sm text-gray-300 font-medium group-hover:text-white transition-colors">NyloLang</p>
            </div>
            <div className="space-y-2 md:space-y-3 group">
              <div className="w-8 h-8 md:w-12 md:h-12 mx-auto glass-effect rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:border-blue-500/60 transition-all duration-300 group-hover:scale-110">
                <Zap className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
              </div>
              <p className="text-xs md:text-sm text-gray-300 font-medium group-hover:text-white transition-colors">Preview Live</p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-4 md:space-x-8 text-xs text-gray-400 pt-2 md:pt-4 px-2">
            <div className="flex items-center space-x-1 md:space-x-2">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              <span>Seguro</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
              <span className="hidden sm:inline">1000+ usuários</span>
              <span className="sm:hidden">1000+</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <Rocket className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              <span>Grátis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
