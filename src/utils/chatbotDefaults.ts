
import { ChatbotSettings } from '@/types/chatbot';

export const DEFAULT_NYLO_CODE = `inicio:
  mensagem:
    "Olá! Como posso ajudar você hoje?"
    botao 1:
      "Sobre nós" -> sobre
    botao 2:
      "Suporte" -> suporte

fluxo sobre:
  mensagem:
    "Somos uma empresa inovadora!"

fluxo suporte:
  mensagem:
    "Como podemos ajudar?"

fim`;

export const createDefaultSettings = (name: string): ChatbotSettings => ({
  brandingColor: '#356CFF',
  businessName: name,
  welcomeMessage: 'Olá! Como posso ajudar você hoje?'
});
