// Sistema robusto de persistência do ChatBot
export interface ChatState {
  messages: any[];
  currentStep: string;
  showQuickOptions: boolean;
  selectedTransport: string;
  selectedFlightOption: string;
  hasBaggage: boolean;
  timestamp: number;
  sessionId: string;
  conversationProgress: number; // 0-100% de progresso na conversa
}

export const ChatPersistence = {
  // Salvar estado
  save: (state: Partial<ChatState>) => {
    try {
      const currentState = ChatPersistence.load();
      const newState = {
        ...currentState,
        ...state,
        timestamp: Date.now(),
        sessionId: currentState.sessionId || Date.now().toString()
      };
      
      localStorage.setItem('chatBotState', JSON.stringify(newState));
      console.log('✅ Estado salvo:', {
        step: newState.currentStep,
        messages: newState.messages?.length || 0,
        transport: newState.selectedTransport,
        options: newState.showQuickOptions
      });
      
      return newState;
    } catch (error) {
      console.error('❌ Erro ao salvar estado:', error);
      return null;
    }
  },

  // Carregar estado
  load: (): ChatState => {
    try {
      const saved = localStorage.getItem('chatBotState');
      if (!saved) {
        return ChatPersistence.getDefaultState();
      }

      const state = JSON.parse(saved);
      
      // Verificar se é um estado válido (não muito antigo)
      const age = Date.now() - (state.timestamp || 0);
      if (age > 24 * 60 * 60 * 1000) { // 24 horas
        console.log('🕐 Estado muito antigo, criando novo');
        ChatPersistence.clear();
        return ChatPersistence.getDefaultState();
      }

      // Converter timestamps das mensagens
      if (state.messages) {
        state.messages = state.messages.map((msg: any) => ({
          ...msg,
          timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
        }));
      }

      console.log('✅ Estado carregado:', {
        step: state.currentStep,
        messages: state.messages?.length || 0,
        transport: state.selectedTransport,
        sessionId: state.sessionId
      });

      return state;
    } catch (error) {
      console.error('❌ Erro ao carregar estado:', error);
      ChatPersistence.clear();
      return ChatPersistence.getDefaultState();
    }
  },

  // Estado padrão
  getDefaultState: (): ChatState => ({
    messages: [],
    currentStep: 'greeting',
    showQuickOptions: false,
    selectedTransport: '',
    selectedFlightOption: '',
    hasBaggage: false,
    timestamp: Date.now(),
    sessionId: Date.now().toString(),
    conversationProgress: 0
  }),

  // Limpar estado
  clear: () => {
    localStorage.removeItem('chatBotState');
    localStorage.removeItem('chatBotAtBoardingPass');
    console.log('🗑️ Estado do chat limpo');
  },

  // Verificar se há uma conversa ativa
  hasActiveConversation: (): boolean => {
    const state = ChatPersistence.load();
    return state.messages.length > 1 || state.currentStep !== 'greeting';
  },

  // Marcar que está na página de cartões
  markAtBoardingPass: () => {
    localStorage.setItem('chatBotAtBoardingPass', 'true');
    console.log('📋 Marcado como na página de cartões');
  },

  // Verificar se vem da página de cartões
  isFromBoardingPass: (): boolean => {
    const result = localStorage.getItem('chatBotAtBoardingPass') === 'true';
    if (result) {
      localStorage.removeItem('chatBotAtBoardingPass');
      console.log('📋 Removido marcador de página de cartões');
    }
    return result;
  }
};