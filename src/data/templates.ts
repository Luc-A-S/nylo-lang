
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'empresa' | 'faq';
  preview: string;
  sourceCode: string;
}

export const templates: Template[] = [
  {
    id: 'ecommerce-1',
    name: 'Loja Virtual',
    description: 'Template para e-commerce com carrinho e produtos',
    category: 'ecommerce',
    preview: 'Olá! Bem-vindo à nossa loja. Como posso te ajudar hoje?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo à nossa loja virtual! 🛍️"
    "Como posso te ajudar hoje?"
    botao 1:
      "Ver Produtos" -> produtos
    botao 2:
      "Carrinho" -> carrinho
    botao 3:
      "Atendimento" -> atendimento_humano

fluxo produtos:
  mensagem:
    "Aqui estão nossos produtos em destaque:"
    "📱 Smartphones"
    "💻 Notebooks" 
    "🎧 Fones de Ouvido"
    botao 1:
      "Ver Ofertas" -> ofertas
    botao 2:
      "Falar com Vendedor" -> atendimento_humano

fluxo carrinho:
  mensagem:
    "Seu carrinho está vazio! 🛒"
    "Que tal dar uma olhada em nossos produtos?"
    botao 1:
      "Ver Produtos" -> produtos

fluxo ofertas:
  mensagem:
    "🔥 OFERTAS ESPECIAIS:"
    "📱 iPhone 15 - R$ 4.999"
    "💻 MacBook Air - R$ 8.999"
    botao 1:
      "Quero Comprar" -> atendimento_humano

fluxo atendimento_humano:
  mensagem:
    "Perfeito! Vou conectar você com nosso vendedor."
    "Por favor, informe seu nome:"

fim`
  },
  {
    id: 'empresa-1',
    name: 'Atendimento Empresarial',
    description: 'Template para atendimento corporativo',
    category: 'empresa',
    preview: 'Olá! Bem-vindo à nossa empresa. Em que posso ajudá-lo?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo à nossa empresa! 🏢"
    "Em que posso ajudá-lo hoje?"
    botao 1:
      "Informações" -> informacoes
    botao 2:
      "Serviços" -> servicos
    botao 3:
      "Contato" -> contato

fluxo informacoes:
  mensagem:
    "Somos uma empresa especializada em soluções digitais."
    "📍 Localização: São Paulo, SP"
    "🕐 Horário: 8h às 18h"
    botao 1:
      "Ver Serviços" -> servicos
    botao 2:
      "Falar Conosco" -> contato

fluxo servicos:
  mensagem:
    "Nossos principais serviços:"
    "💻 Desenvolvimento de Software"
    "📱 Aplicativos Mobile"
    "🌐 Sites e E-commerce"
    botao 1:
      "Solicitar Orçamento" -> contato

fluxo contato:
  mensagem:
    "Entre em contato conosco:"
    "📧 contato@empresa.com"
    "📞 (11) 9999-9999"
    "Ou fale com nosso atendente:"
    botao 1:
      "Falar com Atendente" -> atendimento_humano

fluxo atendimento_humano:
  mensagem:
    "Conectando com nosso atendimento..."
    "Por favor, informe seu nome:"

fim`
  },
  {
    id: 'faq-1',
    name: 'Perguntas Frequentes',
    description: 'Template para FAQ e dúvidas comuns',
    category: 'faq',
    preview: 'Olá! Tenho algumas respostas prontas para suas dúvidas.',
    sourceCode: `inicio:
  mensagem:
    "Olá! 👋 Tenho algumas respostas prontas para suas dúvidas."
    "Sobre o que você gostaria de saber?"
    botao 1:
      "Horários" -> horarios
    botao 2:
      "Preços" -> precos
    botao 3:
      "Localização" -> localizacao
    botao 4:
      "Outras Dúvidas" -> atendimento_humano

fluxo horarios:
  mensagem:
    "📅 Nossos horários de funcionamento:"
    "Segunda a Sexta: 8h às 18h"
    "Sábado: 8h às 12h"
    "Domingo: Fechado"
    botao 1:
      "Outras Informações" -> localizacao
    botao 2:
      "Falar com Atendente" -> atendimento_humano

fluxo precos:
  mensagem:
    "💰 Informações sobre preços:"
    "Consulta básica: R$ 150"
    "Consulta especializada: R$ 300"
    "Pacote mensal: R$ 800"
    botao 1:
      "Agendar Consulta" -> atendimento_humano
    botao 2:
      "Ver Horários" -> horarios

fluxo localizacao:
  mensagem:
    "📍 Nossa localização:"
    "Rua das Flores, 123"
    "Centro - São Paulo/SP"
    "CEP: 01234-567"
    botao 1:
      "Ver Horários" -> horarios
    botao 2:
      "Falar Conosco" -> atendimento_humano

fluxo atendimento_humano:
  mensagem:
    "Conectando com nosso atendimento..."
    "Por favor, informe seu nome e sua dúvida:"

fim`
  }
];

export const getTemplatesByCategory = (category: 'ecommerce' | 'empresa' | 'faq'): Template[] => {
  return templates.filter(template => template.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};
