
import { Chatbot, ChatbotSettings } from '@/types/chatbot';
import { createDefaultSettings } from './chatbotDefaults';

export const transformSupabaseChatbot = (bot: any): Chatbot => {
  let settings: ChatbotSettings;
  try {
    settings = typeof bot.settings === 'string' 
      ? JSON.parse(bot.settings) 
      : bot.settings || {};
  } catch (e) {
    settings = createDefaultSettings(bot.name);
  }

  // Garantir configurações padrão
  const defaultSettings = createDefaultSettings(bot.name);

  return {
    id: bot.id,
    name: bot.name,
    description: bot.description,
    sourceCode: bot.nylo_code || '',
    isOnline: bot.is_online,
    publicLink: bot.public_link,
    accessCount: bot.access_count || 0,
    todayAccessCount: bot.today_access_count || 0,
    lastUpdated: new Date(bot.updated_at),
    createdAt: new Date(bot.created_at),
    settings: { ...defaultSettings, ...settings }
  };
};
