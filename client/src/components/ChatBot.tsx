import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  userCity?: string;
  userData?: any;
  selectedDate?: string;
}

import { getCoordinatesFromCEP, findNearestAirport } from '@/utils/airports';

export default function ChatBot({ isOpen, onClose, userCity, userData, selectedDate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Parabéns pelo agendamento confirmado! 🎉 Agora vou te ajudar com os próximos passos para sua viagem aos estúdios do SBT.",
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "O SBT irá custear suas passagens e hospedagem. Para isso, preciso de algumas informações. Você prefere viajar de avião ou ônibus?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('transport');
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [nearestAirport, setNearestAirport] = useState<any>(null);
  const [flightDate, setFlightDate] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    transport: {
      aviao: `Perfeito! Voo é mais rápido. Vejo que você está em ${userCity}. Vou buscar os melhores voos saindo do aeroporto mais próximo de você para São Paulo.`,
      onibus: `Ótima escolha! Ônibus é confortável. Vejo que você está em ${userCity}. Vou verificar as rotas disponíveis desta cidade para São Paulo.`
    },
    city: {
      response: "Excelente! Agora sobre hospedagem - você prefere ficar em hotel próximo aos estúdios ou em hotel no centro de São Paulo? O hotel próximo aos estúdios facilita o deslocamento, enquanto o do centro oferece mais opções de lazer."
    },
    hotel: {
      proximo: "Perfeita escolha! Hotel próximo aos estúdios facilita muito. Agora, quantas pessoas viajarão?",
      centro: "Ótima opção! Centro de SP tem muito a oferecer. Agora, quantas pessoas viajarão?"
    },
    people: {
      response: "Entendido! Para finalizar, você tem alguma restrição alimentar ou necessidade especial que devemos considerar?"
    },
    final: {
      response: "Perfeito! Tenho todas as informações necessárias:\n\n✅ Transporte: [TRANSPORTE]\n✅ Origem: [CIDADE]\n✅ Hospedagem: [HOTEL]\n✅ Pessoas: [PESSOAS]\n✅ Observações: [OBS]\n\nEm até 24 horas você receberá um e-mail com:\n• Passagens/bilhetes confirmados\n• Voucher do hotel\n• Roteiro detalhado\n• Contato de emergência\n\nObrigado e até breve nos estúdios do SBT! 🎬"
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calcular aeroporto mais próximo quando o componente abrir
  useEffect(() => {
    if (isOpen && userData?.cep && !nearestAirport) {
      findNearestAirportFromCEP();
    }
    if (selectedDate) {
      calculateFlightDate();
    }
  }, [isOpen, userData, selectedDate]);

  const findNearestAirportFromCEP = async () => {
    if (!userData?.cep) return;
    
    try {
      const coordinates = await getCoordinatesFromCEP(userData.cep.replace('-', ''));
      if (coordinates) {
        const airport = findNearestAirport(coordinates.latitude, coordinates.longitude);
        setNearestAirport(airport);
      }
    } catch (error) {
      console.error('Erro ao encontrar aeroporto:', error);
    }
  };

  const calculateFlightDate = () => {
    if (!selectedDate) return;
    
    const appointmentDate = new Date(selectedDate);
    const flightDateObj = new Date(appointmentDate);
    flightDateObj.setDate(appointmentDate.getDate() - 2);
    
    const formattedDate = flightDateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    setFlightDate(formattedDate);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(), // Use timestamp + random to ensure uniqueness
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickOption = (option: string) => {
    setInputMessage(option);
    setShowQuickOptions(false);
    handleSendMessage(option);
  };

  const getQuickOptions = () => {
    switch (currentStep) {
      case 'transport':
        return ['Avião', 'Ônibus'];
      case 'hotel':
        return ['Hotel próximo aos estúdios', 'Hotel no centro'];
      case 'people':
        return ['2 pessoas (1 responsável + 1 criança)', '3 pessoas (1 responsável + 2 crianças)', '4 pessoas (2 responsáveis + 2 crianças)', 'Outro número'];
      case 'final':
        return ['Não tenho restrições', 'Tenho restrições alimentares'];
      default:
        return [];
    }
  };

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    addMessage(messageToSend, 'user');
    setIsTyping(true);
    setShowQuickOptions(false);
    
    // Processar resposta do bot baseado no step atual com delay de 4 segundos
    setTimeout(() => {
      setIsTyping(false);
      let botResponse = '';
      let nextStep = currentStep;
      let showOptions = false;
      
      switch (currentStep) {
        case 'transport':
          if (messageToSend.toLowerCase().includes('aviao') || messageToSend.toLowerCase().includes('avião')) {
            botResponse = botResponses.transport.aviao;
            nextStep = 'city';
            
            // Após 4 segundos, enviar informação sobre o voo encontrado
            setTimeout(() => {
              if (nearestAirport && flightDate) {
                const flightInfo = `✈️ Encontrei uma passagem que sai do ${nearestAirport.name} (${nearestAirport.code}) para São Paulo no dia ${flightDate}. Voo confirmado!`;
                addMessage(flightInfo, 'bot');
              }
            }, 4000);
            
          } else if (messageToSend.toLowerCase().includes('onibus') || messageToSend.toLowerCase().includes('ônibus')) {
            botResponse = botResponses.transport.onibus;
            nextStep = 'city';
          } else {
            botResponse = "Por favor, escolha uma das opções acima para que eu possa te ajudar melhor.";
            showOptions = true;
          }
          break;
          
        case 'city':
          botResponse = botResponses.city.response;
          nextStep = 'hotel';
          showOptions = true;
          break;
          
        case 'hotel':
          if (messageToSend.toLowerCase().includes('proximo') || messageToSend.toLowerCase().includes('próximo') || messageToSend.toLowerCase().includes('estudio')) {
            botResponse = botResponses.hotel.proximo;
            nextStep = 'people';
            showOptions = true;
          } else if (messageToSend.toLowerCase().includes('centro')) {
            botResponse = botResponses.hotel.centro;
            nextStep = 'people';
            showOptions = true;
          } else {
            botResponse = "Por favor, escolha uma das opções acima.";
            showOptions = true;
          }
          break;
          
        case 'people':
          botResponse = botResponses.people.response;
          nextStep = 'final';
          showOptions = true;
          break;
          
        case 'final':
          botResponse = botResponses.final.response;
          showOptions = false;
          break;
      }
      
      addMessage(botResponse, 'bot');
      setCurrentStep(nextStep);
      setShowQuickOptions(showOptions);
    }, 4000);

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <img 
                src="attached_assets/telemarketing_reproduz_1750494256177.jpg"
                alt="Rebeca"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold">Rebeca - Assistente SBT</h3>
              <p className="text-xs text-blue-100">Ajuda com viagem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Options */}
        {showQuickOptions && getQuickOptions().length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {getQuickOptions().map((option, index) => (
                <button
                  key={`option-${currentStep}-${index}-${option}`}
                  onClick={() => handleQuickOption(option)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua resposta..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}