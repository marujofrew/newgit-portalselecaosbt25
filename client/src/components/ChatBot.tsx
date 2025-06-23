import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

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

export default function ChatBot({ isOpen, onClose, userCity, userData, selectedDate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('greeting');
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
      setMessages([]);
      setCurrentStep('greeting');
      setShowQuickOptions(false);
      setIsTyping(false);
      setShowPaymentStatus(false);
      setPaymentTimer(0);

      // Mensagem inicial simples
      const welcomeMessage: Message = {
        id: Date.now(),
        text: "Sistema temporariamente indisponível. Aguarde novas instruções.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setShowQuickOptions(false);
    }
  }, [isOpen, isInitialized]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getQuickOptions = () => {
    switch (currentStep) {
      case 'greeting':
        return [];
      default:
        return [];
    }
  };

  const handleSendMessage = (messageToSend: string) => {
    if (!messageToSend.trim()) return;

    addMessage(messageToSend, 'user');
    
    let botResponse = "Sistema temporariamente indisponível. Aguarde novas instruções.";
    let nextStep = 'greeting';
    let showOptions = false;

    switch (currentStep) {
      case 'greeting':
        botResponse = "Sistema temporariamente indisponível. Aguarde novas instruções.";
        showOptions = false;
        break;
      
      default:
        botResponse = "Sistema temporariamente indisponível. Aguarde novas instruções.";
        showOptions = false;
    }

    setTimeout(() => {
      addMessage(botResponse, 'bot');
      setCurrentStep(nextStep);
      setShowQuickOptions(showOptions);
    }, 1000);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <h3 className="font-semibold">Rebeca - Assistente SBT</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Payment Status */}
        {showPaymentStatus && (
          <div className="bg-yellow-100 border border-yellow-300 p-3 m-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-800 text-sm font-medium">
                Aguardando retorno
              </span>
              <span className="text-yellow-600 text-sm">
                Tempo de inatividade: {Math.floor(paymentTimer / 60)}:{(paymentTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

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
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="text-sm">
                  {formatMessage(message.text)}
                </div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                  onClick={() => handleSendMessage(option)}
                  className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input (disabled for now) */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              disabled
              placeholder="Sistema indisponível..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-500"
            />
            <button
              disabled
              className="bg-gray-400 text-white p-3 rounded-lg cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}