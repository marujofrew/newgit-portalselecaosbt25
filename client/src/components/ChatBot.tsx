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
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    transport: {
      aviao: "Perfeito! Voo é mais rápido. De qual cidade você estará partindo? Preciso saber sua cidade de origem para buscar os melhores voos.",
      onibus: "Ótima escolha! Ônibus é confortável. De qual cidade você estará partindo? Preciso saber para verificar as rotas disponíveis."
    },
    city: {
      response: "Excelente! Agora sobre hospedagem - você prefere ficar em hotel próximo aos estúdios ou em hotel no centro de São Paulo? O hotel próximo aos estúdios facilita o deslocamento, enquanto o do centro oferece mais opções de lazer."
    },
    hotel: {
      proximo: "Perfeita escolha! Hotel próximo aos estúdios facilita muito. Agora, quantas pessoas viajarão? (Responsável + quantas crianças?)",
      centro: "Ótima opção! Centro de SP tem muito a oferecer. Agora, quantas pessoas viajarão? (Responsável + quantas crianças?)"
    },
    people: {
      response: "Entendido! Vou organizar acomodações para [X] pessoas. Para finalizar, você tem alguma restrição alimentar ou necessidade especial que devemos considerar? (Pode responder 'não' se não houver)"
    },
    final: {
      response: "Perfeito! Tenho todas as informações necessárias:\n\n✅ Transporte: [TRANSPORTE]\n✅ Origem: [CIDADE]\n✅ Hospedagem: [HOTEL]\n✅ Pessoas: [PESSOAS]\n✅ Observações: [OBS]\n\nEm até 24 horas você receberá um e-mail com:\n• Passagens/bilhetes confirmados\n• Voucher do hotel\n• Roteiro detalhado\n• Contato de emergência\n\nObrigado e até breve nos estúdios do SBT! 🎬"
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addMessage(inputMessage, 'user');
    
    // Processar resposta do bot baseado no step atual
    setTimeout(() => {
      let botResponse = '';
      
      switch (currentStep) {
        case 'transport':
          if (inputMessage.toLowerCase().includes('aviao') || inputMessage.toLowerCase().includes('avião')) {
            botResponse = botResponses.transport.aviao;
          } else if (inputMessage.toLowerCase().includes('onibus') || inputMessage.toLowerCase().includes('ônibus')) {
            botResponse = botResponses.transport.onibus;
          } else {
            botResponse = "Por favor, escolha entre 'avião' ou 'ônibus' para que eu possa te ajudar melhor.";
          }
          if (botResponse !== "Por favor, escolha entre 'avião' ou 'ônibus' para que eu possa te ajudar melhor.") {
            setCurrentStep('city');
          }
          break;
          
        case 'city':
          botResponse = botResponses.city.response;
          setCurrentStep('hotel');
          break;
          
        case 'hotel':
          if (inputMessage.toLowerCase().includes('proximo') || inputMessage.toLowerCase().includes('próximo') || inputMessage.toLowerCase().includes('estudio')) {
            botResponse = botResponses.hotel.proximo;
          } else if (inputMessage.toLowerCase().includes('centro')) {
            botResponse = botResponses.hotel.centro;
          } else {
            botResponse = "Por favor, escolha entre 'hotel próximo aos estúdios' ou 'hotel no centro'.";
          }
          if (botResponse !== "Por favor, escolha entre 'hotel próximo aos estúdios' ou 'hotel no centro'.") {
            setCurrentStep('people');
          }
          break;
          
        case 'people':
          botResponse = botResponses.people.response;
          setCurrentStep('final');
          break;
          
        case 'final':
          botResponse = botResponses.final.response;
          break;
      }
      
      addMessage(botResponse, 'bot');
    }, 1000);

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
          <div ref={messagesEndRef} />
        </div>

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
              onClick={handleSendMessage}
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