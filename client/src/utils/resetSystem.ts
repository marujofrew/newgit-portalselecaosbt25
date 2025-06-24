/**
 * Sistema de Reset Completo
 * 
 * Limpa todas as informações do sistema quando uma inscrição é confirmada,
 * permitindo que um novo usuário faça uma nova inscrição do zero.
 */

import { ChatStorage } from './chatStorage';

export function resetCompleteSystem() {
  console.log('🔄 Iniciando reset completo do sistema...');
  
  // Lista de todas as chaves do localStorage usadas pelo sistema
  const keysToRemove = [
    // Dados do cadastro
    'responsavelData',
    'candidatos',
    'selectedDate',
    'userCity',
    'nearestAirport',
    
    // Estado do agendamento
    'agendamentoConfirmado',
    'agendamentoData',
    
    // Dados do chat
    'chatState',
    'chatMessages',
    'chatStep',
    'chatTransport',
    'chatFlight',
    'chatBaggage',
    
    // Dados de pagamento
    'pixPaymentStatus',
    'pixPaymentId',
    'paymentData',
    
    // Dados dos cartões de embarque
    'boardingPassData',
    'flightData',
    'passengersData',
    
    // Estados temporários
    'currentStep',
    'formProgress',
    'loadingStates'
  ];
  
  // Remover todas as chaves específicas
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    }
  });
  
  // Limpar estado do chat usando ChatStorage
  ChatStorage.clearConversation();
  console.log('🗑️ Estado do chat limpo');
  
  // Limpar qualquer timer ou estado em memória
  if (typeof window !== 'undefined') {
    // Limpar timers que possam estar rodando
    for (let i = 1; i < 99999; i++) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }
    console.log('🗑️ Timers limpos');
  }
  
  console.log('✅ Reset completo do sistema finalizado');
}

export function resetPartialSystem() {
  console.log('🔄 Iniciando reset parcial (apenas dados de sessão)...');
  
  // Manter dados básicos mas limpar estado atual
  const keysToKeep = ['responsavelData', 'candidatos'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  ChatStorage.clearConversation();
  console.log('✅ Reset parcial finalizado');
}

export function isSystemClean(): boolean {
  const criticalKeys = ['responsavelData', 'chatState', 'agendamentoConfirmado'];
  return !criticalKeys.some(key => localStorage.getItem(key));
}

export function getSystemState(): Record<string, any> {
  const allKeys = Object.keys(localStorage);
  const state: Record<string, any> = {};
  
  allKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        // Tentar fazer parse como JSON, se falhar usar como string
        try {
          state[key] = JSON.parse(value);
        } catch {
          state[key] = value;
        }
      }
    } catch (error) {
      console.warn(`Erro ao ler chave ${key}:`, error);
    }
  });
  
  return state;
}