
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Página não encontrada");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-blue/5 via-white to-nylo-cyan/5 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto gradient-blue rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🤖</span>
          </div>
          <div>
            <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-nylo-black mb-2">Página não encontrada</h2>
            <p className="text-nylo-gray-600 max-w-md mx-auto">
              Ops! A página que você está procurando não existe ou foi movida.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="gradient-blue hover:opacity-90 nylo-shadow"
          >
            Ir para Dashboard
          </Button>
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-nylo-blue hover:text-nylo-cyan hover:bg-nylo-blue/5"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
