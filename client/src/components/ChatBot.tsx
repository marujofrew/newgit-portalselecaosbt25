import { useState, useRef, useEffect } from 'react';
import { generateQRVisualPattern } from '../utils/qrcode';

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
import type { Airport } from '@/utils/airports';

export default function ChatBot({ isOpen, onClose, userCity, userData, selectedDate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('transport');
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nearestAirport, setNearestAirport] = useState<Airport | null>(null);
  const [flightDate, setFlightDate] = useState<string>('');
  const [lastModalState, setLastModalState] = useState<{type: string, data: any} | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(120);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    transport: {
      aviao: `Perfeito! Voo é mais rápido. Vou buscar os melhores voos saindo do aeroporto mais próximo de você para São Paulo.`,
      onibus: `Ótima escolha! Viagem de ônibus é mais econômica. Vou organizar sua passagem de ônibus para São Paulo.`
    },
    hotel: {
      proximos: `Excelente! Hotel próximo aos estúdios é mais prático. Você ficará no Hotel Maksoud Plaza, a apenas 15 minutos dos estúdios SBT.`,
      centro: `Boa escolha! Hotel no centro oferece mais opções. Você ficará no Hotel Copacabana, no coração de São Paulo.`
    },
    people: {
      response: `Perfeito! Já tenho a quantidade de pessoas. Agora preciso saber sobre restrições alimentares - você ou as crianças têm alguma restrição alimentar específica?`
    },
    final: {
      response: "Perfeito! Tenho todas as informações necessárias. Em até 24 horas você receberá um e-mail com passagens/bilhetes confirmados, voucher do hotel, roteiro detalhado e contato de emergência. Obrigado e até breve nos estúdios do SBT!"
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Salvar estado atual
  const saveCurrentState = () => {
    if (messages.length > 0) {
      const state = {
        messages,
        currentStep,
        showQuickOptions,
        nearestAirport,
        flightDate,
        lastModalState,
        conversationStarted
      };
      localStorage.setItem('chatBotState', JSON.stringify(state));
    }
  };

  // Restaurar estado salvo
  const restoreState = () => {
    const savedState = localStorage.getItem('chatBotState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.messages && state.messages.length > 0) {
          const messagesWithDates = state.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          
          setMessages(messagesWithDates);
          setCurrentStep(state.currentStep || 'transport');
          setShowQuickOptions(state.showQuickOptions || false);
          setNearestAirport(state.nearestAirport || null);
          setFlightDate(state.flightDate || '');
          setLastModalState(state.lastModalState || null);
          setConversationStarted(true);
          
          // Reabrir modal se estava aberto
          if (state.lastModalState && state.lastModalState.type === 'boardingPass') {
            setTimeout(() => {
              if ((window as any).openBoardingPass) {
                (window as any).openBoardingPass(
                  state.lastModalState.data.passId,
                  state.lastModalState.data.passengerName,
                  state.lastModalState.data.isAdult
                );
              }
            }, 500);
          }
          
          return true;
        }
      } catch (error) {
        localStorage.removeItem('chatBotState');
        return false;
      }
    }
    return false;
  };

  // Salvar estado automaticamente
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      saveCurrentState();
    }
  }, [messages, currentStep, showQuickOptions, nearestAirport, flightDate, lastModalState, conversationStarted, isOpen]);

  // Funções globais para cartões de embarque
  useEffect(() => {
    (window as any).openBoardingPass = (passId: string, passengerName: string, isAdult: boolean) => {
      if (setLastModalState) {
        setLastModalState({
          type: 'boardingPass',
          data: { passId, passengerName, isAdult }
        });
      }
      
      const modalHTML = `
        <div id="boarding-pass-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(4px);">
          <div style="background: white; border-radius: 20px; padding: 20px; max-width: 90vw; max-height: 90vh; overflow: auto; position: relative;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 18px;">Cartão de Embarque</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px;">Clique em "Salvar" e aguarde 3 segundos para retornar</p>
            </div>
            ${createBoardingPassHTML(passengerName, isAdult)}
            <div style="text-align: center; margin-top: 20px;">
              <button onclick="window.saveBoardingPass('${passengerName}', 'AD2768')" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                💾 Salvar Cartão
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    (window as any).closeBoardingPass = () => {
      const modal = document.getElementById('boarding-pass-modal');
      if (modal) {
        modal.remove();
      }
      if (setLastModalState) {
        setLastModalState(null);
      }
      // Limpar funções de navegação
      delete (window as any).prevCard;
      delete (window as any).nextCard;
      delete (window as any).downloadStackedCards;
    };

    // Definir função global para cartões unificados
    (window as any).openUnifiedBoardingPass = (passengersJson: string) => {
      console.log('Opening unified boarding pass with:', passengersJson);
      
      try {
        const passengers = JSON.parse(passengersJson.replace(/&quot;/g, '"'));
        console.log('Passengers parsed:', passengers);
        
        let currentIndex = 0;
        let autoCloseTimer: NodeJS.Timeout;
        
        const createModalHTML = (index: number) => {
          const passenger = passengers[index];
          const seatNumber = `${index + 1}D`;
          
          return `
            <div id="boarding-pass-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(4px);">
              <div style="background: white; border-radius: 20px; padding: 20px; max-width: 90vw; max-height: 90vh; overflow: auto; position: relative;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 18px;">Cartões de Embarque (${index + 1}/${passengers.length})</h2>
                  <p style="color: #64748b; margin: 0; font-size: 14px;">${passenger.name} - ${passenger.type}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <button onclick="window.prevCard()" ${index === 0 ? 'disabled' : ''} style="background: ${index === 0 ? '#d1d5db' : '#6b7280'}; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: ${index === 0 ? 'not-allowed' : 'pointer'};">
                    ← Anterior
                  </button>
                  <span style="color: #374151; font-weight: 500;">${passenger.name}</span>
                  <button onclick="window.nextCard()" ${index === passengers.length - 1 ? 'disabled' : ''} style="background: ${index === passengers.length - 1 ? '#d1d5db' : '#6b7280'}; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: ${index === passengers.length - 1 ? 'not-allowed' : 'pointer'};">
                    Próximo →
                  </button>
                </div>
                
                <div style="width: 300px; height: 520px; background: #001f3f; border-radius: 12px; padding: 20px; color: white; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; position: relative; margin: 0 auto; box-shadow: 0 12px 32px rgba(0,0,0,0.4);">
                  
                  <!-- Header - Layout oficial -->
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
                    <img src="/attached_assets/azul-logo-02_1750506382633.png" alt="Azul" style="height: 24px; width: auto;" />
                    <div style="display: flex; align-items: flex-start; gap: 16px; text-align: center;">
                      <div>
                        <div style="font-size: 9px; color: #94a3b8; font-weight: 500; margin-bottom: 2px;">DATA</div>
                        <div style="font-size: 11px; font-weight: 600; color: white;">${new Date().toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div>
                        <div style="font-size: 9px; color: #94a3b8; font-weight: 500; margin-bottom: 2px;">VOO</div>
                        <div style="font-size: 11px; font-weight: 600; color: white;">2768</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- SEGUNDA PARTE: Aeroportos e informações principais -->
                  <div style="margin-bottom: 25px;">
                    <!-- Nomes das cidades em uma linha -->
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                      <div style="font-size: 10px; color: #94a3b8; font-weight: 500;">RECIFE</div>
                      <div style="font-size: 10px; color: #94a3b8; font-weight: 500;">SAO PAULO - GUARULHOS</div>
                    </div>
                    
                    <!-- Códigos dos aeroportos alinhados -->
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <div style="font-size: 48px; font-weight: 400; line-height: 1; color: white;">REC</div>
                      
                      <div style="display: flex; align-items: center; justify-content: center; margin: 0 15px;">
                        <div style="font-size: 20px; color: #60a5fa;">✈</div>
                      </div>
                      
                      <div style="font-size: 48px; font-weight: 400; line-height: 1; color: white;">GRU</div>
                    </div>
                    
                    <!-- Linha de informações de embarque -->
                    <div style="margin-bottom: 20px;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div style="text-align: left;">
                          <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">INÍCIO EMBARQUE</div>
                          <div style="font-size: 12px; font-weight: 600; color: white;">12:55</div>
                        </div>
                        <div style="text-align: center;">
                          <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">FIM EMBARQUE</div>
                          <div style="font-size: 12px; font-weight: 600; color: white;">13:20</div>
                        </div>
                        <div style="text-align: center;">
                          <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">SEÇÃO</div>
                          <div style="font-size: 12px; font-weight: 600; color: white;">D</div>
                        </div>
                        <div style="text-align: right;">
                          <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">ASSENTO</div>
                          <div style="font-size: 12px; font-weight: 600; color: white;">${index + 1}D</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Cliente e Status -->
                    <div style="margin-bottom: 40px;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                          <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">CLIENTE</div>
                          <div style="font-size: 11px; font-weight: 600; color: white;">${passenger.name.toUpperCase()}</div>
                        </div>
                        <div style="text-align: right;">
                          <div style="font-size: 11px; font-weight: 600; color: #60a5fa;">Diamante</div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  
                  <!-- TERCEIRA PARTE: Informações de embarque organizadas -->
                  <div style="margin-bottom: 25px;">
                    <!-- Primeira linha de informações -->
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; margin-bottom: 12px;">
                      <div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">PORTÃO</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">15</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">EMBARQUE</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">14:35</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">PARTIDA</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">15:00</span>
                      </div>
                    </div>
                    
                    <!-- Segunda linha de informações -->
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; margin-bottom: 12px;">
                      <div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">SEÇÃO</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">Y</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">CLASSE</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">ECONÔMICA</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">STATUS</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">OK</span>
                      </div>
                    </div>
                    
                    <!-- Terceira linha de informações -->
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
                      <div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">SEQUÊNCIA</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">001</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">LOCALIZADOR</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">ABC123</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">BAGAGEM</span>
                        <span style="font-size: 11px; font-weight: 600; color: white;">1PC</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- QUARTA PARTE: QR Code no canto inferior direito -->
                  <div style="position: absolute; bottom: 20px; right: 20px; width: 70px; height: 70px; background-color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 60px; height: 60px; background-image: url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><rect width="25" height="25" fill="white"/><g fill="black"><rect x="0" y="0" width="7" height="7"/><rect x="1" y="1" width="5" height="5" fill="white"/><rect x="2" y="2" width="3" height="3"/><rect x="18" y="0" width="7" height="7"/><rect x="19" y="1" width="5" height="5" fill="white"/><rect x="20" y="2" width="3" height="3"/><rect x="0" y="18" width="7" height="7"/><rect x="1" y="19" width="5" height="5" fill="white"/><rect x="2" y="20" width="3" height="3"/><rect x="8" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="12" y="6" width="1" height="1"/><rect x="14" y="6" width="1" height="1"/><rect x="16" y="6" width="1" height="1"/><rect x="6" y="8" width="1" height="1"/><rect x="6" y="10" width="1" height="1"/><rect x="6" y="12" width="1" height="1"/><rect x="6" y="14" width="1" height="1"/><rect x="6" y="16" width="1" height="1"/><rect x="9" y="1" width="1" height="1"/><rect x="11" y="1" width="1" height="1"/><rect x="13" y="1" width="1" height="1"/><rect x="15" y="1" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="10" y="8" width="1" height="1"/><rect x="12" y="9" width="1" height="1"/><rect x="14" y="8" width="1" height="1"/><rect x="16" y="9" width="1" height="1"/><rect x="9" y="10" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/><rect x="15" y="11" width="1" height="1"/><rect x="8" y="12" width="1" height="1"/><rect x="10" y="13" width="1" height="1"/><rect x="12" y="12" width="1" height="1"/><rect x="14" y="13" width="1" height="1"/><rect x="9" y="14" width="1" height="1"/><rect x="11" y="15" width="1" height="1"/><rect x="13" y="14" width="1" height="1"/><rect x="15" y="15" width="1" height="1"/><rect x="8" y="16" width="1" height="1"/><rect x="10" y="17" width="1" height="1"/><rect x="12" y="16" width="1" height="1"/><rect x="14" y="17" width="1" height="1"/><rect x="1" y="9" width="1" height="1"/><rect x="3" y="11" width="1" height="1"/><rect x="1" y="13" width="1" height="1"/><rect x="3" y="15" width="1" height="1"/><rect x="20" y="9" width="1" height="1"/><rect x="22" y="11" width="1" height="1"/><rect x="20" y="13" width="1" height="1"/><rect x="22" y="15" width="1" height="1"/><rect x="18" y="18" width="3" height="3"/><rect x="19" y="19" width="1" height="1" fill="white"/><rect x="9" y="19" width="1" height="1"/><rect x="11" y="20" width="1" height="1"/><rect x="13" y="19" width="1" height="1"/><rect x="15" y="20" width="1" height="1"/><rect x="9" y="22" width="1" height="1"/><rect x="11" y="23" width="1" height="1"/><rect x="13" y="22" width="1" height="1"/><rect x="15" y="23" width="1" height="1"/></g></svg>')}'); background-size: cover;"></div>
                  </div>
                  
                  <!-- Texto informativo no rodapé -->
                  <div style="position: absolute; bottom: 15px; left: 20px; font-size: 7px; color: #b3d1ff;">
                    <div>Azul Linhas Aéreas Brasileiras</div>
                    <div>Keep this boarding pass until departure</div>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                  <button onclick="window.downloadStackedCards()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    📥 Baixar Todos Empilhados
                  </button>
                  <button onclick="window.closeBoardingPass()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin-left: 10px;">
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          `;
        };
        
        const updateModal = () => {
          const existingModal = document.getElementById('boarding-pass-modal');
          if (existingModal) {
            existingModal.remove();
          }
          document.body.insertAdjacentHTML('beforeend', createModalHTML(currentIndex));
        };
        
        updateModal();
        
        autoCloseTimer = setTimeout(() => {
          (window as any).closeBoardingPass();
        }, 30000);
        
        (window as any).prevCard = () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateModal();
          }
        };
        
        (window as any).nextCard = () => {
          if (currentIndex < passengers.length - 1) {
            currentIndex++;
            updateModal();
          }
        };
        
        (window as any).downloadStackedCards = () => {
          clearTimeout(autoCloseTimer);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const cardHeight = 280;
          const cardWidth = 450;
          const spacing = 20;
          
          canvas.width = cardWidth;
          canvas.height = (cardHeight * passengers.length) + (spacing * (passengers.length - 1));
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          passengers.forEach((passenger: any, index: number) => {
            const y = index * (cardHeight + spacing);
            const seatNumber = `${index + 1}D`;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, y, cardWidth, cardHeight);
            
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, y, cardWidth, cardHeight);
            
            const gradient = ctx.createLinearGradient(0, y, cardWidth, y + 60);
            gradient.addColorStop(0, '#0ea5e9');
            gradient.addColorStop(1, '#0284c7');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, y, cardWidth, 60);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('AZUL LINHAS AÉREAS', 20, y + 25);
            ctx.font = '14px Arial';
            ctx.fillText('Cartão de Embarque', 20, y + 45);
            
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`Nome: ${passenger.name}`, 20, y + 100);
            ctx.font = '14px Arial';
            ctx.fillText(`Tipo: ${passenger.type}`, 20, y + 125);
            ctx.fillText(`Assento: ${seatNumber}`, 20, y + 150);
            ctx.fillText(`Portão: 15`, 20, y + 175);
            ctx.fillText(`Embarque: 14:35`, 20, y + 200);
            ctx.fillText(`Decolagem: 15:00`, 20, y + 225);
          });
          
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cartoes-embarque-sbt.png';
            a.click();
            URL.revokeObjectURL(url);
          }, 'image/png');
          
          (window as any).closeBoardingPass();
        };
        
      } catch (error) {
        console.error('Error in unified boarding pass:', error);
        alert('Erro ao abrir cartões de embarque');
      }
    };
    
    console.log('Global function openUnifiedBoardingPass defined:', typeof (window as any).openUnifiedBoardingPass);

    return () => {
      delete (window as any).openUnifiedBoardingPass;
      delete (window as any).closeBoardingPass;
      delete (window as any).prevCard;
      delete (window as any).nextCard;
      delete (window as any).downloadStackedCards;
    };
  }, []);

  // Configurar função global separada para geração
  useEffect(() => {
    (window as any).saveBoardingPass = (passengerName: string, flightNumber: string) => {
      const element = document.createElement('a');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Cartão de Embarque - ${passengerName}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f3f4f6; }
            .boarding-pass { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="boarding-pass">
            ${createBoardingPassHTML(passengerName, true)}
          </div>
        </body>
        </html>
      `;
      
      const file = new Blob([htmlContent], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `cartao-embarque-${passengerName.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setTimeout(() => {
        (window as any).closeBoardingPass();
      }, 3000);
    };

    return () => {
      delete (window as any).openBoardingPass;
      delete (window as any).closeBoardingPass;
      delete (window as any).saveBoardingPass;
    };
  }, []);

  // Inicializar conversa quando abrir
  useEffect(() => {
    if (isOpen && userData) {
      if (!conversationStarted) {
        const stateRestored = restoreState();
        
        if (!stateRestored) {
          // Mostrar indicador de "iniciando conversa" por 3 segundos
          setIsTyping(true);
          
          setTimeout(() => {
            setIsTyping(false);
            const welcomeMessage: Message = {
              id: 1,
              text: `Olá! Sou a Rebeca, assistente da SBT. Preciso organizar sua viagem para São Paulo. Vamos começar com o transporte - você prefere viajar de avião ou ônibus?`,
              sender: 'bot',
              timestamp: new Date()
            };
            setMessages([welcomeMessage]);
            setShowQuickOptions(true);
            setCurrentStep('transport');
          }, 3000);
          
          if (userData?.cep) {
            findNearestAirportFromCEP();
          }
        }
        
        setConversationStarted(true);
      }
      
      if (selectedDate) {
        calculateFlightDate();
      }
    }
    
    if (!isOpen) {
      setConversationStarted(false);
    }
    
    // Configurar função global para gerar cartões
    if (typeof window !== 'undefined') {
      window.generateAndShowBoardingPasses = () => {
        generateBoardingPasses();
      };
    }
  }, [isOpen, userData, userCity, selectedDate]);

  const findNearestAirportFromCEP = async () => {
    if (!userData?.cep) return;
    
    try {
      const coordinates = await getCoordinatesFromCEP(userData.cep);
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
    const flightDate = new Date(appointmentDate);
    flightDate.setDate(appointmentDate.getDate() - 2);
    const formattedDate = flightDate.toLocaleDateString('pt-BR');
    setFlightDate(formattedDate);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBoardingPasses = () => {
    // Usar userData que já está disponível no componente
    const passengers = [];
    
    if (userData?.responsavelNome) {
      passengers.push({
        name: userData.responsavelNome,
        type: 'Responsável'
      });
    }
    
    if (userData?.candidatos) {
      userData.candidatos.forEach((candidato: any, index: number) => {
        if (candidato.nome) {
          passengers.push({
            name: candidato.nome,
            type: `Candidato ${index + 1}`
          });
        }
      });
    }

    // Se não encontrar no userData, tentar localStorage
    if (passengers.length === 0) {
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
      
      if (responsavelData.nome) {
        passengers.push({
          name: responsavelData.nome,
          type: 'Responsável'
        });
      }
      
      candidatos.forEach((candidato: any, index: number) => {
        if (candidato.nome) {
          passengers.push({
            name: candidato.nome,
            type: `Candidato ${index + 1}`
          });
        }
      });
    }

    console.log('Generating boarding passes for:', passengers);

    if (passengers.length > 0) {
      const unifiedFile = createUnifiedBoardingPassFile(passengers);
      addMessage(unifiedFile, 'bot');
    } else {
      // Fallback com dados de exemplo se não encontrar nenhum
      const fallbackPassengers = [
        { name: 'RESPONSÁVEL EXEMPLO', type: 'Responsável' },
        { name: 'CANDIDATO EXEMPLO', type: 'Candidato 1' }
      ];
      const unifiedFile = createUnifiedBoardingPassFile(fallbackPassengers);
      addMessage(unifiedFile, 'bot');
    }
  };

  const createUnifiedBoardingPassFile = (passengers: any[]) => {
    const passengersJson = JSON.stringify(passengers);
    const escapedJson = passengersJson.replace(/"/g, '&quot;');
    console.log('Creating boarding pass file for passengers:', passengers);
    console.log('JSON to pass:', passengersJson);
    
    return `
      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 10px 0; max-width: 350px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onclick="console.log('Clicked boarding pass!'); if(window.openUnifiedBoardingPass) { window.openUnifiedBoardingPass('${escapedJson}'); } else { console.error('openUnifiedBoardingPass function not found'); }" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 12px; border-radius: 8px; color: white; font-size: 20px; min-width: 48px; text-align: center;">
            ✈️
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #1e293b; font-size: 15px; margin-bottom: 6px;">
              📄 Documento: Cartões de Embarque
            </div>
            <div style="color: #3b82f6; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
              ${passengers.length} passageiro${passengers.length > 1 ? 's' : ''} incluído${passengers.length > 1 ? 's' : ''}
            </div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 4px; line-height: 1.3;">
              ${passengers.map(p => `• ${p.name} (${p.type})`).join('<br>')}
            </div>
            <div style="color: #059669; font-size: 11px; font-weight: 600; background: #ecfdf5; padding: 4px 8px; border-radius: 4px; display: inline-block;">
              📱 Clique para visualizar e baixar
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createBoardingPassFile = (passengerName: string, isAdult: boolean, seatIndex: number) => {
    const passId = `pass-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const seatNumber = `${seatIndex + 1}D`; // 1D, 2D, 3D, 4D...
    
    return `
      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 10px 0; max-width: 300px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onclick="window.openBoardingPass && window.openBoardingPass('${passId}', '${passengerName}', ${isAdult}, '${seatNumber}')" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 12px; border-radius: 8px; color: white; font-size: 20px; min-width: 48px; text-align: center;">
            ✈️
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 4px;">
              Cartão de Embarque - ${passengerName}
            </div>
            <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">
              Voo AD2768 • ${isAdult ? 'Adulto' : 'Menor'} • Assento ${seatNumber}
            </div>
            <div style="color: #3b82f6; font-size: 11px; font-weight: 600;">
              📱 Clique para visualizar e salvar
            </div>
          </div>
          <div style="color: #94a3b8; font-size: 18px;">
            📄
          </div>
        </div>
      </div>
    `;
  };

  const createBoardingPassHTML = (passengerName: string, isAdult: boolean, seatNumber?: string) => {
    // Recuperar dados salvos no localStorage
    const responsavelInfo = JSON.parse(localStorage.getItem('responsavelData') || '{}');
    const cidadeInfo = JSON.parse(localStorage.getItem('cidadeInfo') || '{}');
    
    // Usar a data específica da opção de voo escolhida pelo usuário
    let flightDate = new Date();
    let flightTime = '13:20'; // Horário padrão
    
    if (selectedDate) {
      const appointmentDate = new Date(selectedDate);
      
      // Determinar qual opção foi escolhida baseado nas mensagens
      const option1Selected = messages.some(msg => msg.sender === 'user' && msg.text.includes('Opção 1'));
      const option2Selected = messages.some(msg => msg.sender === 'user' && msg.text.includes('Opção 2'));
      
      if (option1Selected) {
        // Opção 1: 2 dias antes do agendamento
        flightDate = new Date(appointmentDate);
        flightDate.setDate(appointmentDate.getDate() - 2);
        flightTime = '13:20';
      } else if (option2Selected) {
        // Opção 2: 1 dia antes do agendamento
        flightDate = new Date(appointmentDate);
        flightDate.setDate(appointmentDate.getDate() - 1);
        flightTime = '09:45';
      }
    }
    
    // Calcular horário de embarque (25 minutos antes)
    const flightTimeHour = parseInt(flightTime.split(':')[0]);
    const flightTimeMinute = parseInt(flightTime.split(':')[1]);
    const boardingMinutes = flightTimeMinute - 25;
    let boardingHour = flightTimeHour;
    let boardingMinute = boardingMinutes;
    
    if (boardingMinutes < 0) {
      boardingHour -= 1;
      boardingMinute = 60 + boardingMinutes;
    }
    
    const boardingTime = `${boardingHour.toString().padStart(2, '0')}:${boardingMinute.toString().padStart(2, '0')}`;
    
    // Usar aeroporto real encontrado pelo sistema ou dados da cidade
    let originCode = 'GRU';
    let originCity = 'SÃO PAULO';
    
    if (nearestAirport) {
      originCode = nearestAirport.code;
      originCity = nearestAirport.city.toUpperCase();
    } else if (cidadeInfo.localidade) {
      // Mapear cidades para aeroportos reais baseado no CEP
      const cityLower = cidadeInfo.localidade.toLowerCase();
      if (cityLower.includes('goiânia') || cityLower.includes('goiania')) {
        originCode = 'GYN';
        originCity = 'GOIÂNIA';
      } else if (cityLower.includes('brasília') || cityLower.includes('brasilia')) {
        originCode = 'BSB';
        originCity = 'BRASÍLIA';
      } else if (cityLower.includes('recife')) {
        originCode = 'REC';
        originCity = 'RECIFE';
      } else if (cityLower.includes('salvador')) {
        originCode = 'SSA';
        originCity = 'SALVADOR';
      } else if (cityLower.includes('belo horizonte')) {
        originCode = 'CNF';
        originCity = 'BELO HORIZONTE';
      } else if (cityLower.includes('rio de janeiro')) {
        originCode = 'GIG';
        originCity = 'RIO DE JANEIRO';
      } else if (cityLower.includes('fortaleza')) {
        originCode = 'FOR';
        originCity = 'FORTALEZA';
      } else if (cityLower.includes('curitiba')) {
        originCode = 'CWB';
        originCity = 'CURITIBA';
      } else if (cityLower.includes('porto alegre')) {
        originCode = 'POA';
        originCity = 'PORTO ALEGRE';
      } else if (cityLower.includes('manaus')) {
        originCode = 'MAO';
        originCity = 'MANAUS';
      } else if (cityLower.includes('belém')) {
        originCode = 'BEL';
        originCity = 'BELÉM';
      } else if (cityLower.includes('natal')) {
        originCode = 'NAT';
        originCity = 'NATAL';
      } else if (cityLower.includes('joão pessoa')) {
        originCode = 'JPA';
        originCity = 'JOÃO PESSOA';
      } else if (cityLower.includes('maceió')) {
        originCode = 'MCZ';
        originCity = 'MACEIÓ';
      } else if (cityLower.includes('aracaju')) {
        originCode = 'AJU';
        originCity = 'ARACAJU';
      } else if (cityLower.includes('teresina')) {
        originCode = 'THE';
        originCity = 'TERESINA';
      } else if (cityLower.includes('são luís')) {
        originCode = 'SLZ';
        originCity = 'SÃO LUÍS';
      } else if (cityLower.includes('cuiabá')) {
        originCode = 'CGB';
        originCity = 'CUIABÁ';
      } else if (cityLower.includes('campo grande')) {
        originCode = 'CGR';
        originCity = 'CAMPO GRANDE';
      } else if (cityLower.includes('florianópolis')) {
        originCode = 'FLN';
        originCity = 'FLORIANÓPOLIS';
      } else if (cityLower.includes('vitória')) {
        originCode = 'VIX';
        originCity = 'VITÓRIA';
      } else {
        // Para outras cidades, usar a cidade informada
        originCity = cidadeInfo.localidade.toUpperCase();
      }
    } else if (userCity) {
      // Fallback para userCity se não houver dados do CEP
      const cityLower = userCity.toLowerCase();
      if (cityLower.includes('goiânia') || cityLower.includes('goiania')) {
        originCode = 'GYN';
        originCity = 'GOIÂNIA';
      } else if (cityLower.includes('brasília') || cityLower.includes('brasilia')) {
        originCode = 'BSB';
        originCity = 'BRASÍLIA';
      } else {
        originCity = userCity.toUpperCase();
      }
    }
    
    const flightNumber = `AD2768`;
    // Recuperar índice do assento do localStorage ou determinar baseado no nome
    let seatIndex = 0;
    const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
    const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
    
    if (passengerName === responsavelInfo.nome) {
      seatIndex = 0; // Responsável sempre no assento 1D
    } else {
      // Encontrar índice do candidato
      const candidatoIndex = candidatos.findIndex((c: any) => c.nome === passengerName);
      seatIndex = candidatoIndex >= 0 ? candidatoIndex + 1 : 1;
    }
    
    const seat = `${seatIndex + 1}D`; // 1D, 2D, 3D, 4D...
    const ticketCode = `${originCode}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    return `
      <div style="width: 300px; height: 520px; background: #001f3f; border-radius: 12px; padding: 20px; color: white; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; position: relative; margin: 0 auto; box-shadow: 0 12px 32px rgba(0,0,0,0.4);">
        
        <!-- Header - Layout oficial -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
          <img src="/attached_assets/azul-logo-02_1750506382633.png" alt="Azul" style="height: 24px; width: auto;" />
          <div style="display: flex; align-items: flex-start; gap: 16px; text-align: center;">
            <div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 500; margin-bottom: 2px;">DATA</div>
              <div style="font-size: 11px; font-weight: 600; color: white;">${flightDate.toLocaleDateString('pt-BR')}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 500; margin-bottom: 2px;">VOO</div>
              <div style="font-size: 11px; font-weight: 600; color: white;">2768</div>
            </div>
          </div>
        </div>
        
        <!-- SEGUNDA PARTE: Aeroportos e informações principais -->
        <div style="margin-bottom: 25px;">
          <!-- Nomes das cidades em uma linha -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <div style="font-size: 10px; color: #94a3b8; font-weight: 500;">${originCity.toUpperCase()}</div>
            <div style="font-size: 10px; color: #94a3b8; font-weight: 500;">${destinationCity.toUpperCase()}</div>
          </div>
          
          <!-- Códigos dos aeroportos alinhados -->
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 48px; font-weight: 400; line-height: 1; color: white;">${originCode}</div>
            
            <div style="display: flex; align-items: center; justify-content: center; margin: 0 15px;">
              <div style="font-size: 20px; color: #60a5fa;">✈</div>
            </div>
            
            <div style="font-size: 48px; font-weight: 400; line-height: 1; color: white;">${destinationCode}</div>
          </div>
          
          <!-- Linha de informações de embarque -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div style="text-align: left;">
                <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">INÍCIO EMBARQUE</div>
                <div style="font-size: 12px; font-weight: 600; color: white;">12:55</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">FIM EMBARQUE</div>
                <div style="font-size: 12px; font-weight: 600; color: white;">13:20</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">SEÇÃO</div>
                <div style="font-size: 12px; font-weight: 600; color: white;">D</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">ASSENTO</div>
                <div style="font-size: 12px; font-weight: 600; color: white;">${seat}</div>
              </div>
            </div>
          </div>
          
          <!-- Cliente e Status -->
          <div style="margin-bottom: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <div style="font-size: 8px; color: #94a3b8; font-weight: 500; margin-bottom: 1px;">CLIENTE</div>
                <div style="font-size: 11px; font-weight: 600; color: white;">${passengerName.toUpperCase()}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; font-weight: 600; color: #60a5fa;">Diamante</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- TERCEIRA PARTE: Informações de embarque organizadas -->
        <div style="margin-bottom: 25px;">
          <!-- Primeira linha de informações -->
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; margin-bottom: 12px;">
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">PORTÃO</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">15</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">EMBARQUE</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">${boardingTime}</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">PARTIDA</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">${flightTime}</span>
            </div>
          </div>
          
          <!-- Segunda linha de informações -->
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; margin-bottom: 12px;">
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">SEÇÃO</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">Y</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">CLASSE</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">ECONÔMICA</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">STATUS</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">OK</span>
            </div>
          </div>
          
          <!-- Terceira linha de informações -->
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">SEQUÊNCIA</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">001</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">LOCALIZADOR</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">${ticketCode}</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <span style="color: #b3d1ff; font-weight: 500; margin-bottom: 2px;">BAGAGEM</span>
              <span style="font-size: 11px; font-weight: 600; color: white;">1PC</span>
            </div>
          </div>
        </div>
        
        <!-- QUARTA PARTE: QR Code no canto inferior direito -->
        <div style="position: absolute; bottom: 20px; right: 20px; width: 70px; height: 70px; background-color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 60px; height: 60px; background-image: url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><rect width="25" height="25" fill="white"/><g fill="black"><rect x="0" y="0" width="7" height="7"/><rect x="1" y="1" width="5" height="5" fill="white"/><rect x="2" y="2" width="3" height="3"/><rect x="18" y="0" width="7" height="7"/><rect x="19" y="1" width="5" height="5" fill="white"/><rect x="20" y="2" width="3" height="3"/><rect x="0" y="18" width="7" height="7"/><rect x="1" y="19" width="5" height="5" fill="white"/><rect x="2" y="20" width="3" height="3"/><rect x="8" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="12" y="6" width="1" height="1"/><rect x="14" y="6" width="1" height="1"/><rect x="16" y="6" width="1" height="1"/><rect x="6" y="8" width="1" height="1"/><rect x="6" y="10" width="1" height="1"/><rect x="6" y="12" width="1" height="1"/><rect x="6" y="14" width="1" height="1"/><rect x="6" y="16" width="1" height="1"/><rect x="9" y="1" width="1" height="1"/><rect x="11" y="1" width="1" height="1"/><rect x="13" y="1" width="1" height="1"/><rect x="15" y="1" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="10" y="8" width="1" height="1"/><rect x="12" y="9" width="1" height="1"/><rect x="14" y="8" width="1" height="1"/><rect x="16" y="9" width="1" height="1"/><rect x="9" y="10" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/><rect x="15" y="11" width="1" height="1"/><rect x="8" y="12" width="1" height="1"/><rect x="10" y="13" width="1" height="1"/><rect x="12" y="12" width="1" height="1"/><rect x="14" y="13" width="1" height="1"/><rect x="9" y="14" width="1" height="1"/><rect x="11" y="15" width="1" height="1"/><rect x="13" y="14" width="1" height="1"/><rect x="15" y="15" width="1" height="1"/><rect x="8" y="16" width="1" height="1"/><rect x="10" y="17" width="1" height="1"/><rect x="12" y="16" width="1" height="1"/><rect x="14" y="17" width="1" height="1"/><rect x="1" y="9" width="1" height="1"/><rect x="3" y="11" width="1" height="1"/><rect x="1" y="13" width="1" height="1"/><rect x="3" y="15" width="1" height="1"/><rect x="20" y="9" width="1" height="1"/><rect x="22" y="11" width="1" height="1"/><rect x="20" y="13" width="1" height="1"/><rect x="22" y="15" width="1" height="1"/><rect x="18" y="18" width="3" height="3"/><rect x="19" y="19" width="1" height="1" fill="white"/><rect x="9" y="19" width="1" height="1"/><rect x="11" y="20" width="1" height="1"/><rect x="13" y="19" width="1" height="1"/><rect x="15" y="20" width="1" height="1"/><rect x="9" y="22" width="1" height="1"/><rect x="11" y="23" width="1" height="1"/><rect x="13" y="22" width="1" height="1"/><rect x="15" y="23" width="1" height="1"/></g></svg>')}'); background-size: cover;"></div>
        </div>
        
        <!-- Texto informativo no rodapé -->
        <div style="position: absolute; bottom: 15px; left: 20px; font-size: 7px; color: #b3d1ff;">
          <div>Azul Linhas Aéreas Brasileiras</div>
          <div>Keep this boarding pass until departure</div>
        </div>
      </div>
    `;
  };

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = (messageToSend?: string) => {
    const message = messageToSend || inputMessage.trim();
    if (!message) return;

    setInputMessage('');
    addMessage(message, 'user');
    setShowQuickOptions(false);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        handleBotResponse(message);
      }, Math.random() * 2000 + 2000);
    }, 500);
  };

  const handleBotResponse = (messageToSend: string) => {
    let botResponse = '';
    let nextStep = currentStep;
    let showOptions = false;

    switch (currentStep) {
      case 'transport':
        if (messageToSend.toLowerCase().includes('aviao') || messageToSend.toLowerCase().includes('avião')) {
          botResponse = botResponses.transport.aviao;
          nextStep = 'city';
          showOptions = false;
        } else if (messageToSend.toLowerCase().includes('onibus') || messageToSend.toLowerCase().includes('ônibus')) {
          botResponse = botResponses.transport.onibus;
          nextStep = 'hotel';
          showOptions = true;
        } else {
          botResponse = "Por favor, escolha entre Avião ou Ônibus para o transporte.";
          showOptions = true;
        }
        break;

      case 'baggage-option':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('adicionar')) {
          botResponse = "Perfeito! Kit bagagem adicionado por R$ 29,90.";
          nextStep = 'pix-payment';
          showOptions = false;
          
          // Enviar informações sobre pagamento PIX
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Vou te enviar a chave PIX copia e cola para você fazer o pagamento do adicional de bagagem.", 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Nosso chat irá se encerrar automaticamente em 5 minutos se não houver retorno. Realize o pagamento e volte antes de 5 minutos para evitar de recomeçar o cadastro do início.", 'bot');
                  setShowQuickOptions(true);
                  setCurrentStep('pix-payment');
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        } else if (messageToSend.toLowerCase().includes('não') || messageToSend.toLowerCase().includes('nao') || messageToSend.toLowerCase().includes('sem bagagem')) {
          botResponse = "Entendido! As passagens serão apenas com bagagem de mão.";
          nextStep = 'hotel';
          showOptions = false;
          
          // Continuar para hotel após recusar bagagem
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Agora vamos falar sobre hospedagem - você prefere ficar em hotel próximo aos estúdios ou em hotel no centro de São Paulo?", 'bot');
              setShowQuickOptions(true);
              setCurrentStep('hotel');
            }, 5000);
          }, 5000);
        } else {
          botResponse = "Por favor, escolha se deseja adicionar o kit bagagem ou não.";
          showOptions = true;
        }
        break;

      case 'pix-payment':
        if (messageToSend.toLowerCase().includes('ok') && messageToSend.toLowerCase().includes('pagamento')) {
          botResponse = "Tabom, vou te enviar aí!";
          nextStep = 'pix-key';
          showOptions = false;
          
          // Enviar chave PIX
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage(`
                <div style="background: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 16px; margin: 10px 0; font-family: monospace;">
                  <div style="font-weight: bold; color: #007bff; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                    <span>🔗 PIX - R$ 29,90</span>
                    <button onclick="navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX013636303639-3034-4d42-b7a7-9e6c8f1a5b2c0208BAGAGEM520400005303986540529.905802BR5925SBT PRODUCOES ARTISTICAS6009SAO PAULO62070503***6304A8B9')" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer;">📋 Copiar</button>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #dee2e6; word-break: break-all; font-size: 12px;">
                    00020126580014BR.GOV.BCB.PIX013636303639-3034-4d42-b7a7-9e6c8f1a5b2c0208BAGAGEM520400005303986540529.905802BR5925SBT PRODUCOES ARTISTICAS6009SAO PAULO62070503***6304A8B9
                  </div>
                  <div style="margin-top: 8px; font-size: 12px;">
                    <div style="color: #007bff;">Copie e cole no seu app de pagamento</div>
                    <div style="color: #007bff;">Valor: R$ 29,90</div>
                    <div style="color: #007bff;">Beneficiário: SBT Produções</div>
                  </div>
                </div>
              `, 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Lembre-se: assim que realizar o pagamento, volte aqui para concluirmos o cadastro por completo. Te aguardo!", 'bot');
                  
                  // Aguardando confirmação de pagamento
                  setTimeout(() => {
                    setShowPaymentStatus(true);
                    setPaymentTimer(120); // 2 minutos
                    
                    // Timer para contar regressivo
                    const timer = setInterval(() => {
                      setPaymentTimer((prev) => {
                        if (prev <= 1) {
                          clearInterval(timer);
                          // Após 2 minutos sem pagamento
                          addMessage("Oi, vamos continuar seu cadastro?", 'bot');
                          setShowQuickOptions(true);
                          setCurrentStep('payment-timeout');
                          return 0;
                        }
                        return prev - 1;
                      });
                    }, 1000);
                    
                    // Simular confirmação após 10 segundos (será substituído pelo gateway real)
                    setTimeout(() => {
                      setPaymentConfirmed(true);
                      clearInterval(timer);
                      addMessage("✅ Seu pagamento foi confirmado! Vamos continuar?", 'bot');
                      setShowQuickOptions(true);
                      setCurrentStep('payment-confirmed');
                    }, 10000);
                  }, 2000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        } else {
          botResponse = "Por favor, confirme se vai realizar o pagamento.";
          showOptions = true;
        }
        break;

      case 'payment-confirmed':
        if (messageToSend.toLowerCase().includes('sim') && messageToSend.toLowerCase().includes('continuar')) {
          setShowPaymentStatus(false); // Remove o campo amarelo
          botResponse = "Estou realizando o pagamento das suas passagens, já te envio o cartão de embarque.";
          nextStep = 'boarding-pass-confirmed';
          showOptions = false;
          
          // Sequência de mensagens para cartão de embarque
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto! Já realizei a compra de suas passagens aéreas, agora vou te enviar os cartões de embarque.", 'bot');
              
              setTimeout(() => {
                generateBoardingPasses();
              }, 2000);
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Faça o download dos cartões de embarque para quando for embarcar apresentar os cartões.", 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Fique tranquilo! Caso não consiga baixar, enviaremos por WhatsApp também.", 'bot');
                      
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage("Para sua estadia em São Paulo, temos duas opções de hotel:", 'bot');
                          setShowQuickOptions(true);
                          setCurrentStep('hotel');
                        }, 5000);
                      }, 5000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 6000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'payment-timeout':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('continuar')) {
          setShowPaymentStatus(false); // Remove o campo amarelo
          botResponse = "Como não identifiquei o pagamento, irei cancelar o seu adicional de bagagem e finalizar a compra de suas passagens, ok?";
          nextStep = 'boarding-pass-cancelled';
          showOptions = false;
          
          // Sequência de mensagens para cartão de embarque sem bagagem
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto! Já realizei a compra de suas passagens aéreas (sem adicional de bagagem), agora vou te enviar os cartões de embarque.", 'bot');
              
              setTimeout(() => {
                generateBoardingPasses();
              }, 2000);
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Faça o download dos cartões de embarque para quando for embarcar apresentar os cartões.", 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Fique tranquilo! Caso não consiga baixar, enviaremos por WhatsApp também.", 'bot');
                      
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage("Para sua estadia em São Paulo, temos duas opções de hotel:", 'bot');
                          setShowQuickOptions(true);
                          setCurrentStep('hotel');
                        }, 5000);
                      }, 5000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 6000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'flight-confirmation':
        if (messageToSend.toLowerCase().includes('opção 1') || messageToSend.toLowerCase().includes('opcao 1')) {
          // Salvar que foi escolhida a Opção 1 (2 dias antes)
          setCurrentStep('baggage-option');
          botResponse = "Certo! Só um minuto que estou efetuando a compra de suas passagens e vou te enviar as passagens aqui para que você utilize na hora do embarque...";
          nextStep = 'baggage-option';
          showOptions = false;
          
          // Sequência de mensagens humanizadas
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage(`${userData?.responsavelNome || 'Senhor(a)'}, lembrando que as passagens são custeadas pelo SBT, ou seja, não terá gasto algum com passagens.`, 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage('Antes de finalizar a compra de suas passagens, tenho que te dar um aviso importante.', 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage('As passagens custeadas pelo SBT são de categoria básica e não possuem bagagem inclusa.', 'bot');
                      
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage('Temos uma parceria com a Azul onde conseguimos um valor promocional pelo kit de bagagem. Esse kit no valor normal vai te custar R$ 279,90, porém conseguimos adicionar o mesmo kit com valor de parceiro por apenas <strong>R$ 29,90</strong>.', 'bot');
                          
                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              setIsTyping(false);
                              addMessage('O kit inclui: bagagem de 23kg + bagagem de mão + mochila. Você gostaria de adicionar?', 'bot');
                              setShowQuickOptions(true);
                              setCurrentStep('baggage-option');
                            }, 5000);
                          }, 5000);
                        }, 5000);
                      }, 5000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        } else if (messageToSend.toLowerCase().includes('opção 2') || messageToSend.toLowerCase().includes('opcao 2')) {
          // Salvar que foi escolhida a Opção 2 (1 dia antes)
          setCurrentStep('baggage-option');
          botResponse = "Certo! Só um minuto que estou efetuando a compra de suas passagens e vou te enviar as passagens aqui para que você utilize na hora do embarque...";
          nextStep = 'baggage-option';
          showOptions = false;
          
          // Sequência de mensagens humanizadas - Opção 2
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage(`${userData?.responsavelNome || 'Senhor(a)'}, lembrando que as passagens são custeadas pelo SBT, ou seja, não terá gasto algum com passagens.`, 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage('Antes de finalizar a compra de suas passagens, tenho que te dar um aviso importante.', 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage('As passagens custeadas pelo SBT são de categoria básica e não possuem bagagem inclusa.', 'bot');
                      
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage('Temos uma parceria com a Azul onde conseguimos um valor promocional pelo kit de bagagem. Esse kit no valor normal vai te custar R$ 279,90, porém conseguimos adicionar o mesmo kit com valor de parceiro por apenas <strong>R$ 29,90</strong>.', 'bot');
                          
                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              setIsTyping(false);
                              addMessage('O kit inclui: bagagem de 23kg + bagagem de mão + mochila. Você gostaria de adicionar?', 'bot');
                              setShowQuickOptions(true);
                              setCurrentStep('baggage-option');
                            }, 5000);
                          }, 5000);
                        }, 5000);
                      }, 5000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto! Já realizei a compra de suas passagens aéreas, agora vou te enviar os cartões de embarque. Salve os cartões em seu celular para evitar problemas no embarque.", 'bot');
              
              setTimeout(() => {
                generateBoardingPasses();
              }, 2000);
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Agora vamos falar sobre hospedagem - você prefere ficar em hotel próximo aos estúdios ou em hotel no centro de São Paulo?", 'bot');
                  setShowQuickOptions(true);
                  setCurrentStep('hotel');
                }, 2000);
              }, 6000);
            }, 5000);
          }, 2000);
        } else if (messageToSend.toLowerCase().includes('opção 2') || messageToSend.toLowerCase().includes('opcao 2')) {
          // Salvar que foi escolhida a Opção 2 (1 dia antes)
          setCurrentStep('hotel-option2');
          botResponse = "Perfeito, vou realizar a compra de suas passagens, logo em seguida te envio os cartões de embarque, só um instante...";
          nextStep = 'hotel-option2';
          showOptions = false;
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto! Já realizei a compra de suas passagens aéreas, agora vou te enviar os cartões de embarque. Salve os cartões em seu celular para evitar problemas no embarque.", 'bot');
              
              setTimeout(() => {
                generateBoardingPasses();
              }, 2000);
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Agora vamos falar sobre hospedagem - você prefere ficar em hotel próximo aos estúdios ou em hotel no centro de São Paulo?", 'bot');
                  setShowQuickOptions(true);
                  setCurrentStep('hotel');
                }, 2000);
              }, 6000);
            }, 5000);
          }, 2000);
        } else {
          botResponse = "Por favor, selecione uma das opções de voo disponíveis.";
          showOptions = true;
        }
        break;
          
      case 'city':
        botResponse = "Vou buscar voos...";
        nextStep = 'hotel';
        showOptions = false;
        break;

      case 'hotel':
      case 'hotel-option1':
      case 'hotel-option2':
        if (messageToSend.toLowerCase().includes('próximo') || messageToSend.toLowerCase().includes('estúdios')) {
          botResponse = "Perfeito! Vou realizar a compra de suas passagens e reservar hotel próximo aos estúdios.";
          nextStep = 'purchase';
          showOptions = false;
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto! Já realizei a compra de suas passagens aéreas e reservei sua hospedagem.", 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Agora vou te enviar os documentos de viagem. Clique no documento abaixo para visualizar e salvar seus cartões de embarque.", 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage(`
                        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 10px 0; max-width: 300px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onclick="window.generateAndShowBoardingPasses && window.generateAndShowBoardingPasses()" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 12px; border-radius: 8px; color: white; font-size: 20px; min-width: 48px; text-align: center;">
                              📄
                            </div>
                            <div style="flex: 1;">
                              <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 4px;">
                                Documentos de Viagem
                              </div>
                              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">
                                Cartões de embarque e vouchers
                              </div>
                              <div style="color: #3b82f6; font-size: 11px; font-weight: 600;">
                                📱 Clique para visualizar e baixar
                              </div>
                            </div>
                            <div style="color: #94a3b8; font-size: 18px;">
                              📋
                            </div>
                          </div>
                        </div>
                      `, 'bot');
                    }, 4000);
                  }, 2000);
                }, 6000);
              }, 2000);
            }, 6000);
          }, 2000);
        } else if (messageToSend.toLowerCase().includes('centro')) {
          botResponse = "Perfeito! Vou realizar a compra de suas passagens e reservar hotel no centro de São Paulo.";
          nextStep = 'purchase';
          showOptions = false;
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto! Já realizei a compra de suas passagens aéreas e reservei sua hospedagem.", 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Agora vou te enviar os documentos de viagem. Clique no documento abaixo para visualizar e salvar seus cartões de embarque.", 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage(`
                        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 10px 0; max-width: 300px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onclick="window.generateAndShowBoardingPasses && window.generateAndShowBoardingPasses()" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 12px; border-radius: 8px; color: white; font-size: 20px; min-width: 48px; text-align: center;">
                              📄
                            </div>
                            <div style="flex: 1;">
                              <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 4px;">
                                Documentos de Viagem
                              </div>
                              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">
                                Cartões de embarque e vouchers
                              </div>
                              <div style="color: #3b82f6; font-size: 11px; font-weight: 600;">
                                📱 Clique para visualizar e baixar
                              </div>
                            </div>
                            <div style="color: #94a3b8; font-size: 18px;">
                              📋
                            </div>
                          </div>
                        </div>
                      `, 'bot');
                    }, 4000);
                  }, 2000);
                }, 6000);
              }, 2000);
            }, 6000);
          }, 2000);
        } else {
          botResponse = "Por favor, escolha entre hotel próximo aos estúdios ou no centro.";
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
        nextStep = 'complete';
        showOptions = false;
        break;

      default:
        botResponse = "Desculpe, não entendi. Pode repetir?";
        showOptions = true;
    }

    addMessage(botResponse, 'bot');
    setCurrentStep(nextStep);
    setShowQuickOptions(showOptions);
    
    // Se foi escolhido avião, enviar segunda mensagem e informação sobre voos
    if (currentStep === 'transport' && (messageToSend.toLowerCase().includes('aviao') || messageToSend.toLowerCase().includes('avião'))) {
      // Primeira enviar a segunda mensagem sobre a cidade
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          if (userCity) {
            addMessage(`Identifiquei que você está em ${userCity}. Perfeito! Isso vai me ajudar a encontrar as melhores opções de viagem.`, 'bot');
          }
          
          // Depois enviar informações dos voos
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              
              // Calcular datas baseadas na data do agendamento
              let airportName, airportCode, date1, date2;
              
              if (nearestAirport) {
                airportName = nearestAirport.name;
                airportCode = nearestAirport.code;
              } else {
                const cityName = userCity || 'São Paulo - SP';
                airportName = cityName.includes('Goiânia') ? 'Aeroporto Santa Genoveva' : 'Aeroporto Internacional';
                airportCode = cityName.includes('Goiânia') ? 'GYN' : 'GRU';
              }
              
              if (selectedDate) {
                const appointmentDate = new Date(selectedDate);
                
                const flightDate1 = new Date(appointmentDate);
                flightDate1.setDate(appointmentDate.getDate() - 2);
                date1 = flightDate1.toLocaleDateString('pt-BR');
                
                const flightDate2 = new Date(appointmentDate);
                flightDate2.setDate(appointmentDate.getDate() - 1);
                date2 = flightDate2.toLocaleDateString('pt-BR');
              } else {
                const currentDate = new Date();
                const flightDateCalc = new Date(currentDate);
                flightDateCalc.setDate(currentDate.getDate() + 3);
                date1 = flightDateCalc.toLocaleDateString('pt-BR');
                
                const flightDateCalc2 = new Date(currentDate);
                flightDateCalc2.setDate(currentDate.getDate() + 4);
                date2 = flightDateCalc2.toLocaleDateString('pt-BR');
              }
              
              // Enviar mensagens sequenciais
              addMessage('✈️ Perfeito! Encontrei duas opções de voos disponíveis:', 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage(`🔸 Opção 1: ${airportName} (${airportCode}) → São Paulo\nData: ${date1} | Horário: 08:30 | Duração: 2h15min`, 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage(`🔸 Opção 2: ${airportName} (${airportCode}) → São Paulo\nData: ${date2} | Horário: 14:45 | Duração: 2h15min`, 'bot');
                      
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage('Qual opção você prefere?', 'bot');
                          setShowQuickOptions(true);
                          setCurrentStep('flight-confirmation');
                        }, 4000);
                      }, 1000);
                    }, 2000);
                  }, 1000);
                }, 2000);
              }, 1000);
            }, 3000);
          }, 2000);
        }, 2000);
      }, 1000);
    }
  };

  const handleQuickOption = (option: string) => {
    setShowQuickOptions(false);
    handleSendMessage(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getQuickOptions = () => {
    switch (currentStep) {
      case 'transport':
        return ['Avião', 'Ônibus'];
      case 'baggage-option':
        return ['Sim, adicionar kit', 'Não, sem bagagem'];
      case 'pix-payment':
        return ['Ok, vou realizar o pagamento e volto rapidamente'];
      case 'payment-confirmed':
        return ['Sim, vamos continuar!'];
      case 'payment-timeout':
        return ['Sim, continuar cadastro'];
      case 'flight-confirmation':
        return ['Opção 1', 'Opção 2'];
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white rounded-t-lg">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
          
          {showPaymentStatus && (
            <div className="bg-yellow-100 border-t-2 border-yellow-400 px-4 py-3 text-yellow-800">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Aguardando retorno</span>
              </div>
              <div className="text-center text-yellow-700 text-sm mt-1">
                Tempo de inatividade: {Math.floor(paymentTimer / 60)}:{(paymentTimer % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}
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
                {message.text.includes('<div style=') ? (
                  <div dangerouslySetInnerHTML={{ __html: message.text }} />
                ) : (
                  <p className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{
                    __html: message.text
                      .replace(/Opção 1:/g, '<strong>Opção 1:</strong>')
                      .replace(/Opção 2:/g, '<strong>Opção 2:</strong>')
                  }} />
                )}
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
          <div className="px-4 pb-4">
            <div className="flex flex-col gap-3">
              {getQuickOptions().map((option, index) => (
                <button
                  key={`option-${currentStep}-${index}-${option}`}
                  onClick={() => handleQuickOption(option)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors text-left"
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