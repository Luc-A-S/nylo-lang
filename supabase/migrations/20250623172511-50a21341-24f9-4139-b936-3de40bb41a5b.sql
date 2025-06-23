
-- Criar tabela para perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela para chatbots
CREATE TABLE public.chatbots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  nylo_code TEXT NOT NULL DEFAULT '',
  settings JSONB NOT NULL DEFAULT '{}',
  is_online BOOLEAN NOT NULL DEFAULT false,
  public_link TEXT UNIQUE,
  access_count INTEGER NOT NULL DEFAULT 0,
  today_access_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para conversas dos chatbots
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID REFERENCES public.chatbots ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas para chatbots
CREATE POLICY "Users can view their own chatbots" 
  ON public.chatbots 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chatbots" 
  ON public.chatbots 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbots" 
  ON public.chatbots 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbots" 
  ON public.chatbots 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para conversations
CREATE POLICY "Users can view conversations of their chatbots" 
  ON public.conversations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots 
      WHERE chatbots.id = conversations.chatbot_id 
      AND chatbots.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create conversations for public chatbots" 
  ON public.conversations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbots 
      WHERE chatbots.id = conversations.chatbot_id 
      AND chatbots.is_online = true
    )
  );

CREATE POLICY "Anyone can update conversations for public chatbots" 
  ON public.conversations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots 
      WHERE chatbots.id = conversations.chatbot_id 
      AND chatbots.is_online = true
    )
  );

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para gerar links públicos únicos
CREATE OR REPLACE FUNCTION public.generate_public_link()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  link_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Gerar um ID aleatório de 8 caracteres
    link_id := substr(md5(random()::text), 1, 8);
    
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM public.chatbots WHERE public_link = link_id) INTO exists_check;
    
    -- Se não existe, usar este ID
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN link_id;
END;
$$;

-- Trigger para gerar link público automaticamente
CREATE OR REPLACE FUNCTION public.handle_chatbot_public_link()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_online = true AND NEW.public_link IS NULL THEN
    NEW.public_link = public.generate_public_link();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_chatbot_public_link
  BEFORE INSERT OR UPDATE ON public.chatbots
  FOR EACH ROW EXECUTE PROCEDURE public.handle_chatbot_public_link();
