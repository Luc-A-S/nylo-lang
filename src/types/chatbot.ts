
export interface ChatbotSettings {
  brandingColor: string;
  businessName: string;
  welcomeMessage: string;
}

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  sourceCode: string;
  isOnline: boolean;
  publicLink?: string;
  accessCount: number;
  todayAccessCount: number;
  lastUpdated: Date;
  createdAt: Date;
  settings: ChatbotSettings;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  sourceCode: string;
}
