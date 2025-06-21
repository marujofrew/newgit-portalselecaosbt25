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
      text: "Iniciando conversa...",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('transport');
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nearestAirport, setNearestAirport] = useState<any>(null);
  const [flightDate, setFlightDate] = useState<string>('');
  const [lastModalState, setLastModalState] = useState<{type: string, data: any} | null>(null);
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

  // Salvar estado atual
  const saveCurrentState = () => {
    const state = {
      messages,
      currentStep,
      showQuickOptions,
      nearestAirport,
      flightDate,
      lastModalState
    };
    localStorage.setItem('chatBotState', JSON.stringify(state));
  };

  // Restaurar estado salvo
  const restoreState = () => {
    const savedState = localStorage.getItem('chatBotState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
        // Converter timestamps de volta para objetos Date
        const messagesWithDates = (state.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(messagesWithDates);
        setCurrentStep(state.currentStep || 'welcome');
        setShowQuickOptions(state.showQuickOptions || false);
        setNearestAirport(state.nearestAirport || null);
        setFlightDate(state.flightDate || '');
        setLastModalState(state.lastModalState || null);
        
        console.log('Estado restaurado:', state);
        
        // Se havia um modal aberto, reabrir automaticamente
        if (state.lastModalState && state.lastModalState.type === 'boardingPass') {
          console.log('Reabrindo modal do cartão de embarque');
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
        
        return true; // Estado foi restaurado
      } catch (error) {
        console.error('Erro ao restaurar estado:', error);
        return false;
      }
    }
    return false; // Nenhum estado para restaurar
  };

  // Salvar estado automaticamente quando houver mudanças
  useEffect(() => {
    if (isOpen) {
      saveCurrentState();
    }
  }, [messages, currentStep, showQuickOptions, nearestAirport, flightDate, lastModalState, isOpen]);

  useEffect(() => {
    // Adicionar funções globais para os cartões de embarque
    (window as any).openBoardingPass = (passId: string, passengerName: string, isAdult: boolean) => {
      // Salvar estado do modal
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
      // Limpar estado do modal
      if (setLastModalState) {
        setLastModalState(null);
      }
    };

    (window as any).saveBoardingPass = (passengerName: string, flightNumber: string) => {
      // Criar elemento temporário para download
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
      
      // Fechar modal automaticamente após 3 segundos
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

  // Calcular aeroporto mais próximo quando o componente abrir
  useEffect(() => {
    if (isOpen) {
      // Primeiro, tentar restaurar estado salvo
      const stateRestored = restoreState();
      
      // Se não restaurou estado e há dados do usuário, iniciar conversa
      if (!stateRestored && userData?.cep && !nearestAirport) {
        findNearestAirportFromCEP();
      }
      
      // Se não restaurou estado e é primeira vez, iniciar conversa
      if (!stateRestored && messages.length === 1 && messages[0].text === "Iniciando conversa...") {
        startInitialConversation();
      }
    }
    
    if (selectedDate) {
      calculateFlightDate();
    }
  }, [isOpen, userData, selectedDate]);

  const startInitialConversation = () => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const welcomeMessage: Message = {
          id: Date.now() + Math.random(),
          text: "Olá! Parabéns pelo agendamento confirmado! 🎉 Agora vou te ajudar com os próximos passos para sua viagem aos estúdios do SBT.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        
        // Segunda mensagem após mais alguns segundos
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const secondMessage: Message = {
              id: Date.now() + Math.random(),
              text: "O SBT irá custear suas passagens e hospedagem. Para isso, preciso de algumas informações. Você prefere viajar de avião ou ônibus?",
              sender: 'bot',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, secondMessage]);
            setShowQuickOptions(true);
          }, 3000); // Tempo fixo de 3 segundos
        }, 1000);
      }, 3000); // Tempo fixo de 3 segundos
    }, 2000);
  };

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

  const generateBoardingPasses = () => {
    const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
    const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
    
    // Gerar cartão do responsável primeiro
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responsavelFile = createBoardingPassFile(responsavelData.nome || 'RESPONSÁVEL', true);
        addMessage(responsavelFile, 'bot');
        
        // Gerar cartões dos candidatos
        candidatos.forEach((candidato: any, index: number) => {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              const candidatoFile = createBoardingPassFile(candidato.nome || `CANDIDATO ${index + 1}`, false);
              addMessage(candidatoFile, 'bot');
            }, 2000);
          }, (index + 1) * 3000);
        });
      }, 2000);
    }, 1000);
  };

  const createBoardingPassFile = (passengerName: string, isAdult: boolean) => {
    const passId = `pass-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 10px 0; max-width: 300px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onclick="window.openBoardingPass && window.openBoardingPass('${passId}', '${passengerName}', ${isAdult})" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 12px; border-radius: 8px; color: white; font-size: 20px; min-width: 48px; text-align: center;">
            ✈️
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 4px;">
              Cartão de Embarque - ${passengerName}
            </div>
            <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">
              Voo AD2768 • ${isAdult ? 'Adulto' : 'Menor'} • Assento 1D
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

  const createBoardingPassHTML = (passengerName: string, isAdult: boolean) => {
    const flightDate = selectedDate ? new Date(selectedDate) : new Date();
    const departureDate = new Date(flightDate);
    departureDate.setDate(flightDate.getDate() - (currentStep.includes('1') ? 2 : 1));
    
    const cityName = userCity || 'Goiânia';
    const originCode = cityName.includes('Goiânia') ? 'REC' : 'REC';
    const originCity = cityName.includes('Goiânia') ? 'RECIFE' : 'RECIFE';
    
    const boardingTime = '12:55';
    const departureTime = '13:20';
    const flightNumber = `2768`;
    const seat = `1D`;
    const ticketCode = `NF2NPC - 94`;

    return `
      <div style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%); border-radius: 20px; padding: 0; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 10px 0; position: relative; width: 350px; height: 600px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
        
        <!-- Header com logo e data/voo -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 24px 20px 24px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 32px; font-weight: 700; color: #60a5fa; font-family: Arial, sans-serif;">Azul</span>
            <div style="width: 24px; height: 20px; background: linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6); border-radius: 4px; margin-left: 4px;"></div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #94a3b8; line-height: 1.4;">
            <div style="font-weight: 600; margin-bottom: 2px;">DATA</div>
            <div style="font-weight: 700; color: white; font-size: 14px;">${departureDate.toLocaleDateString('pt-BR')}</div>
            <div style="font-weight: 600; margin-top: 8px; margin-bottom: 2px;">VOO</div>
            <div style="font-weight: 700; color: white; font-size: 14px;">${flightNumber}</div>
          </div>
        </div>
        
        <!-- Aeroportos -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 24px; margin-bottom: 32px;">
          <div style="text-align: left;">
            <div style="font-size: 12px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">${originCity}</div>
            <div style="font-size: 48px; font-weight: 700; letter-spacing: 1px; color: white;">${originCode}</div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: rgba(96, 165, 250, 0.1); border-radius: 50%; margin: 0 20px;">
            <div style="font-size: 24px; color: #60a5fa;">✈</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">SÃO PAULO - GUARULHOS</div>
            <div style="font-size: 48px; font-weight: 700; letter-spacing: 1px; color: white;">GRU</div>
          </div>
        </div>
        
        <!-- Informações de embarque -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0; padding: 0 24px; margin-bottom: 32px;">
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 8px;">INÍCIO EMBARQUE</div>
            <div style="font-size: 18px; font-weight: 700; color: white;">${boardingTime}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 8px;">FIM EMBARQUE</div>
            <div style="font-size: 18px; font-weight: 700; color: white;">${departureTime}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 8px;">SEÇÃO</div>
            <div style="font-size: 18px; font-weight: 700; color: white;">D</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 8px;">ASSENTO</div>
            <div style="font-size: 18px; font-weight: 700; color: white;">${seat}</div>
          </div>
        </div>
        
        <!-- Cliente e categoria -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 24px; margin-bottom: 40px;">
          <div>
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 8px;">CLIENTE</div>
            <div style="font-size: 18px; font-weight: 700; color: white;">${passengerName.toUpperCase()}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 700; color: #60a5fa;">
              Diamante
            </div>
          </div>
        </div>
        
        <!-- QR Code com fundo branco -->
        <div style="display: flex; justify-content: center; margin-bottom: 24px; padding: 0 24px;">
          <div style="background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NF2NPC-94-AZUL-${passengerName.replace(/\s+/g, '')}-${flightNumber}" style="width: 160px; height: 160px; display: block;" alt="QR Code" />
          </div>
        </div>
        
        <!-- Código do ticket -->
        <div style="text-align: center; font-size: 14px; font-weight: 700; color: #94a3b8; padding: 0 24px 24px 24px;">
          ${ticketCode}
        </div>
      </div>
    `;
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

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    addMessage(messageToSend, 'user');
    setIsTyping(true);
    setShowQuickOptions(false);
    
    // Processar resposta do bot baseado no step atual com delay variável de 2-4 segundos
    const typingTime = Math.floor(Math.random() * 2000) + 2000; // 2-4 segundos aleatórios
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
          } else if (messageToSend.toLowerCase().includes('onibus') || messageToSend.toLowerCase().includes('ônibus')) {
            botResponse = botResponses.transport.onibus;
            nextStep = 'city';
          } else {
            botResponse = "Por favor, escolha uma das opções acima para que eu possa te ajudar melhor.";
            showOptions = true;
          }
          break;
          
        case 'flight-confirmation':
          if (messageToSend.toLowerCase().includes('opção 1') || messageToSend.toLowerCase().includes('opcao 1')) {
            botResponse = "Perfeito, vou realizar a compra de suas passagens, logo em seguida te envio os cartões de embarque, só um instante...";
            nextStep = 'hotel';
            showOptions = false;
            
            // Simular processamento e depois mostrar hospedagem
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage("Pronto! Já realizei a compra de suas passagens aéreas, agora vou te enviar os cartões de embarque. Salve os cartões em seu celular para evitar problemas no embarque.", 'bot');
                
                // Enviar cartões de embarque
                setTimeout(() => {
                  generateBoardingPasses();
                }, 2000);
                
                // Após alguns segundos, continuar para hospedagem
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
            botResponse = "Perfeito, vou realizar a compra de suas passagens, logo em seguida te envio os cartões de embarque, só um instante...";
            nextStep = 'hotel';
            showOptions = false;
            
            // Simular processamento e depois mostrar hospedagem
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage("Pronto! Já realizei a compra de suas passagens aéreas, agora vou te enviar os cartões de embarque. Salve os cartões em seu celular para evitar problemas no embarque.", 'bot');
                
                // Enviar cartões de embarque
                setTimeout(() => {
                  generateBoardingPasses();
                }, 2000);
                
                // Após alguns segundos, continuar para hospedagem
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
      
      // Se foi escolhido avião, enviar informação sobre o voo encontrado
      if (currentStep === 'transport' && (messageToSend.toLowerCase().includes('aviao') || messageToSend.toLowerCase().includes('avião'))) {
        console.log('Avião selecionado, nearestAirport:', nearestAirport, 'flightDate:', flightDate);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            let flightInfo = '';
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
              // Usar data do agendamento selecionada
              const appointmentDate = new Date(selectedDate);
              
              // Opção 1: 2 dias antes do agendamento
              const flightDate1 = new Date(appointmentDate);
              flightDate1.setDate(appointmentDate.getDate() - 2);
              date1 = flightDate1.toLocaleDateString('pt-BR');
              
              // Opção 2: 1 dia antes do agendamento
              const flightDate2 = new Date(appointmentDate);
              flightDate2.setDate(appointmentDate.getDate() - 1);
              date2 = flightDate2.toLocaleDateString('pt-BR');
            } else {
              // Fallback caso não tenha data selecionada
              const currentDate = new Date();
              const flightDateCalc = new Date(currentDate);
              flightDateCalc.setDate(currentDate.getDate() + 3);
              date1 = flightDateCalc.toLocaleDateString('pt-BR');
              
              const flightDateCalc2 = new Date(currentDate);
              flightDateCalc2.setDate(currentDate.getDate() + 4);
              date2 = flightDateCalc2.toLocaleDateString('pt-BR');
            }
            
            // Enviar mensagens sequenciais
            console.log('Enviando mensagens do voo em sequência');
            
            // Mensagem 1
            addMessage('✈️ Perfeito! Encontrei duas opções de voos disponíveis:', 'bot');
            
            // Mensagem 2
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage(`🔸 Opção 1: ${airportName} (${airportCode}) → São Paulo\nData: ${date1} | Horário: 08:30 | Duração: 2h15min`, 'bot');
                
                // Mensagem 3
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    addMessage(`🔸 Opção 2: ${airportName} (${airportCode}) → São Paulo\nData: ${date2} | Horário: 14:45 | Duração: 2h15min`, 'bot');
                    
                    // Mensagem 4
                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage('Qual opção você prefere?', 'bot');
                        setShowQuickOptions(true);
                        setCurrentStep('flight-confirmation');
                      }, 2000);
                    }, 1000);
                  }, 2000);
                }, 1000);
              }, 2000);
            }, 1000);
          }, 3000);
        }, 2000);
      }

    }, typingTime);

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