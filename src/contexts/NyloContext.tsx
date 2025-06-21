
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  code: string;
  isOnline: boolean;
  lastUpdated: Date;
  publicLink?: string;
  accessCount?: number;
  todayAccessCount?: number;
}

interface NyloContextType {
  chatbots: Chatbot[];
  createChatbot: (name: string, description: string) => Chatbot;
  createChatbotFromTemplate: (templateId: string, name: string, description: string) => Chatbot;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => void;
  deleteChatbot: (id: string) => void;
  getChatbot: (id: string) => Chatbot | undefined;
}

const NyloContext = createContext<NyloContextType | undefined>(undefined);

const getTemplateCode = (templateId: string): string => {
  const templates = {
    ecommerce: `// Template E-commerce
inicio:
  diga "Olá! Bem-vindo à nossa loja! 🛒"
  diga "Como posso ajudá-lo hoje?"
  diga "1. Ver produtos"
  diga "2. Status do pedido"
  diga "3. Trocas e devoluções"
  diga "4. Falar com atendente"
  
  se entrada contém ["1", "produtos", "ver produtos", "catálogo"]:
    vá para produtos
  se entrada contém ["2", "pedido", "status", "rastreamento"]:
    vá para pedido
  se entrada contém ["3", "troca", "devolução", "trocar"]:
    vá para trocas
  se entrada contém ["4", "atendente", "humano", "pessoa"]:
    vá para atendente
  senão:
    diga "Desculpe, não entendi. Pode escolher uma das opções acima?"
    vá para inicio

produtos:
  diga "📱 Nossos produtos mais vendidos:"
  diga "• Smartphones - R$ 899"
  diga "• Notebooks - R$ 2.499"
  diga "• Headphones - R$ 299"
  diga "• Smartwatch - R$ 599"
  diga ""
  diga "Digite o nome do produto para mais informações ou 'voltar' para o menu principal."
  
  se entrada contém ["smartphone", "celular", "telefone"]:
    diga "📱 Smartphone Galaxy Pro"
    diga "✅ Tela 6.5' AMOLED"
    diga "✅ 128GB de armazenamento"
    diga "✅ Câmera tripla 48MP"
    diga "💰 R$ 899 em até 12x sem juros"
    diga "🚚 Frete grátis para todo Brasil"
  se entrada contém ["notebook", "laptop", "computador"]:
    diga "💻 Notebook UltraBook Pro"
    diga "✅ Intel i5 11ª geração"
    diga "✅ 8GB RAM + 256GB SSD"
    diga "✅ Tela 15.6' Full HD"
    diga "💰 R$ 2.499 em até 12x sem juros"
  se entrada contém ["headphone", "fone", "audio"]:
    diga "🎧 Headphone Wireless Premium"
    diga "✅ Cancelamento de ruído ativo"
    diga "✅ 30h de bateria"
    diga "✅ Bluetooth 5.0"
    diga "💰 R$ 299 em até 6x sem juros"
  se entrada contém ["smartwatch", "relógio", "watch"]:
    diga "⌚ Smartwatch Fitness Pro"
    diga "✅ Monitor cardíaco 24h"
    diga "✅ GPS integrado"
    diga "✅ Resistente à água"
    diga "💰 R$ 599 em até 10x sem juros"
  se entrada contém ["voltar", "menu", "início"]:
    vá para inicio
  senão:
    diga "Produto não encontrado. Verifique nossa lista acima!"

pedido:
  diga "Para consultar seu pedido, preciso do número ou CPF."
  diga "Digite seu número de pedido:"
  
  aguarde entrada
  se entrada contém números:
    diga "✅ Pedido encontrado!"
    diga "📦 Status: Em transporte"
    diga "🚚 Previsão: 2-3 dias úteis"
    diga "📍 Última atualização: Saiu para entrega"
    diga "🔔 Você receberá SMS quando o produto chegar!"
  senão:
    diga "❌ Pedido não encontrado. Verifique o número e tente novamente."
    diga "Ou digite 'voltar' para o menu principal."
  
  se entrada contém ["voltar", "menu"]:
    vá para inicio

trocas:
  diga "🔄 Política de Trocas e Devoluções"
  diga ""
  diga "✅ 30 dias para troca/devolução"
  diga "✅ Produto deve estar na embalagem original"
  diga "✅ Não pode ter sinais de uso"
  diga ""
  diga "Para solicitar uma troca:"
  diga "1. Acesse sua conta no site"
  diga "2. Vá em 'Meus Pedidos'"
  diga "3. Clique em 'Solicitar Troca'"
  diga ""
  diga "Ou fale com nosso atendente para ajuda personalizada!"
  diga "Digite 'atendente' ou 'voltar' para o menu."
  
  se entrada contém ["atendente", "ajuda", "humano"]:
    vá para atendente
  se entrada contém ["voltar", "menu"]:
    vá para inicio

atendente:
  diga "🤝 Conectando você com um atendente humano..."
  diga "⏰ Horário de atendimento: 8h às 18h"
  diga "📞 Telefone: (11) 9999-9999"
  diga "📧 Email: atendimento@loja.com"
  diga "💬 WhatsApp: (11) 99999-9999"
  diga ""
  diga "Em breve você será atendido! Obrigado pela preferência! 😊"`,

    empresa: `// Template Empresa
inicio:
  diga "Olá! Bem-vindo à nossa empresa! 🏢"
  diga "Sou seu assistente virtual. Como posso ajudá-lo?"
  diga ""
  diga "1. Informações da empresa"
  diga "2. Nossos serviços"
  diga "3. Solicitar orçamento"
  diga "4. Contato comercial"
  diga "5. Suporte técnico"
  
  se entrada contém ["1", "empresa", "informações", "sobre"]:
    vá para empresa
  se entrada contém ["2", "serviços", "produtos", "soluções"]:
    vá para servicos
  se entrada contém ["3", "orçamento", "cotação", "preço"]:
    vá para orcamento
  se entrada contém ["4", "comercial", "vendas", "negócio"]:
    vá para comercial
  se entrada contém ["5", "suporte", "técnico", "ajuda", "problema"]:
    vá para suporte
  senão:
    diga "Por favor, escolha uma das opções numeradas acima."
    vá para inicio

empresa:
  diga "🏢 Sobre Nossa Empresa"
  diga ""
  diga "• 🎯 Missão: Fornecer soluções inovadoras"
  diga "• 👁️ Visão: Ser referência no mercado"
  diga "• 💎 Valores: Qualidade, Inovação, Transparência"
  diga ""
  diga "📈 + de 15 anos no mercado"
  diga "👥 + de 500 clientes atendidos"
  diga "🏆 Certificação ISO 9001"
  diga "🌍 Atuação nacional e internacional"
  diga ""
  diga "Digite 'voltar' para o menu principal ou escolha outra opção."
  
  se entrada contém ["voltar", "menu"]:
    vá para inicio
  se entrada contém ["serviços", "produtos"]:
    vá para servicos
  se entrada contém ["orçamento", "preço"]:
    vá para orcamento

servicos:
  diga "💼 Nossos Serviços"
  diga ""
  diga "🔧 Consultoria Empresarial"
  diga "• Análise de processos"
  diga "• Otimização operacional"
  diga "• Gestão estratégica"
  diga ""
  diga "💻 Soluções Tecnológicas"
  diga "• Desenvolvimento de software"
  diga "• Integração de sistemas"
  diga "• Automação de processos"
  diga ""
  diga "📊 Business Intelligence"
  diga "• Análise de dados"
  diga "• Relatórios gerenciais"
  diga "• Dashboard executivo"
  diga ""
  diga "Gostaria de um orçamento personalizado? Digite 'orçamento'"
  
  se entrada contém ["orçamento", "cotação", "preço"]:
    vá para orcamento
  se entrada contém ["voltar", "menu"]:
    vá para inicio
  se entrada contém ["consultoria", "processo"]:
    diga "👨‍💼 Consultoria Empresarial"
    diga "Nossos especialistas analisam seus processos e propõem melhorias."
    diga "📞 Agende uma consulta gratuita!"
  se entrada contém ["tecnologia", "software", "sistema"]:
    diga "💻 Soluções Tecnológicas"
    diga "Desenvolvemos sistemas sob medida para seu negócio."
    diga "🚀 Tecnologias modernas e escaláveis!"

orcamento:
  diga "📋 Solicitação de Orçamento"
  diga ""
  diga "Para enviar um orçamento personalizado, preciso de algumas informações:"
  diga ""
  diga "1. Qual serviço te interessa?"
  diga "2. Qual o tamanho da sua empresa?"
  diga "3. Qual seu prazo?"
  diga ""
  diga "Você pode:"
  diga "📞 Ligar: (11) 3333-3333"
  diga "📧 Email: orcamento@empresa.com"
  diga "🌐 Site: www.empresa.com/orcamento"
  diga "💬 Ou falar com nosso comercial agora!"
  
  se entrada contém ["comercial", "vendas", "falar"]:
    vá para comercial
  se entrada contém ["voltar", "menu"]:
    vá para inicio

comercial:
  diga "🤝 Equipe Comercial"
  diga ""
  diga "Nossos consultores estão prontos para atendê-lo!"
  diga ""
  diga "💼 Horário comercial: 8h às 18h"
  diga "📞 Telefone: (11) 3333-3333"
  diga "📧 Email: comercial@empresa.com"
  diga "💬 WhatsApp: (11) 99999-9999"
  diga ""
  diga "🎯 Especializações:"
  diga "• Grandes empresas - João Silva"
  diga "• PMEs - Maria Santos"
  diga "• Startups - Pedro Costa"
  diga ""
  diga "⚡ Retorno em até 2 horas úteis!"

suporte:
  diga "🛠️ Suporte Técnico"
  diga ""
  diga "Como podemos ajudá-lo?"
  diga ""
  diga "1. Problema com sistema"
  diga "2. Dúvida sobre funcionalidade"
  diga "3. Solicitação de acesso"
  diga "4. Reportar bug"
  diga "5. Treinamento"
  
  se entrada contém ["1", "problema", "sistema", "erro"]:
    diga "🚨 Problema no Sistema"
    diga "Descreva o problema e nosso time técnico entrará em contato."
    diga "📧 Email: suporte@empresa.com"
    diga "🎫 Ou abra um ticket em: suporte.empresa.com"
    diga "⏰ SLA: 4 horas úteis"
  se entrada contém ["2", "dúvida", "funcionalidade", "como"]:
    diga "❓ Dúvidas sobre Funcionalidades"
    diga "Consulte nossa base de conhecimento:"
    diga "📚 help.empresa.com"
    diga "🎥 Canal no YouTube: Empresa Tutoriais"
    diga "💬 Chat ao vivo: 9h às 17h"
  se entrada contém ["3", "acesso", "login", "senha"]:
    diga "🔐 Solicitação de Acesso"
    diga "Para problemas de acesso:"
    diga "📧 Email: admin@empresa.com"
    diga "📋 Informe: nome completo, empresa e cargo"
    diga "⏰ Liberação em até 24h"
  se entrada contém ["4", "bug", "erro", "falha"]:
    diga "🐛 Reportar Bug"
    diga "Ajude-nos a melhorar!"
    diga "📧 Email: bugs@empresa.com"
    diga "📋 Inclua: prints, navegador, sistema operacional"
    diga "🏆 Bugs válidos ganham desconto!"
  se entrada contém ["5", "treinamento", "capacitação", "curso"]:
    diga "🎓 Treinamento"
    diga "Capacite sua equipe!"
    diga "📅 Agenda: treinamento.empresa.com"
    diga "💻 Online ou presencial"
    diga "🆓 Clientes têm desconto especial!"
  
  se entrada contém ["voltar", "menu"]:
    vá para inicio`,

    faq: `// Template FAQ
inicio:
  diga "👋 Olá! Bem-vindo à nossa Central de Ajuda!"
  diga "Estou aqui para responder suas dúvidas mais frequentes."
  diga ""
  diga "🔍 Perguntas mais comuns:"
  diga "1. Como criar uma conta?"
  diga "2. Como alterar minha senha?"
  diga "3. Formas de pagamento"
  diga "4. Política de privacidade"
  diga "5. Como cancelar?"
  diga "6. Falar com atendente"
  
  se entrada contém ["1", "conta", "cadastro", "registrar", "criar conta"]:
    vá para conta
  se entrada contém ["2", "senha", "alterar senha", "esqueci senha", "redefinir"]:
    vá para senha
  se entrada contém ["3", "pagamento", "pagar", "forma pagamento", "cartão"]:
    vá para pagamento
  se entrada contém ["4", "privacidade", "dados", "lgpd", "política"]:
    vá para privacidade
  se entrada contém ["5", "cancelar", "cancelamento", "desativar"]:
    vá para cancelamento
  se entrada contém ["6", "atendente", "humano", "pessoa", "ajuda"]:
    vá para atendente
  senão:
    diga "🤔 Não encontrei uma resposta para isso."
    diga "Tente reformular sua pergunta ou escolha uma das opções acima."
    diga "Você também pode falar com nosso atendente digitando 'atendente'."

conta:
  diga "👤 Como Criar uma Conta"
  diga ""
  diga "📝 Passo a passo:"
  diga "1. Acesse nosso site"
  diga "2. Clique em 'Cadastrar'"
  diga "3. Preencha seus dados pessoais"
  diga "4. Confirme seu email"
  diga "5. Pronto! Sua conta está ativa"
  diga ""
  diga "📧 Não recebeu o email de confirmação?"
  diga "• Verifique a caixa de spam"
  diga "• Aguarde até 10 minutos"
  diga "• Solicite novo envio"
  diga ""
  diga "⚠️ Problemas? Digite 'atendente' para ajuda personalizada."
  
  se entrada contém ["atendente", "ajuda", "problema"]:
    vá para atendente
  se entrada contém ["voltar", "menu", "início"]:
    vá para inicio
  se entrada contém ["email", "confirmação", "spam"]:
    diga "📬 Problemas com Email de Confirmação"
    diga "1. Verifique a pasta de spam/lixo eletrônico"
    diga "2. Adicione noreply@empresa.com aos contatos"
    diga "3. Aguarde até 10 minutos"
    diga "4. Se não chegar, solicite reenvio no site"

senha:
  diga "🔐 Problemas com Senha"
  diga ""
  diga "🔄 Para redefinir sua senha:"
  diga "1. Acesse a página de login"
  diga "2. Clique em 'Esqueci minha senha'"
  diga "3. Digite seu email cadastrado"
  diga "4. Verifique seu email"
  diga "5. Clique no link recebido"
  diga "6. Crie uma nova senha"
  diga ""
  diga "💡 Dicas para senha segura:"
  diga "• Mínimo 8 caracteres"
  diga "• Use letras, números e símbolos"
  diga "• Não use dados pessoais"
  diga "• Atualize regularmente"
  
  se entrada contém ["voltar", "menu"]:
    vá para inicio
  se entrada contém ["segura", "dicas", "criar senha"]:
    diga "🛡️ Como Criar uma Senha Segura"
    diga "✅ Use pelo menos 8 caracteres"
    diga "✅ Combine letras maiúsculas e minúsculas"
    diga "✅ Inclua números (0-9)"
    diga "✅ Use símbolos (@, #, !, etc.)"
    diga "❌ Evite: nome, data nascimento, '123456'"
    diga "💡 Dica: use frases como base"
    diga "Exemplo: 'MeuCachorro#2023!' = segura e fácil de lembrar"

pagamento:
  diga "💳 Formas de Pagamento"
  diga ""
  diga "💰 Aceitamos:"
  diga "• 💳 Cartão de crédito (Visa, Master, Elo)"
  diga "• 💳 Cartão de débito"
  diga "• 🏦 PIX (instantâneo)"
  diga "• 🏪 Boleto bancário"
  diga "• 💻 PayPal"
  diga "• 💰 Saldo em conta"
  diga ""
  diga "📅 Parcelamento:"
  diga "• Até 12x sem juros no cartão"
  diga "• PIX com 5% de desconto"
  diga "• Boleto com 3% de desconto"
  diga ""
  diga "🔒 Todos os pagamentos são 100% seguros!"
  
  se entrada contém ["pix", "instantâneo"]:
    diga "⚡ Pagamento via PIX"
    diga "• Pagamento instantâneo 24/7"
    diga "• 5% de desconto adicional"
    diga "• Liberação imediata do serviço"
    diga "• Limite de R$ 20.000 por transação"
  se entrada contém ["boleto", "bancário"]:
    diga "🏪 Pagamento via Boleto"
    diga "• 3% de desconto"
    diga "• Vencimento em 3 dias úteis"
    diga "• Confirmação em até 2 dias úteis"
    diga "• Pode ser pago em qualquer banco"
  se entrada contém ["cartão", "crédito", "parcelamento"]:
    diga "💳 Cartão de Crédito"
    diga "• Parcelamento em até 12x sem juros"
    diga "• Aprovação instantânea"
    diga "• Aceito: Visa, Mastercard, Elo"
    diga "• Processamento seguro"
  
  se entrada contém ["voltar", "menu"]:
    vá para inicio

privacidade:
  diga "🛡️ Política de Privacidade e Proteção de Dados"
  diga ""
  diga "📋 Seus direitos (LGPD):"
  diga "• ✅ Saber quais dados coletamos"
  diga "• ✅ Solicitar correção de dados"
  diga "• ✅ Excluir seus dados"
  diga "• ✅ Portabilidade de dados"
  diga "• ✅ Revogar consentimento"
  diga ""
  diga "🔐 Como protegemos seus dados:"
  diga "• Criptografia de ponta a ponta"
  diga "• Servidores seguros"
  diga "• Acesso restrito"
  diga "• Auditoria regular"
  diga ""
  diga "📞 Para exercer seus direitos:"
  diga "📧 Email: lgpd@empresa.com"
  diga "📄 Política completa: empresa.com/privacidade"
  
  se entrada contém ["voltar", "menu"]:
    vá para inicio
  se entrada contém ["excluir", "deletar", "remover dados"]:
    diga "🗑️ Exclusão de Dados"
    diga "Para solicitar exclusão dos seus dados:"
    diga "📧 Envie email para: lgpd@empresa.com"
    diga "📋 Inclua: nome completo, CPF, email cadastrado"
    diga "⏰ Processamento em até 15 dias"
    diga "⚠️ Alguns dados podem ser mantidos por obrigação legal"
  se entrada contém ["correção", "alterar", "atualizar"]:
    diga "✏️ Correção de Dados"
    diga "Para corrigir informações:"
    diga "1. Acesse 'Meu Perfil' no site"
    diga "2. Edite os dados necessários"
    diga "3. Salve as alterações"
    diga "📧 Ou envie email para: lgpd@empresa.com"

cancelamento:
  diga "❌ Como Cancelar"
  diga ""
  diga "😔 Lamentamos que queira nos deixar!"
  diga ""
  diga "📝 Formas de cancelar:"
  diga "1. 🌐 Pelo site: Minha Conta > Cancelar"
  diga "2. 📧 Email: cancelamento@empresa.com"
  diga "3. 📞 Telefone: (11) 4444-4444"
  diga "4. 💬 Chat com atendente"
  diga ""
  diga "⏰ Quando cancela:"
  diga "• Acesso até fim do período pago"
  diga "• Backup dos dados por 30 dias"
  diga "• Sem taxas de cancelamento"
  diga ""
  diga "🎁 Antes de cancelar, que tal um desconto especial?"
  diga "Digite 'desconto' para ver ofertas exclusivas!"
  
  se entrada contém ["desconto", "oferta", "promoção"]:
    diga "🎁 Oferta Especial para Você!"
    diga "Por ser um cliente valioso, temos:"
    diga "• 50% OFF por 3 meses"
    diga "• Funcionalidades premium grátis"
    diga "• Suporte prioritário"
    diga ""
    diga "💬 Fale com nosso atendente para ativar!"
    diga "Digite 'atendente' agora!"
  se entrada contém ["atendente", "chat", "falar"]:
    vá para atendente
  se entrada contém ["voltar", "menu"]:
    vá para inicio

atendente:
  diga "👨‍💼 Conectando com Atendente Humano"
  diga ""
  diga "🕐 Horário de atendimento:"
  diga "• Segunda a Sexta: 8h às 18h"
  diga "• Sábado: 9h às 15h"
  diga "• Domingo: Chatbot apenas"
  diga ""
  diga "📞 Contatos diretos:"
  diga "• Telefone: (11) 4444-4444"
  diga "• WhatsApp: (11) 99999-9999"
  diga "• Email: atendimento@empresa.com"
  diga ""
  diga "⚡ Tempo médio de resposta:"
  diga "• Chat: 2 minutos"
  diga "• WhatsApp: 5 minutos"
  diga "• Email: 2 horas"
  diga ""
  diga "🎫 Ou abra um ticket: suporte.empresa.com"
  diga ""
  diga "Obrigado pela preferência! 😊"`
  };

  return templates[templateId] || '';
};

