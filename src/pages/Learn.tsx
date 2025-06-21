
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Learn = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Bem-vindo ao Nylo!',
      content: (
        <div className="space-y-4">
          <p className="text-nylo-gray-700">
            O Nylo é uma ferramenta intuitiva para criar chatbots de atendimento automático usando nossa linguagem própria, a <strong>NyloLang</strong>.
          </p>
          <div className="bg-gradient-to-r from-nylo-blue/10 to-nylo-cyan/10 p-4 rounded-lg">
            <h4 className="font-semibold text-nylo-black mb-2">O que você vai aprender:</h4>
            <ul className="space-y-1 text-sm text-nylo-gray-700">
              <li>• Como funciona a linguagem NyloLang</li>
              <li>• Criação de fluxos conversacionais</li>
              <li>• Uso do editor visual</li>
              <li>• Compartilhamento de chatbots</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Tokens da NyloLang',
      content: (
        <div className="space-y-4">
          <p className="text-nylo-gray-700">
            A NyloLang usa tokens simples para estruturar conversas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Badge className="bg-nylo-blue text-white">inicio:</Badge>
                <span className="text-sm text-nylo-gray-700">Ponto de entrada do chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-nylo-cyan text-white">mensagem:</Badge>
                <span className="text-sm text-nylo-gray-700">Define uma mensagem do bot</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-500 text-white">botao:</Badge>
                <span className="text-sm text-nylo-gray-700">Cria botões interativos</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Badge className="bg-purple-500 text-white">fluxo:</Badge>
                <span className="text-sm text-nylo-gray-700">Define novos fluxos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-orange-500 text-white">ir_para:</Badge>
                <span className="text-sm text-nylo-gray-700">Navega entre fluxos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-500 text-white">fim</Badge>
                <span className="text-sm text-nylo-gray-700">Finaliza o código</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Exemplo Prático',
      content: (
        <div className="space-y-4">
          <p className="text-nylo-gray-700">
            Vamos ver um exemplo completo de código NyloLang:
          </p>
          <div className="bg-nylo-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`inicio:
  mensagem:
    "Olá! Como posso te ajudar hoje?"
    botao 1:
      "Ver produtos" -> produtos
    botao 2:
      "Suporte técnico" -> suporte
    botao 3:
      "Falar com atendente" -> atendimento_humano

fluxo produtos:
  mensagem:
    "Aqui estão nossos produtos!"
    "Qual categoria te interessa?"
    botao 1:
      "Eletrônicos" -> eletronicos
    botao 2:
      "Roupas" -> roupas

fluxo suporte:
  mensagem:
    "Estou aqui para ajudar com problemas técnicos!"

fluxo atendimento_humano:
  mensagem:
    "Conectando com atendente..."
    "Por favor, informe seu nome:"

fim`}</pre>
          </div>
        </div>
      )
    },
    {
      title: 'Editor Visual',
      content: (
        <div className="space-y-4">
          <p className="text-nylo-gray-700">
            O Nylo oferece um editor visual que sincroniza automaticamente com seu código:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-nylo-black">🎨 Recursos do Editor:</h4>
              <ul className="space-y-2 text-sm text-nylo-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-nylo-blue rounded-full"></div>
                  <span>Syntax highlighting em tempo real</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-nylo-cyan rounded-full"></div>
                  <span>Autocomplete inteligente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Snippets de código prontos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Validação de sintaxe</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-nylo-black">🚀 Preview em Tempo Real:</h4>
              <ul className="space-y-2 text-sm text-nylo-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Teste seu chatbot instantaneamente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Interface de chat realista</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Testagem de fluxos completos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Compartilhamento',
      content: (
        <div className="space-y-4">
          <p className="text-nylo-gray-700">
            Após criar seu chatbot, você pode compartilhá-lo facilmente:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-nylo-blue/20 bg-nylo-blue/5">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">🔗</span>
                </div>
                <h4 className="font-semibold text-nylo-black mb-2">Link Público</h4>
                <p className="text-sm text-nylo-gray-600">
                  Gere um link único (nylo.app/id) para compartilhar
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-nylo-cyan/20 bg-nylo-cyan/5">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-nylo-cyan rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">📱</span>
                </div>
                <h4 className="font-semibold text-nylo-black mb-2">QR Code</h4>
                <p className="text-sm text-nylo-gray-600">
                  Código QR para acesso rápido no celular
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">💻</span>
                </div>
                <h4 className="font-semibold text-nylo-black mb-2">Embed Code</h4>
                <p className="text-sm text-nylo-gray-600">
                  Incorpore diretamente em seu site
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: 'Pronto para Começar!',
      content: (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 gradient-blue rounded-2xl flex items-center justify-center mx-auto nylo-glow">
            <span className="text-3xl">🎉</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-nylo-black mb-2">
              Parabéns! Você completou o tutorial
            </h3>
            <p className="text-nylo-gray-700">
              Agora você está pronto para criar chatbots incríveis com o Nylo!
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="gradient-blue hover:opacity-90 nylo-shadow w-full sm:w-auto"
            >
              Ir para o Dashboard
            </Button>
            <div className="text-sm text-nylo-gray-600">
              Ou continue explorando os recursos
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-nylo-blue/5 via-white to-nylo-cyan/5">
      {/* Header */}
      <header className="border-b border-nylo-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-nylo-gray-600 hover:text-nylo-blue"
              >
                ← Voltar
              </Button>
              <div>
                <h1 className="text-lg font-semibold gradient-text">Aprenda Nylo</h1>
                <p className="text-sm text-nylo-gray-600">Tutorial interativo passo-a-passo</p>
              </div>
            </div>
            <Badge variant="outline" className="text-nylo-blue border-nylo-blue/20">
              {currentStep + 1} de {tutorialSteps.length}
            </Badge>
          </div>
        </div>
      </header>

      {/* Tutorial Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-nylo-gray-700">Progresso</span>
            <span className="text-sm text-nylo-gray-600">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-0 nylo-shadow mb-8">
          <CardHeader>
            <CardTitle className="gradient-text text-2xl">
              {tutorialSteps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            {tutorialSteps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-nylo-gray-200"
          >
            ← Anterior
          </Button>
          
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-nylo-blue' : 'bg-nylo-gray-200'
                }`}
              />
            ))}
          </div>

          {currentStep < tutorialSteps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="gradient-blue hover:opacity-90"
            >
              Próximo →
            </Button>  
          ) : (
            <Button
              onClick={() => navigate('/dashboard')}
              className="gradient-blue hover:opacity-90"
            >
              Finalizar →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;
