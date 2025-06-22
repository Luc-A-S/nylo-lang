
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Bot } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Página não encontrada");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '-3s'}}></div>
      </div>

      <div className="text-center space-y-4 md:space-y-6 relative z-10 max-w-md mx-auto">
        <div className="space-y-3 md:space-y-4">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto gradient-blue rounded-2xl flex items-center justify-center nylo-glow">
            <Bot className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-3 md:mb-4">404</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Página não encontrada</h2>
            <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto px-4">
              Ops! A página que você está procurando não existe ou foi movida.
            </p>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="gradient-blue hover:opacity-90 nylo-shadow w-full sm:w-auto px-6 py-3 text-sm md:text-base"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