export const NyloProvider = ({ children }: { children: ReactNode }) => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  const createChatbot = (name: string, description: string): Chatbot => {
    const newBot: Chatbot = {
      id: Date.now().toString(),
      name,
      description,
      code: '// Seu código NyloLang aqui\ninicio:\n  diga "Olá! Como posso ajudá-lo?"',
      isOnline: false,
      lastUpdated: new Date(),
      accessCount: 0,
      todayAccessCount: 0
    };

    setChatbots(prev => [...prev, newBot]);
    return newBot;
  };

  const createChatbotFromTemplate = (templateId: string, name: string, description: string): Chatbot => {
    const templateCode = getTemplateCode(templateId);
    
    const newBot: Chatbot = {
      id: Date.now().toString(),
      name,
      description,
      code: templateCode,
      isOnline: true,
      lastUpdated: new Date(),
      accessCount: 0,
      todayAccessCount: 0
    };

    setChatbots(prev => [...prev, newBot]);
    return newBot;
  };

  const updateChatbot = (id: string, updates: Partial<Chatbot>) => {
    setChatbots(prev => 
      prev.map(bot => 
        bot.id === id 
          ? { ...bot, ...updates, lastUpdated: new Date() }
          : bot
      )
    );
  };

  const deleteChatbot = (id: string) => {
    setChatbots(prev => prev.filter(bot => bot.id !== id));
  };

  const getChatbot = (id: string): Chatbot | undefined => {
    return chatbots.find(bot => bot.id === id);
  };

  const value: NyloContextType = {
    chatbots,
    createChatbot,
    createChatbotFromTemplate,
    updateChatbot,
    deleteChatbot,
    getChatbot
  };

  return (
    <NyloContext.Provider value={value}>
      {children}
    </NyloContext.Provider>
  );
};

export const useNylo = () => {
  const context = useContext(NyloContext);
  if (context === undefined) {
    throw new Error('useNylo must be used within a NyloProvider');
  }
  return context;
};
