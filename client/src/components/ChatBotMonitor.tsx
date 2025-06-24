
import React, { useState, useEffect } from 'react';

interface ChatBotState {
  messages: any[];
  currentStep: string;
  showQuickOptions: boolean;
  isTyping: boolean;
  showPaymentStatus: boolean;
  paymentTimer: number;
  selectedTransport: string;
  selectedFlightOption: string;
  hasBaggage: boolean;
  nearestAirport: any;
  isInitialized: boolean;
  timestamp: number;
}

const ChatBotMonitor = () => {
  const [chatState, setChatState] = useState<ChatBotState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkChatState = () => {
      const savedState = localStorage.getItem('chatBotPersistentState');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          setChatState(state);
        } catch (error) {
          console.error('Erro ao verificar estado do chatbot:', error);
        }
      } else {
        setChatState(null);
      }
    };

    // Verificar estado inicial
    checkChatState();

    // Verificar estado a cada 2 segundos
    const interval = setInterval(checkChatState, 2000);

    return () => clearInterval(interval);
  }, []);

  // Só mostrar se houver dados de desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-2 rounded-lg text-xs opacity-70 hover:opacity-100"
      >
        Monitor Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 max-w-sm shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-sm">ChatBot Monitor</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ✕
        </button>
      </div>
      
      {chatState ? (
        <div className="text-xs space-y-1">
          <div><strong>Estado:</strong> {chatState.currentStep}</div>
          <div><strong>Mensagens:</strong> {chatState.messages?.length || 0}</div>
          <div><strong>Transporte:</strong> {chatState.selectedTransport || 'N/A'}</div>
          <div><strong>Bagagem:</strong> {chatState.hasBaggage ? 'Sim' : 'Não'}</div>
          <div><strong>Opções Visíveis:</strong> {chatState.showQuickOptions ? 'Sim' : 'Não'}</div>
          <div><strong>Último Update:</strong> {new Date(chatState.timestamp).toLocaleTimeString()}</div>
          
          <button
            onClick={() => {
              localStorage.removeItem('chatBotPersistentState');
              setChatState(null);
              console.log('🗑️ Estado do chatbot limpo via monitor');
            }}
            className="w-full mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Limpar Estado
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-500">
          Nenhuma conversa salva
        </div>
      )}
    </div>
  );
};

export default ChatBotMonitor;
