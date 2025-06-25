
-- Check if RLS is enabled and add missing policies only

-- Enable RLS on conversations table (chatbots already has it)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Only create policies that don't exist yet
-- For conversations table
DO $$
BEGIN
    -- Policy for viewing conversations of user's chatbots
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Users can view conversations of their chatbots'
    ) THEN
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
    END IF;

    -- Policy for creating conversations (public chatbots)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Anyone can create conversations for public chatbots'
    ) THEN
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
    END IF;

    -- Policy for updating conversations (public chatbots)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Anyone can update conversations for public chatbots'
    ) THEN
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
    END IF;
END
$$;
