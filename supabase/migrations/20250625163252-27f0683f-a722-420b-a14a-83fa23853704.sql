
-- Primeiro, vamos garantir que as políticas RLS existam e funcionem corretamente
-- Remover políticas existentes se houver conflito
DROP POLICY IF EXISTS "Users can view their own chatbots" ON public.chatbots;
DROP POLICY IF EXISTS "Users can create their own chatbots" ON public.chatbots;
DROP POLICY IF EXISTS "Users can update their own chatbots" ON public.chatbots;
DROP POLICY IF EXISTS "Users can delete their own chatbots" ON public.chatbots;

-- Recriar as políticas com nomes mais claros
CREATE POLICY "Enable read access for users based on user_id" ON public.chatbots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON public.chatbots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.chatbots
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.chatbots
    FOR DELETE USING (auth.uid() = user_id);

-- Garantir que RLS está habilitado
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;

-- Melhorar a função de geração de link público
CREATE OR REPLACE FUNCTION public.generate_public_link()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  link_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Gerar um ID mais legível (letras e números)
    link_id := substr(md5(random()::text || clock_timestamp()::text), 1, 12);
    
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

-- Atualizar o trigger para gerar links públicos
DROP TRIGGER IF EXISTS on_chatbot_public_link ON public.chatbots;

CREATE OR REPLACE FUNCTION public.handle_chatbot_public_link()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Sempre gerar um link público ao criar um chatbot
  IF TG_OP = 'INSERT' AND NEW.public_link IS NULL THEN
    NEW.public_link = public.generate_public_link();
  END IF;
  
  -- Se o chatbot ficar online e não tiver link, gerar um
  IF TG_OP = 'UPDATE' AND NEW.is_online = true AND NEW.public_link IS NULL THEN
    NEW.public_link = public.generate_public_link();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_chatbot_public_link
  BEFORE INSERT OR UPDATE ON public.chatbots
  FOR EACH ROW EXECUTE PROCEDURE public.handle_chatbot_public_link();
