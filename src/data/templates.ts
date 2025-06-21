
export interface Template {
  id: string;
  name: string;
  category: 'ecommerce' | 'empresa' | 'faq';
  description: string;
  preview: string;
  sourceCode: string;
  config: {
    welcomeMessage: string;
    flows: {
      id: string;
      name: string;
      trigger: string[];
      responses: string[];
    }[];
    fallbackMessage: string;
  };
}

export const templates: Template[] = [
  // E-commerce Templates
  {
    id: 'ecommerce-basic',
    name: 'Loja Básica',
    category: 'ecommerce',
    description: 'Template para lojas online com suporte a produtos, pedidos e entregas',
    preview: 'Olá! Posso ajudar você com nossos produtos, pedidos ou entregas. O que você precisa?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo à nossa loja! 👋 Como posso ajudar você hoje?"
    botao 1:
      "Ver Produtos" -> produtos
    botao 2:
      "Status do Pedido" -> pedidos
    botao 3:
      "Atendimento" -> atendimento

fluxo produtos:
  mensagem:
    "Temos uma grande variedade de produtos! 🛍️"
    "Você pode navegar pelo nosso catálogo ou me dizer que tipo de produto você está procurando!"
    botao 1:
      "Ver Catálogo" -> catalogo
    botao 2:
      "Falar com Vendedor" -> atendimento
    botao 3:
      "Voltar ao Início" -> inicio

fluxo pedidos:
  mensagem:
    "Para consultar seu pedido, preciso do número do pedido ou CPF."
    "Você pode me enviar essas informações?"
    botao 1:
      "Tenho o Número do Pedido" -> rastreamento
    botao 2:
      "Falar com Atendente" -> atendimento
    botao 3:
      "Voltar ao Início" -> inicio

fluxo atendimento:
  mensagem:
    "Perfeito! Vou conectar você com um de nossos atendentes."
    "Por favor, informe seu nome para iniciarmos:"

fim`,
    config: {
      welcomeMessage: 'Olá! Bem-vindo à nossa loja! 👋 Como posso ajudar você hoje?',
      flows: [
        {
          id: 'produtos',
          name: 'Consulta de Produtos',
          trigger: ['produtos', 'catálogo', 'itens', 'loja', 'comprar'],
          responses: [
            'Temos uma grande variedade de produtos! 🛍️',
            'Você pode navegar pelo nosso catálogo em: [link do catálogo]',
            'Ou me diga que tipo de produto você está procurando!'
          ]
        },
        {
          id: 'pedidos',
          name: 'Status do Pedido',
          trigger: ['pedido', 'compra', 'status', 'rastreamento', 'entrega'],
          responses: [
            'Para consultar seu pedido, preciso do número do pedido ou CPF.',
            'Você pode me enviar essas informações?',
            'Também pode acompanhar pelo link: [link de rastreamento]'
          ]
        },
        {
          id: 'atendimento',
          name: 'Atendimento ao Cliente',
          trigger: ['ajuda', 'suporte', 'problema', 'reclamação', 'dúvida'],
          responses: [
            'Estou aqui para ajudar! 😊',
            'Pode me contar qual é sua dúvida ou problema?',
            'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.'
          ]
        }
      ],
      fallbackMessage: 'Desculpe, não entendi. Posso ajudar com produtos, pedidos ou atendimento. O que você precisa?'
    }
  },
  {
    id: 'ecommerce-fashion',
    name: 'Loja de Moda',
    category: 'ecommerce',
    description: 'Template especializado em moda com guia de tamanhos e tendências',
    preview: 'Olá! Bem-vindo à nossa boutique! Posso ajudar você a encontrar o look perfeito?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo à nossa boutique online! ✨ Vamos encontrar o look perfeito para você?"
    botao 1:
      "Ver Looks e Tendências" -> looks
    botao 2:
      "Guia de Tamanhos" -> tamanhos
    botao 3:
      "Lançamentos" -> lancamentos
    botao 4:
      "Atendimento" -> atendimento

fluxo looks:
  mensagem:
    "Que incrível! Adoro ajudar com looks! 💄✨"
    "Você está procurando algo para que ocasião?"
    botao 1:
      "Casual" -> looks_casual
    botao 2:
      "Trabalho" -> looks_trabalho
    botao 3:
      "Festa" -> looks_festa
    botao 4:
      "Voltar ao Início" -> inicio

fluxo tamanhos:
  mensagem:
    "Claro! Temos um guia completo de tamanhos 📏"
    "Para qual peça você precisa da informação?"
    botao 1:
      "Roupas Femininas" -> tamanhos_fem
    botao 2:
      "Roupas Masculinas" -> tamanhos_masc
    botao 3:
      "Calçados" -> tamanhos_calc
    botao 4:
      "Voltar ao Início" -> inicio

fluxo lancamentos:
  mensagem:
    "Temos novidades incríveis chegando! 🆕"
    "Nossa nova coleção está disponível!"
    botao 1:
      "Ver Nova Coleção" -> nova_colecao
    botao 2:
      "Ofertas Especiais" -> ofertas
    botao 3:
      "Voltar ao Início" -> inicio

fluxo atendimento:
  mensagem:
    "Perfeito! Nossa consultora de moda vai te ajudar!"
    "Por favor, me conte seu nome e como prefere ser chamada:"

fim`,
    config: {
      welcomeMessage: 'Olá! Bem-vindo à nossa boutique online! ✨ Vamos encontrar o look perfeito para você?',
      flows: [
        {
          id: 'looks',
          name: 'Looks e Tendências',
          trigger: ['look', 'outfit', 'tendência', 'moda', 'estilo', 'combinação'],
          responses: [
            'Que incrível! Adoro ajudar com looks! 💄✨',
            'Você está procurando algo para que ocasião?',
            'Casual, trabalho, festa ou algo especial?'
          ]
        },
        {
          id: 'tamanhos',
          name: 'Guia de Tamanhos',
          trigger: ['tamanho', 'medida', 'tam', 'size', 'numeração'],
          responses: [
            'Claro! Temos um guia completo de tamanhos 📏',
            'Para qual peça você precisa da informação?',
            'Você pode ver nosso guia em: [link do guia de tamanhos]'
          ]
        },
        {
          id: 'lancamentos',
          name: 'Lançamentos',
          trigger: ['novidade', 'lançamento', 'novo', 'chegada', 'coleção'],
          responses: [
            'Temos novidades incríveis chegando! 🆕',
            'Nossa nova coleção está disponível!',
            'Quer ver os lançamentos? [link da nova coleção]'
          ]
        }
      ],
      fallbackMessage: 'Desculpe, não entendi. Posso ajudar com looks, tamanhos, novidades ou produtos. O que você gostaria de saber?'
    }
  },

  // Empresa Templates
  {
    id: 'empresa-servicos',
    name: 'Empresa de Serviços',
    category: 'empresa',
    description: 'Template para empresas prestadoras de serviços com agendamento e orçamentos',
    preview: 'Olá! Somos especialistas em [seu serviço]. Como podemos ajudar você hoje?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo à [Nome da Empresa]! 🏢 Como podemos ajudar você hoje?"
    botao 1:
      "Nossos Serviços" -> servicos
    botao 2:
      "Solicitar Orçamento" -> orcamento
    botao 3:
      "Agendar Consulta" -> agendamento
    botao 4:
      "Contato" -> contato

fluxo servicos:
  mensagem:
    "Oferecemos uma ampla gama de serviços! 🔧"
    "Nossos principais serviços incluem:"
    "• [Serviço 1]"
    "• [Serviço 2]" 
    "• [Serviço 3]"
    "Sobre qual você gostaria de saber mais?"
    botao 1:
      "Mais Detalhes" -> detalhes_servicos
    botao 2:
      "Solicitar Orçamento" -> orcamento
    botao 3:
      "Voltar ao Início" -> inicio

fluxo orcamento:
  mensagem:
    "Claro! Posso ajudar com um orçamento! 💰"
    "Para qual serviço você precisa do orçamento?"
    "Você pode me dar alguns detalhes do que precisa?"
    botao 1:
      "Tenho os Detalhes" -> detalhes_orcamento
    botao 2:
      "Falar com Especialista" -> agendamento
    botao 3:
      "Voltar ao Início" -> inicio

fluxo agendamento:
  mensagem:
    "Perfeito! Vamos agendar um horário! 📅"
    "Qual serviço você gostaria de agendar?"
    "Qual período funciona melhor para você?"
    botao 1:
      "Manhã (9h às 12h)" -> manha
    botao 2:
      "Tarde (13h às 17h)" -> tarde
    botao 3:
      "Voltar ao Início" -> inicio

fluxo contato:
  mensagem:
    "Aqui estão nossas informações de contato: 📞"
    "📱 Telefone: (11) 99999-9999"
    "📧 Email: contato@empresa.com"
    "📍 Endereço: [Seu endereço]"
    botao 1:
      "Agendar Visita" -> agendamento
    botao 2:
      "Voltar ao Início" -> inicio

fim`,
    config: {
      welcomeMessage: 'Olá! Bem-vindo à [Nome da Empresa]! 🏢 Como podemos ajudar você hoje?',
      flows: [
        {
          id: 'servicos',
          name: 'Nossos Serviços',
          trigger: ['serviços', 'serviço', 'trabalho', 'fazem', 'oferecem'],
          responses: [
            'Oferecemos uma ampla gama de serviços! 🔧',
            'Nossos principais serviços incluem:',
            '• [Serviço 1]\n• [Serviço 2]\n• [Serviço 3]',
            'Sobre qual você gostaria de saber mais?'
          ]
        },
        {
          id: 'orcamento',
          name: 'Orçamento',
          trigger: ['orçamento', 'preço', 'valor', 'custo', 'cotação'],
          responses: [
            'Claro! Posso ajudar com um orçamento! 💰',
            'Para qual serviço você precisa do orçamento?',
            'Você pode me dar alguns detalhes do que precisa?'
          ]
        },
        {
          id: 'agendamento',
          name: 'Agendamento',
          trigger: ['agendar', 'marcar', 'consulta', 'reunião', 'horário'],
          responses: [
            'Perfeito! Vamos agendar um horário! 📅',
            'Qual serviço você gostaria de agendar?',
            'Qual período funciona melhor para você?'
          ]
        },
        {
          id: 'contato',
          name: 'Contato',
          trigger: ['contato', 'telefone', 'email', 'endereço', 'localização'],
          responses: [
            'Aqui estão nossas informações de contato: 📞',
            '📱 Telefone: (11) 99999-9999',
            '📧 Email: contato@empresa.com',
            '📍 Endereço: [Seu endereço]'
          ]
        }
      ],
      fallbackMessage: 'Posso ajudar com informações sobre nossos serviços, orçamentos, agendamentos ou contato. O que você precisa?'
    }
  },
  {
    id: 'empresa-tech',
    name: 'Empresa de Tecnologia',
    category: 'empresa',
    description: 'Template para empresas de tecnologia com suporte técnico e soluções',
    preview: 'Olá! Somos especialistas em soluções tecnológicas. Como podemos inovar juntos?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo à [Nome da Empresa Tech]! 💻 Como podemos inovar juntos hoje?"
    botao 1:
      "Nossas Soluções" -> solucoes
    botao 2:
      "Suporte Técnico" -> suporte
    botao 3:
      "Consultoria" -> consultoria
    botao 4:
      "Contato" -> contato

fluxo solucoes:
  mensagem:
    "Oferecemos soluções tecnológicas inovadoras! 🚀"
    "Nossas principais áreas:"
    "• Desenvolvimento de Software"
    "• Consultoria em TI"
    "• Automação de Processos"
    "• Cloud Computing"
    "Qual área te interessa mais?"
    botao 1:
      "Desenvolvimento" -> desenvolvimento
    botao 2:
      "Consultoria TI" -> consultoria
    botao 3:
      "Voltar ao Início" -> inicio

fluxo suporte:
  mensagem:
    "Nosso suporte está aqui para ajudar! 🛠️"
    "Qual problema você está enfrentando?"
    "Pode me dar mais detalhes sobre o erro?"
    botao 1:
      "Problema de Login" -> suporte_login
    botao 2:
      "Sistema Lento" -> suporte_performance
    botao 3:
      "Falar com Técnico" -> atendimento_tecnico
    botao 4:
      "Voltar ao Início" -> inicio

fluxo consultoria:
  mensagem:
    "Oferecemos consultoria especializada! 💡"
    "Em que área você precisa de consultoria?"
    "Vamos agendar uma análise gratuita?"
    botao 1:
      "Transformação Digital" -> digital
    botao 2:
      "Infraestrutura TI" -> infraestrutura
    botao 3:
      "Agendar Análise" -> agendar
    botao 4:
      "Voltar ao Início" -> inicio

fluxo atendimento_tecnico:
  mensagem:
    "Conectando você com nosso especialista técnico..."
    "Por favor, descreva brevemente o problema:"

fim`,
    config: {
      welcomeMessage: 'Olá! Bem-vindo à [Nome da Empresa Tech]! 💻 Como podemos inovar juntos hoje?',
      flows: [
        {
          id: 'solucoes',
          name: 'Nossas Soluções',
          trigger: ['soluções', 'produtos', 'tecnologia', 'sistema', 'software'],
          responses: [
            'Oferecemos soluções tecnológicas inovadoras! 🚀',
            'Nossas principais áreas:',
            '• Desenvolvimento de Software\n• Consultoria em TI\n• Automação de Processos\n• Cloud Computing',
            'Qual área te interessa mais?'
          ]
        },
        {
          id: 'suporte',
          name: 'Suporte Técnico',
          trigger: ['suporte', 'ajuda', 'problema', 'erro', 'bug', 'técnico'],
          responses: [
            'Nosso suporte está aqui para ajudar! 🛠️',
            'Qual problema você está enfrentando?',
            'Pode me dar mais detalhes sobre o erro?'
          ]
        },
        {
          id: 'consultoria',
          name: 'Consultoria',
          trigger: ['consultoria', 'análise', 'diagnóstico', 'projeto', 'planejamento'],
          responses: [
            'Oferecemos consultoria especializada! 💡',
            'Em que área você precisa de consultoria?',
            'Vamos agendar uma análise gratuita?'
          ]
        }
      ],
      fallbackMessage: 'Posso ajudar com nossas soluções, suporte técnico, consultoria ou projetos. Como posso auxiliar?'
    }
  },

  // FAQ Templates
  {
    id: 'faq-geral',
    name: 'FAQ Geral',
    category: 'faq',
    description: 'Template genérico de FAQ com perguntas frequentes básicas',
    preview: 'Olá! Tenho as respostas para suas dúvidas mais frequentes. O que você gostaria de saber?',
    sourceCode: `inicio:
  mensagem:
    "Olá! Estou aqui para responder suas dúvidas! ❓ O que você gostaria de saber?"
    botao 1:
      "Horários de Funcionamento" -> horarios
    botao 2:
      "Formas de Pagamento" -> pagamento
    botao 3:
      "Entrega e Frete" -> entrega
    botao 4:
      "Política de Troca" -> troca

fluxo horarios:
  mensagem:
    "Nossos horários de funcionamento: 🕒"
    "• Segunda a Sexta: 9h às 18h"
    "• Sábado: 9h às 14h"
    "• Domingo: Fechado"
    botao 1:
      "Outras Dúvidas" -> inicio
    botao 2:
      "Falar com Atendente" -> atendimento

fluxo pagamento:
  mensagem:
    "Aceitamos as seguintes formas de pagamento: 💳"
    "• Cartão de crédito e débito"
    "• PIX"
    "• Dinheiro"
    "• Transferência bancária"
    botao 1:
      "Outras Dúvidas" -> inicio
    botao 2:
      "Falar com Atendente" -> atendimento

fluxo entrega:
  mensagem:
    "Informações sobre entrega: 📦"
    "• Frete grátis acima de R$ 100"
    "• Prazo: 3 a 7 dias úteis"
    "• Entregamos em todo o Brasil"
    botao 1:
      "Outras Dúvidas" -> inicio
    botao 2:
      "Rastrear Pedido" -> rastreamento

fluxo troca:
  mensagem:
    "Nossa política de trocas: 🔄"
    "• 30 dias para trocas"
    "• Produto deve estar em perfeito estado"
    "• Nota fiscal necessária"
    botao 1:
      "Outras Dúvidas" -> inicio
    botao 2:
      "Solicitar Troca" -> solicitar_troca

fluxo atendimento:
  mensagem:
    "Conectando você com nosso atendente..."
    "Por favor, me informe seu nome:"

fim`,
    config: {
      welcomeMessage: 'Olá! Estou aqui para responder suas dúvidas! ❓ O que você gostaria de saber?',
      flows: [
        {
          id: 'horarios',
          name: 'Horários de Funcionamento',
          trigger: ['horário', 'funcionamento', 'aberto', 'fechado', 'horario'],
          responses: [
            'Nossos horários de funcionamento: 🕒',
            '• Segunda a Sexta: 9h às 18h',
            '• Sábado: 9h às 14h',
            '• Domingo: Fechado'
          ]
        },
        {
          id: 'pagamento',
          name: 'Formas de Pagamento',
          trigger: ['pagamento', 'pagar', 'cartão', 'dinheiro', 'pix'],
          responses: [
            'Aceitamos as seguintes formas de pagamento: 💳',
            '• Cartão de crédito e débito',
            '• PIX',
            '• Dinheiro',
            '• Transferência bancária'
          ]
        },
        {
          id: 'entrega',
          name: 'Entrega e Frete',
          trigger: ['entrega', 'frete', 'envio', 'correios', 'prazo'],
          responses: [
            'Informações sobre entrega: 📦',
            '• Frete grátis acima de R$ 100',
            '• Prazo: 3 a 7 dias úteis',
            '• Entregamos em todo o Brasil'
          ]
        },
        {
          id: 'troca',
          name: 'Política de Troca',
          trigger: ['troca', 'devolução', 'trocar', 'devolver', 'política'],
          responses: [
            'Nossa política de trocas: 🔄',
            '• 30 dias para trocas',
            '• Produto deve estar em perfeito estado',
            '• Nota fiscal necessária'
          ]
        }
      ],
      fallbackMessage: 'Posso ajudar com horários, pagamentos, entregas, trocas e outras dúvidas. O que você precisa saber?'
    }
  },
  {
    id: 'faq-restaurante',
    name: 'FAQ Restaurante',
    category: 'faq',
    description: 'Template de FAQ especializado para restaurantes e delivery',
    preview: 'Olá! Posso responder suas dúvidas sobre nosso cardápio, delivery e funcionamento!',
    sourceCode: `inicio:
  mensagem:
    "Olá! Bem-vindo ao [Nome do Restaurante]! 🍽️ Posso responder suas dúvidas sobre nosso restaurante!"
    botao 1:
      "Cardápio" -> cardapio
    botao 2:
      "Delivery" -> delivery
    botao 3:
      "Horários" -> horarios_rest
    botao 4:
      "Reservas" -> reservas

fluxo cardapio:
  mensagem:
    "Nosso cardápio é delicioso! 😋"
    "Temos diversas opções:"
    "• Pratos principais"
    "• Petiscos"
    "• Sobremesas"
    "• Bebidas"
    "Quer ver nosso cardápio completo?"
    botao 1:
      "Ver Cardápio Completo" -> ver_cardapio
    botao 2:
      "Pratos do Dia" -> pratos_dia
    botao 3:
      "Voltar ao Início" -> inicio

fluxo delivery:
  mensagem:
    "Fazemos delivery sim! 🛵"
    "Você pode pedir pelos apps:"
    "• iFood"
    "• Uber Eats"
    "• Rappi"
    "Ou pelo nosso WhatsApp: (11) 99999-9999"
    botao 1:
      "Fazer Pedido" -> fazer_pedido
    botao 2:
      "Taxa de Entrega" -> taxa_entrega
    botao 3:
      "Voltar ao Início" -> inicio

fluxo horarios_rest:
  mensagem:
    "Nossos horários: 🕐"
    "• Segunda a Quinta: 11h às 23h"
    "• Sexta e Sábado: 11h às 00h"
    "• Domingo: 11h às 22h"
    botao 1:
      "Fazer Reserva" -> reservas
    botao 2:
      "Voltar ao Início" -> inicio

fluxo reservas:
  mensagem:
    "Claro! Fazemos reservas! 📞"
    "Para reservar uma mesa:"
    "• Ligue: (11) 99999-9999"
    "• WhatsApp: (11) 99999-9999"
    "Qual dia e horário você gostaria?"
    botao 1:
      "Hoje" -> reserva_hoje
    botao 2:
      "Outro Dia" -> reserva_outro_dia
    botao 3:
      "Voltar ao Início" -> inicio

fluxo atendimento:
  mensagem:
    "Vou conectar você com nosso atendente..."
    "Me informe seu nome, por favor:"

fim`,
    config: {
      welcomeMessage: 'Olá! Bem-vindo ao [Nome do Restaurante]! 🍽️ Posso responder suas dúvidas sobre nosso restaurante!',
      flows: [
        {
          id: 'cardapio',
          name: 'Cardápio',
          trigger: ['cardápio', 'menu', 'pratos', 'comida', 'tem', 'serve'],
          responses: [
            'Nosso cardápio é delicioso! 😋',
            'Temos diversas opções:',
            '• Pratos principais\n• Petiscos\n• Sobremesas\n• Bebidas',
            'Quer ver nosso cardápio completo? [link do cardápio]'
          ]
        },
        {
          id: 'delivery',
          name: 'Delivery',
          trigger: ['delivery', 'entrega', 'pedido', 'iFood', 'uber'],
          responses: [
            'Fazemos delivery sim! 🛵',
            'Você pode pedir pelos apps:',
            '• iFood\n• Uber Eats\n• Rappi',
            'Ou pelo nosso WhatsApp: (11) 99999-9999'
          ]
        },
        {
          id: 'horarios-rest',
          name: 'Horários',
          trigger: ['horário', 'aberto', 'fechado', 'funcionamento'],
          responses: [
            'Nossos horários: 🕐',
            '• Segunda a Quinta: 11h às 23h',
            '• Sexta e Sábado: 11h às 00h',
            '• Domingo: 11h às 22h'
          ]
        },
        {
          id: 'reservas',
          name: 'Reservas',
          trigger: ['reserva', 'mesa', 'reservar', 'agendar'],
          responses: [
            'Claro! Fazemos reservas! 📞',
            'Para reservar uma mesa:',
            '• Ligue: (11) 99999-9999',
            '• WhatsApp: (11) 99999-9999',
            'Qual dia e horário você gostaria?'
          ]
        }
      ],
      fallbackMessage: 'Posso ajudar com cardápio, delivery, horários, reservas e outras informações. O que você gostaria de saber?'
    }
  }
];

export const getTemplatesByCategory = (category: 'ecommerce' | 'empresa' | 'faq') => {
  return templates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(template => template.id === id);
};
