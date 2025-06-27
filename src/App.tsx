
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseNyloProvider } from "./contexts/SupabaseNyloContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import Share from "./pages/Share";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupabaseNyloProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/editor/:id?" element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            } />
            <Route path="/preview/:id" element={
              <ProtectedRoute>
                <Preview />
              </ProtectedRoute>
            } />
            <Route path="/settings/:id" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/share/:id" element={
              <ProtectedRoute>
                <Share />
              </ProtectedRoute>
            } />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SupabaseNyloProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
