
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseNylo();
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect authenticated users immediately
  useEffect(() => {
    console.log('Auth: Effect triggered', { user: !!user, loading });
    if (!loading && user) {
      console.log('Auth: User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    console.log('Auth: Starting login process');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Auth: Login error:', error);
        toast.error(error.message || 'Erro ao fazer login');
      } else {
        console.log('Auth: Login successful', { user: !!data.user });
        toast.success('Login realizado com sucesso!');
        // Navigation will be handled by useEffect when user state updates
      }
    } catch (error) {
      console.error('Auth: Login exception:', error);
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    console.log('Auth: Starting registration process');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Auth: Register error:', error);
        toast.error(error.message || 'Erro ao criar conta');
      } else {
        console.log('Auth: Registration successful', { user: !!data.user });
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
        // Navigation will be handled by useEffect when user state updates
      }
    } catch (error) {
      console.error('Auth: Register exception:', error);
      toast.error('Erro inesperado ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render auth form if user is already logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card overflow-hidden">
      {/* Background Effects */}
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
          {/* Logo e Header */}
          <div className="text-center space-y-4 md:space-y-6">
            <div className="relative">
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto gradient-blue rounded-3xl flex items-center justify-center nylo-glow animate-glow-pulse">
                <Bot className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold gradient-text animate-gradient-wave bg-gradient-to-r from-primary via-purple-500 to-primary bg-300% animate-gradient-wave">Nylo</h1>
              <p className="text-base md:text-lg text-gray-300 px-4">Crie chatbots intuitivos sem complicação</p>
            </div>
          </div>

          {/* Card de Login/Cadastro */}
          <Card className="card-dark border-0 nylo-shadow hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] mx-2 md:mx-0">
            <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
              {/* Header do formulário */}
              <div className="flex items-center justify-center">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {currentView === 'login' ? 'Entrar' : 'Criar Conta'}
                </h2>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="space-y-3">
                  {currentView === 'register' && (
                    <Input 
                      type="text" 
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-10 md:h-12 glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:border-white/30 text-sm md:text-base"
                    />
                  )}
                  <Input 
                    type="email" 
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-10 md:h-12 glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:border-white/30 text-sm md:text-base"
                  />
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-10 md:h-12 glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:border-white/30 pr-10 text-sm md:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {currentView === 'register' && (
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="h-10 md:h-12 glass-effect border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:border-white/30 pr-10 text-sm md:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                  <Button 
                    onClick={currentView === 'login' ? handleEmailLogin : handleEmailRegister}
                    disabled={isLoading}
                    className="w-full h-10 md:h-12 gradient-blue hover:opacity-90 transition-all duration-300 nylo-shadow text-white font-medium hover:scale-[1.02] text-sm md:text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {currentView === 'login' ? 'Entrando...' : 'Criando conta...'}
                      </div>
                    ) : (
                      <span>
                        <span className="hidden sm:inline">{currentView === 'login' ? 'Entrar com Email' : 'Criar Conta'}</span>
                        <span className="sm:hidden">{currentView === 'login' ? 'Entrar' : 'Cadastrar'}</span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-400">
                  {currentView === 'login' ? (
                    <>
                      Não tem conta?{' '}
                      <span 
                        className="text-primary cursor-pointer hover:underline font-medium transition-colors"
                        onClick={() => setCurrentView('register')}
                      >
                        Criar gratuitamente
                      </span>
                    </>
                  ) : (
                    <>
                      Já tem conta?{' '}
                      <span 
                        className="text-primary cursor-pointer hover:underline font-medium transition-colors"
                        onClick={() => setCurrentView('login')}
                      >
                        Fazer login
                      </span>
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
