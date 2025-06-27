
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseNylo } from '@/contexts/SupabaseNyloContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized } = useSupabaseNylo();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute: Effect triggered', { 
      user: !!user, 
      loading, 
      initialized 
    });
    
    // Only redirect if fully initialized and no user
    if (initialized && !loading && !user) {
      console.log('ProtectedRoute: No user found, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, initialized, navigate]);

  // Show loading while auth is being determined
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Show loading if no user but not yet redirected
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nylo-dark via-nylo-darker to-nylo-card flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
