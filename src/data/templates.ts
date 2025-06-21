
export interface Template {
  id: string;
  name: string;
  category: 'ecommerce' | 'empresa' | 'faq';
  description: string;
  preview: string;
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
