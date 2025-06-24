import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { ChatPersistence } from '../utils/chatPersistence';
import rebecaAvatar from '@assets/telemarketing_reproduz_1750494256177.jpg';

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

export default function ChatBotNovo({ isOpen, onClose, userCity, userData, selectedDate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedFlightOption, setSelectedFlightOption] = useState('');
  const [hasBaggage, setHasBaggage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sistema de persistência simplificado e robusto
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
      
      console.log('🚀 INICIALIZANDO CHATBOT NOVO');
      
      const savedState = ChatPersistence.load();
      const isFromBoardingPass = ChatPersistence.isFromBoardingPass();
      
      console.log('Estado salvo:', {
        messages: savedState.messages.length,
        step: savedState.currentStep,
        transport: savedState.selectedTransport,
        fromBoardingPass: isFromBoardingPass
      });
      
      // Se há conversa ativa E vem da página de cartões
      if (savedState.messages.length > 0 && isFromBoardingPass) {
        console.log('🔄 RESTAURANDO CONVERSA COM CONTINUAÇÃO');
        
        // Restaurar estado completo
        setMessages(savedState.messages);
        setCurrentStep(savedState.currentStep);
        setSelectedTransport(savedState.selectedTransport);
        setSelectedFlightOption(savedState.selectedFlightOption);
        setHasBaggage(savedState.hasBaggage);
        
        // Determinar próxima etapa baseada no progresso
        let nextStep = savedState.currentStep;
        if (savedState.currentStep === 'greeting') {
          nextStep = 'transport';
        }
        
        // Adicionar mensagem de continuação apenas UMA VEZ
        setTimeout(() => {
          const continuationMsg: Message = {
            id: Date.now() + 99999,
            text: "Oi! Vi que você baixou os cartões de embarque. Vamos continuar nossa conversa de onde paramos?",
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, continuationMsg]);
          setCurrentStep(nextStep);
          
          // Ativar opções após 2 segundos
          setTimeout(() => {
            setShowQuickOptions(true);
            console.log('✅ OPÇÕES ATIVADAS PARA ETAPA:', nextStep);
          }, 2000);
          
        }, 1000);
        
        return;
      }
      
      // Se há conversa ativa mas NÃO vem da página de cartões
      if (savedState.messages.length > 0) {
        console.log('🔄 RESTAURANDO CONVERSA NORMAL');
        
        setMessages(savedState.messages);
        setCurrentStep(savedState.currentStep);
        setSelectedTransport(savedState.selectedTransport);
        setSelectedFlightOption(savedState.selectedFlightOption);
        setHasBaggage(savedState.hasBaggage);
        setShowQuickOptions(savedState.showQuickOptions);
        
        return;
      }
      
      // NOVA CONVERSA
      console.log('✨ INICIANDO NOVA CONVERSA');
      
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now(),
          text: "Olá! Sou a Rebeca, assistente da SBT. Preciso organizar sua viagem para São Paulo. Vamos começar com o transporte - você prefere viajar de avião ou Van?",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
        setCurrentStep('transport');
        setShowQuickOptions(true);
        
        ChatPersistence.save({
          messages: [welcomeMessage],
          currentStep: 'transport',
          showQuickOptions: true
        });
        
      }, 2000);
    }
  }, [isOpen, isInitialized]);

  // Auto-save apenas quando necessário
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      ChatPersistence.save({
        messages,
        currentStep,
        showQuickOptions,
        selectedTransport,
        selectedFlightOption,
        hasBaggage
      });
    }
  }, [messages, currentStep, selectedTransport, selectedFlightOption, hasBaggage, isInitialized]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    console.log('🎯 OPÇÃO CLICADA:', option, 'Etapa atual:', currentStep);
    
    setShowQuickOptions(false);
    addMessage(option, 'user');
    
    // Processar resposta baseada na etapa atual
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        handleBotResponse(option);
      }, 2000);
    }, 500);
  };

  const handleBotResponse = (userMessage: string) => {
    console.log('🤖 PROCESSANDO RESPOSTA:', userMessage, 'Etapa:', currentStep);
    
    switch (currentStep) {
      case 'transport':
        if (userMessage.includes('Avião')) {
          setSelectedTransport('avião');
          addMessage('Perfeito! Encontrei 2 opções de voos para você:', 'bot');
          setCurrentStep('flight-options');
          setTimeout(() => setShowQuickOptions(true), 1000);
        } else if (userMessage.includes('Van')) {
          setSelectedTransport('van');
          addMessage('Ótima escolha! A viagem de van é confortável e você conhece outras pessoas. Posso confirmar?', 'bot');
          setCurrentStep('van-confirmation');
          setTimeout(() => setShowQuickOptions(true), 1000);
        }
        break;
        
      case 'flight-options':
        addMessage('Excelente escolha! Vou organizar sua viagem de avião.', 'bot');
        setCurrentStep('baggage');
        setTimeout(() => {
          addMessage('Temos uma oferta especial de kit bagagem SBT-Azul por apenas R$ 29,90. Você gostaria?', 'bot');
          setShowQuickOptions(true);
        }, 2000);
        break;
        
      case 'van-confirmation':
        addMessage('Perfeito! Sua viagem de van está confirmada.', 'bot');
        setCurrentStep('van-baggage');
        setTimeout(() => {
          addMessage('Para a van, temos o programa "Bagagem do Bem" por R$ 29,90. Deseja adicionar?', 'bot');
          setShowQuickOptions(true);
        }, 2000);
        break;
        
      case 'baggage':
      case 'van-baggage':
        if (userMessage.includes('Sim')) {
          setHasBaggage(true);
          addMessage('Ótimo! O kit de bagagem foi adicionado por R$ 29,90.', 'bot');
        } else {
          setHasBaggage(false);
          addMessage('Sem problemas! Vamos continuar sem o kit de bagagem.', 'bot');
        }
        
        setCurrentStep('hotel');
        setTimeout(() => {
          addMessage('Agora vou organizar sua hospedagem no hotel SBT. Você ficará em quartos confortáveis com todas as refeições incluídas!', 'bot');
          setShowQuickOptions(true);
        }, 2000);
        break;
        
      case 'hotel':
        addMessage('Hospedagem confirmada! Agora vamos finalizar sua inscrição no programa.', 'bot');
        setCurrentStep('registration');
        setTimeout(() => {
          addMessage('O valor da inscrição é R$ 89,90. Deseja prosseguir com o pagamento via PIX?', 'bot');
          setShowQuickOptions(true);
        }, 2000);
        break;
        
      case 'registration':
        addMessage('Perfeito! Gerando QR Code para pagamento...', 'bot');
        setCurrentStep('payment');
        setTimeout(() => {
          addMessage('Pagamento confirmado! Sua inscrição foi realizada com sucesso. Todos os documentos serão enviados para seu WhatsApp.', 'bot');
          setTimeout(() => {
            window.location.href = '/confirmacao-inscricao';
          }, 3000);
        }, 5000);
        break;
        
      default:
        addMessage('Desculpe, não entendi. Pode repetir?', 'bot');
        setShowQuickOptions(true);
    }
  };

  const getQuickOptions = () => {
    switch (currentStep) {
      case 'transport':
        return ['✈️ Avião', '🚐 Van'];
      case 'flight-options':
        return ['Opção 1 - Manhã', 'Opção 2 - Tarde'];
      case 'van-confirmation':
        return ['Sim, confirmar Van'];
      case 'baggage':
      case 'van-baggage':
        return ['Sim, quero o kit!', 'Não, obrigado'];
      case 'hotel':
        return ['Continuar'];
      case 'registration':
        return ['Sim, pagar via PIX'];
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={rebecaAvatar} 
                alt="Rebeca"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-base">Rebeca - Assistente SBT</h3>
              <p className="text-xs text-blue-100">Online agora</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
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
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-2">
              {getQuickOptions().map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}