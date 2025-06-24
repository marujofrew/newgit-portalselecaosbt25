// Sistema de armazenamento do ChatBot
// Gerencia o estado completo da conversa entre páginas

interface ChatMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
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

const STORAGE_KEY = 'sbt_chat_state';

export class ChatStorage {
  // Salvar estado completo da conversa
  static saveState(state: Partial<ChatState>): void {
    try {
      const currentState = this.getState();
      const updatedState: ChatState = {
        ...currentState,
        ...state,
        timestamp: Date.now()
      };
      
      // Converter Date objects para strings antes de salvar
      const stateToSave = {
        ...updatedState,
        messages: updatedState.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }))
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      console.log('Estado do chat salvo:', updatedState);
    } catch (error) {
      console.error('Erro ao salvar estado do chat:', error);
    }
  }

  // Recuperar estado completo da conversa
  static getState(): ChatState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        
        // Converter strings de volta para Date objects
        const messagesWithDates = parsedState.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        return {
          ...parsedState,
          messages: messagesWithDates
        };
      }
    } catch (error) {
      console.error('Erro ao recuperar estado do chat:', error);
    }
    
    // Estado inicial padrão
    return {
      messages: [],
      currentStep: 'greeting',
      showQuickOptions: false,
      isTyping: false,
      showPaymentStatus: false,
      paymentTimer: 0,
      selectedTransport: '',
      selectedFlightOption: '',
      hasBaggage: false,
      nearestAirport: null,
      isInitialized: false,
      timestamp: Date.now()
    };
  }

  // Verificar se existe conversa salva
  static hasConversation(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    
    try {
      const state = JSON.parse(saved);
      const hasMessages = state.messages && state.messages.length > 0;
      const isInitialized = state.isInitialized;
      console.log('Verificando conversa existente:', { hasMessages, isInitialized, messagesCount: state.messages?.length });
      return hasMessages && isInitialized;
    } catch (error) {
      console.error('Erro ao verificar conversa:', error);
      return false;
    }
  }

  // Limpar conversa (apenas quando necessário)
  static clearConversation(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Conversa do chat limpa');
  }

  // Atualizar apenas as mensagens
  static addMessage(message: ChatMessage): void {
    const state = this.getState();
    state.messages.push(message);
    this.saveState(state);
  }

  // Atualizar step atual
  static updateStep(step: string): void {
    this.saveState({ currentStep: step });
  }

  // Atualizar opções de resposta
  static updateQuickOptions(show: boolean): void {
    this.saveState({ showQuickOptions: show });
  }

  // Atualizar status de digitação
  static updateTyping(isTyping: boolean): void {
    this.saveState({ isTyping });
  }

  // Atualizar seleções do usuário
  static updateSelections(selections: Partial<ChatState>): void {
    this.saveState(selections);
  }

  // Debug: mostrar estado atual
  static debugState(): void {
    console.log('Estado atual do chat:', this.getState());
  }
}