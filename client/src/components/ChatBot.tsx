import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useLocation } from 'wouter';
import rebecaAvatar from '@assets/telemarketing_reproduz_1750494256177.jpg';
import bagagemDoBemImage from '@assets/assets_task_01jyfgjxwkets8k907ads1nc55_1750719962_img_1_1750728660025.webp';
import bagagemDoBemVanImage from '@assets/assets_task_01jyfrshw7fw098r2wem6jjtgt_1750728607_img_1_1750729197124.webp';
import hotelRoomImage from '@assets/Leon-Park-157-1024x680_1750729457567.jpg';
import hotelRoomVanImage from '@assets/Leon-Park-157-1024x680_1750730216204.jpg';
import { ChatStorage } from '../utils/chatStorage';

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
  isMinimized?: boolean;
  onMinimize?: () => void;
  onExpand?: () => void;
}

export default function ChatBot({ isOpen, onClose, userCity, userData, selectedDate, isMinimized = false, onMinimize, onExpand }: ChatBotProps) {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('greeting');
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<string>('');
  const [selectedFlightOption, setSelectedFlightOption] = useState<string>('');
  const [hasBaggage, setHasBaggage] = useState<boolean>(false);
  const [nearestAirport, setNearestAirport] = useState<any>(null);
  const [internalMinimized, setInternalMinimized] = useState(isMinimized);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Debug - log estado atual
  useEffect(() => {
    console.log('🔍 Estado atual do chat:', {
      isOpen,
      isInitialized,
      messagesCount: messages.length,
      currentStep,
      showQuickOptions,
      isTyping
    });
  }, [isOpen, isInitialized, messages.length, currentStep, showQuickOptions, isTyping]);

  // Remover sistema antigo de localStorage - substituído pelo backup unificado

  // Salvar estado atual no armazenamento
  const saveCurrentState = () => {
    ChatStorage.saveState({
      messages,
      currentStep,
      showQuickOptions,
      isTyping,
      showPaymentStatus,
      paymentTimer,
      selectedTransport,
      selectedFlightOption,
      hasBaggage,
      nearestAirport,
      isInitialized
    });
  };

  // Restaurar estado completo do armazenamento
  const restoreState = () => {
    if (ChatStorage.hasConversation()) {
      const state = ChatStorage.getState();
      console.log('🔄 Restaurando estado completo:', {
        mensagens: state.messages.length,
        passo: state.currentStep,
        opcoes: state.showQuickOptions,
        transporte: state.selectedTransport,
        voo: state.selectedFlightOption,
        bagagem: state.hasBaggage
      });
      
      // Restaurar TODOS os estados
      setMessages(state.messages || []);
      setCurrentStep(state.currentStep || 'greeting');
      setShowQuickOptions(state.showQuickOptions || false);
      setIsTyping(false); // Sempre iniciar sem estar digitando
      setShowPaymentStatus(state.showPaymentStatus || false);
      setPaymentTimer(state.paymentTimer || 0);
      setSelectedTransport(state.selectedTransport || '');
      setSelectedFlightOption(state.selectedFlightOption || '');
      setHasBaggage(state.hasBaggage || false);
      setNearestAirport(state.nearestAirport || null);
      setIsInitialized(true);
      
      console.log('✅ Estado restaurado - Mensagens:', state.messages.length, 'Passo atual:', state.currentStep);
      
      // Garantir que o scroll vá para a última mensagem
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      return true;
    }
    console.log('❌ Nenhuma conversa encontrada para restaurar');
    return false;
  };

  // Timer effect for payment countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showPaymentStatus && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer(prev => {
          if (prev <= 1) {
            setShowPaymentStatus(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showPaymentStatus, paymentTimer]);

  // Sistema de inicialização com continuidade de conversa garantida
  useEffect(() => {
    if (isOpen && !isInitialized) {
      console.log('🔄 Iniciando sistema de chat...');
      
      const currentPage = window.location.pathname;
      ChatStorage.markAsActive(currentPage);
      
      // Se estivermos na página de agendamento, SEMPRE iniciar nova conversa (ignorar backup)
      if (currentPage === '/agendamento') {
        console.log('🆕 PÁGINA DE AGENDAMENTO - Ignorando qualquer backup e iniciando nova conversa');
        // Pular verificação de conversa existente na página de agendamento
      } else {
        // Verificar se há conversa salva apenas para outras páginas
        const hasExistingConversation = ChatStorage.hasConversation();
        console.log('📋 Verificando conversa existente para página:', currentPage, hasExistingConversation);
        
        if (hasExistingConversation) {
          console.log('✅ Restaurando conversa completa para página:', currentPage);
          const restored = restoreState();
          
          if (restored) {
            console.log('🎯 Conversa restaurada - Total de mensagens:', messages.length);
            
            // Se estivermos na página de cartão preview e há conversa, 
            // garantir que continue do passo correto
            if (currentPage === '/cartao-preview' && currentStep === 'greeting') {
              console.log('🔧 Corrigindo passo para continuar na página de cartões...');
              setCurrentStep('boarding-passes');
              setShowQuickOptions(true);
              ChatStorage.updateStep('boarding-passes');
              ChatStorage.updateQuickOptions(true);
            }
            
            return;
          }
        }
      }
      
      // Iniciar nova conversa se necessário
      console.log('🆕 Iniciando nova conversa na página:', currentPage);
      
      // Limpar estado anterior apenas se estivermos na página de agendamento
      if (currentPage === '/agendamento') {
        console.log('🧹 Limpeza do estado do chat para nova conversa...');
        ChatStorage.clearConversation();
      }
      
      // Resetar completamente todos os estados
      setMessages([]);
      setCurrentStep('greeting');
      setShowQuickOptions(false);
      setIsTyping(false);
      setShowPaymentStatus(false);
      setPaymentTimer(0);
      setSelectedTransport('');
      setSelectedFlightOption('');
      setHasBaggage(false);
      setNearestAirport(null);
      
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      ChatStorage.setUserContext(responsavelData);
      
      if (responsavelData.cep) {
        findNearestAirportFromCEP(responsavelData.cep);
      }
      
      setIsInitialized(true);
      
      // Iniciar conversa com animação de digitação
      console.log('🚀 Iniciando nova conversa...');
      
      const initializeChat = () => {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          const welcomeMessage: Message = {
            id: Date.now(),
            text: "Olá! Sou a Rebeca, assistente da **SBT**. Preciso organizar sua viagem para São Paulo. Vamos começar com o transporte - você prefere viajar de **avião** ou **Van**?",
            sender: 'bot',
            timestamp: new Date()
          };
          
          console.log('📨 Enviando mensagem de boas-vindas');
          setMessages([welcomeMessage]);
          setCurrentStep('greeting');
          setShowQuickOptions(true);
          
          // Salvar no storage apenas após a mensagem ser definida
          ChatStorage.addMessage(welcomeMessage);
          ChatStorage.updateStep('greeting');
          ChatStorage.updateQuickOptions(true);
          
          console.log('✅ Chat inicializado com sucesso');
        }, 2000);
      };
      
      // Executar imediatamente
      initializeChat();
    }
  }, [isOpen, isInitialized]);

  // Salvar estado a cada mudança importante com contexto
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      saveCurrentState();
      // Salvar contexto adicional
      const userContext = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      ChatStorage.setUserContext(userContext);
    }
  }, [messages, currentStep, selectedTransport, selectedFlightOption, hasBaggage, showPaymentStatus, isTyping, showQuickOptions, isInitialized]);

  // REMOVIDO - Sistema antigo conflitante

  const findNearestAirportFromCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data && !data.erro) {
        // Lógica simplificada para alguns aeroportos principais
        const cityState = `${data.localidade}-${data.uf}`.toLowerCase();

        if (cityState.includes('goiânia') || cityState.includes('goiania')) {
          setNearestAirport({ code: 'GYN', city: 'GOIÂNIA', name: 'Aeroporto Santa Genoveva' });
        } else if (cityState.includes('brasília') || cityState.includes('brasilia')) {
          setNearestAirport({ code: 'BSB', city: 'BRASÍLIA', name: 'Aeroporto de Brasília' });
        } else if (cityState.includes('belo horizonte')) {
          setNearestAirport({ code: 'CNF', city: 'BELO HORIZONTE', name: 'Aeroporto de Confins' });
        } else if (cityState.includes('salvador')) {
          setNearestAirport({ code: 'SSA', city: 'SALVADOR', name: 'Aeroporto de Salvador' });
        } else if (cityState.includes('rio de janeiro')) {
          setNearestAirport({ code: 'GIG', city: 'RIO DE JANEIRO', name: 'Aeroporto Galeão' });
        } else {
          // Default para Goiânia
          setNearestAirport({ code: 'GYN', city: 'GOIÂNIA', name: 'Aeroporto Santa Genoveva' });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setNearestAirport({ code: 'GYN', city: 'GOIÂNIA', name: 'Aeroporto Santa Genoveva' });
    }
  };

  const handlePixPayment = () => {
    console.log('🔥 Redirecionando para pagamento PIX...');
    
    // Minimizar chat antes de redirecionar
    if (onMinimize) {
      onMinimize();
    } else {
      setInternalMinimized(true);
    }
    
    // Salvar estado e redirecionar
    ChatStorage.markFlowAsContinuing(['Aguardando confirmação do pagamento...']);
    setLocation('/pix-payment');
  };

  const createBaggagePixPayment = async () => {
    try {
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      
      const response = await fetch('/api/pix/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: responsavelData.nome || 'Cliente SBT',
          email: responsavelData.email || 'cliente@sbt.com.br',
          cpf: responsavelData.cpf || '00000000000',
          amount: 2990, // R$ 29,90 em centavos
          description: 'Kit **Bagagem** **SBT** - Programa **Bagagem do Bem**',
          phone: responsavelData.telefone || '11999999999'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Criar mensagem simplificada que será renderizada como JSX
        const pixMessage = `PIX_COMPONENT:${JSON.stringify({
          type: 'baggage',
          amount: data.payment.formatted_amount,
          pixCode: data.payment.pix_code
        })}`;
        addMessage(pixMessage, 'bot');
        
        // Salvar dados do pagamento para verificação posterior
        localStorage.setItem('baggagePaymentId', data.payment.id);
        
        // Marcar que está aguardando pagamento
        ChatStorage.setAwaitingPayment(data.payment.id);
        
        // Iniciar verificação de pagamento com gateway
        startPaymentVerification(data.payment.id, 'baggage');
        console.log('💳 PIX bagagem criado:', data.payment.id);
      } else {
        addMessage('Chave PIX copia e cola: [Erro ao gerar PIX]', 'bot');
        console.error('Erro ao criar PIX:', data.error);
      }
    } catch (error) {
      console.error('Erro ao criar PIX para bagagem:', error);
      addMessage('Chave PIX copia e cola: [Erro de conexão]', 'bot');
    }
  };

  const createInscriptionPixPayment = async (valorTotal: number) => {
    try {
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      const valorEmCentavos = Math.round(valorTotal * 100);
      
      const response = await fetch('/api/pix/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: responsavelData.nome || 'Cliente SBT',
          email: responsavelData.email || 'cliente@sbt.com.br',
          cpf: responsavelData.cpf || '00000000000',
          amount: valorEmCentavos,
          description: 'Inscrição SBT Casting - Seleção de Atores Mirins',
          phone: responsavelData.telefone || '11999999999'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Criar mensagem para inscrição que será renderizada como JSX
        const pixMessage = `PIX_COMPONENT:${JSON.stringify({
          type: 'inscription',
          amount: data.payment.formatted_amount,
          pixCode: data.payment.pix_code
        })}`;
        addMessage(pixMessage, 'bot');
        
        // Salvar dados do pagamento para verificação posterior
        localStorage.setItem('inscriptionPaymentId', data.payment.id);
        
        // Iniciar verificação de pagamento com gateway
        startPaymentVerification(data.payment.id, 'inscription');
        console.log('💳 PIX inscrição criado:', data.payment.id);
      } else {
        addMessage(`QR Code + Chave PIX copia e cola: [Erro ao gerar PIX]\nValor: R$ ${valorTotal.toFixed(2).replace('.', ',')}`, 'bot');
        console.error('Erro ao criar PIX de inscrição:', data.error);
      }
    } catch (error) {
      console.error('Erro ao criar PIX para inscrição:', error);
      addMessage(`QR Code + Chave PIX copia e cola: [Erro de conexão]\nValor: R$ ${valorTotal.toFixed(2).replace('.', ',')}`, 'bot');
    }
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

  const getQuickOptions = () => {
    switch (currentStep) {
      case 'greeting':
        return ['**Avião**', '**Van**'];

      case 'flight-options':
        return ['Opção 1', 'Opção 2'];

      case 'baggage-offer':
        return ['Sim, adicionar kit bagagem', 'Não quero bagagem'];

      case 'baggage-payment':
        return ['OK, vou realizar o pagamento e volto rapidamente'];

      case 'baggage-payment-confirmed':
        return ['Sim, vamos prosseguir!'];

      case 'baggage-payment-timeout':
        return ['Continuar sem bagagem', 'Já fiz o pagamento'];
      
      case 'baggage_payment_timeout':
        return ['Continuar sem bagagem', 'Já fiz o pagamento'];

      case 'boarding-passes':
        return ['Vamos continuar'];

      case 'van-confirmation':
        return ['Sim, pode confirmar!'];

      case 'van-baggage-offer':
        return ['Sim, adicionar kit bagagem', 'Não quero bagagem'];

      case 'van-baggage-payment':
        return ['OK, vou realizar o pagamento e volto rapidamente'];

      case 'van-baggage-payment-confirmed':
        return ['Sim, vamos prosseguir!'];

      case 'van-baggage-payment-timeout':
        return ['Continuar sem bagagem', 'Já fiz o pagamento'];
      
      case 'van_baggage_payment_timeout':
        return ['Continuar sem bagagem', 'Já fiz o pagamento'];

      case 'hotel-reservation':
        return ['Vamos finalizar'];

      case 'inscription-info':
        return ['OK, eu entendi!'];

      case 'inscription-payment':
        return ['OK vou realizar o pagamento e volto rapidamente!'];
      
      case 'inscription_payment_timeout':
        return ['Cancelar inscrição', 'Já fiz o pagamento'];

      default:
        return [];
    }
  };

  const generateBoardingPasses = () => {
    try {
      // Recuperar dados do localStorage
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');

      const passengers = [
        { name: responsavelData.nome || 'RESPONSÁVEL', type: 'Responsável', isMain: true }
      ];

      candidatos.forEach((candidato: any, index: number) => {
        passengers.push({
          name: candidato.nome || `CANDIDATO ${index + 1}`,
          type: `Candidato ${index + 1}`,
          isMain: false
        });
      });

      // Verificar se a função global existe
      if (typeof window.openUnifiedBoardingPass === 'function') {
        window.openUnifiedBoardingPass(passengers);
      } else {
        console.error('Função de cartões de embarque não encontrada');
      }
    } catch (error) {
      console.error('Erro ao gerar cartões de embarque:', error);
    }
  };

  const generateCredentials = () => {
    try {
      // Recuperar dados do localStorage
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');

      const credentials = [
        { name: responsavelData.nome || 'RESPONSÁVEL', type: 'Responsável', isMain: true }
      ];

      candidatos.forEach((candidato: any, index: number) => {
        credentials.push({
          name: candidato.nome || `CANDIDATO ${index + 1}`,
          type: `Candidato ${index + 1}`,
          isMain: false
        });
      });

      // Mostrar credenciais como documento clicável
      addMessage("📄 **Credenciais SBT** - Clique para visualizar e fazer download", 'bot');

      // Simular abertura de modal de credenciais (similar aos cartões de embarque)
      console.log('Gerando credenciais para:', credentials);

    } catch (error) {
      console.error('Erro ao gerar credenciais:', error);
    }
  };

  const handleSendMessage = (messageToSend: string) => {
    if (!messageToSend.trim()) return;

    addMessage(messageToSend, 'user');

    let botResponse = "";
    let nextStep = currentStep;
    let showOptions = false;

    switch (currentStep) {
      case 'greeting':
        if (messageToSend.toLowerCase().includes('avião') || messageToSend.toLowerCase().includes('aviao')) {
          setSelectedTransport('aviao');
          botResponse = "Perfeito! **Avião** é mais rápido. Vou buscar os melhores voos saindo do aeroporto mais próximo de você para São Paulo.";
          nextStep = 'flight-search';
          showOptions = false;

          // Sequência de mensagens com delay de 5 segundos
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
              const cidadeInfo = responsavelData.cidade || userCity || 'sua cidade';
              addMessage(`Identifiquei que você está em **${cidadeInfo}**. Isso vai me ajudar a encontrar as melhores opções de viagem.`, 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage('Encontrei duas opções de voos disponíveis:', 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);

                      // Calcular datas baseadas no agendamento
                      let option1Date = '';
                      let option2Date = '';

                      if (selectedDate) {
                        const appointmentDate = new Date(selectedDate);
                        const option1DateObj = new Date(appointmentDate);
                        option1DateObj.setDate(appointmentDate.getDate() - 1);
                        option1Date = option1DateObj.toLocaleDateString('pt-BR');

                        const option2DateObj = new Date(appointmentDate);
                        option2DateObj.setDate(appointmentDate.getDate() - 2);
                        option2Date = option2DateObj.toLocaleDateString('pt-BR');
                      }

                      const airportCode = nearestAirport?.code || 'GYN';
                      const airportCity = nearestAirport?.city || 'GOIÂNIA';

                      addMessage(`🔸 Opção 1: ${airportCity} (${airportCode}) → São Paulo\nData: ${option1Date || 'Data flexível'} | Horário: 08:30 | Duração: 2h15min`, 'bot');

                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage(`🔸 Opção 2: ${airportCity} (${airportCode}) → São Paulo\nData: ${option2Date || 'Data flexível'} | Horário: 08:30 | Duração: 2h15min`, 'bot');

                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              setIsTyping(false);
                              addMessage('Qual opção você prefere?', 'bot');
                              setShowQuickOptions(true);
                              setCurrentStep('flight-options');
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
        } else if (messageToSend.toLowerCase().includes('van')) {
          setSelectedTransport('van');
          botResponse = "Ok, vou verificar a rota de nossa **Van**, para encaixar sua localização!";
          nextStep = 'van-search';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Só mais 1 minuto...", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);

                  let vanDate = '';
                  if (selectedDate) {
                    const appointmentDate = new Date(selectedDate);
                    const vanDateObj = new Date(appointmentDate);
                    vanDateObj.setDate(appointmentDate.getDate() - 3);
                    vanDate = vanDateObj.toLocaleDateString('pt-BR');
                  }

                  addMessage(`Certo, verifiquei que dia **${vanDate || 'XX/XX'}** (3 dias antes do dia da data selecionada para agendamento de teste), a nossa **van** que busca os **candidatos** em todo o Brasil, vai estar próxima à localização.`, 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage(`Então conseguimos agendar para o motorista buscar vocês dia **${vanDate || 'XX/XX'}** às **13:40h**, posso confirmar?`, 'bot');
                      setShowQuickOptions(true);
                      setCurrentStep('van-confirmation');
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'flight-options':
        if (messageToSend.toLowerCase().includes('opção 1') || messageToSend.toLowerCase().includes('opcao 1')) {
          setSelectedFlightOption('1');
          localStorage.setItem('selectedFlightOption', '1');
        } else if (messageToSend.toLowerCase().includes('opção 2') || messageToSend.toLowerCase().includes('opcao 2')) {
          setSelectedFlightOption('2');
          localStorage.setItem('selectedFlightOption', '2');
        }

        const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
        botResponse = `Senhor(a) **${responsavelData.nome || ''}**, lembrando que as passagens são custeadas pelo **SBT**, ou seja, não terá gasto algum com passagens.`;
        nextStep = 'flight-payment-info';
        showOptions = false;

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage('Antes de finalizar a compra de suas passagens, tenho que te dar um aviso importante.', 'bot');

            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage('Na passagem não está incluso **bagagem**. Caso precise levar uma **bagagem** temos um programa em parceria com a **AZUL**, chamado "**BAGAGEM DO BEM**" que por apenas **R$ 29,90** você tem direito ao kit **bagagem** e todo o valor arrecadado é **doado** ao **TELETON 2025**.', 'bot');

                // Adicionar imagem promocional após a mensagem sobre bagagem
                setTimeout(() => {
                  const imageMessage: Message = {
                    id: Date.now(),
                    text: `<img src="${bagagemDoBemImage}" alt="Bagagem do Bem - Programa SBT + Azul + Teleton" class="w-full max-w-sm mx-auto rounded-lg shadow-md" />`,
                    sender: 'bot',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, imageMessage]);

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage('Você gostaria de incluir **bagagem** por **R$ 29,90** ou prefere viajar apenas com **bagagem** de mão?', 'bot');
                      setShowQuickOptions(true);
                      setCurrentStep('baggage-offer');
                    }, 5000);
                  }, 3000);
                }, 2000);
              }, 5000);
            }, 5000);
          }, 5000);
        }, 5000);
        break;

      case 'baggage-offer':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('adicionar')) {
          setHasBaggage(true);
          botResponse = "Perfeito! Kit bagagem adicionado por R$ 29,90.";
          nextStep = 'baggage-payment-info';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Vou te enviar a chave PIX copia e cola para você fazer o pagamento do adicional de bagagem.", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Nosso chat irá se encerrar automaticamente em 5 minutos se não houver nenhuma atividade ou retorno. Realize o pagamento e volte antes de 5 minutos para evitar de recomeçar o cadastro do início.", 'bot');
                  setShowQuickOptions(true);
                  setCurrentStep('baggage-payment');
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        } else {
          setHasBaggage(false);
          botResponse = "Ok, vou finalizar a compra das suas passagens, aguarde um segundo!";
          nextStep = 'boarding-passes';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto, suas passagens estão compradas, vou te enviar os seus cartões de embarque!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Faça o download dos seus cartões de embarque para facilitar o seu embarque: <a href='/cartao-preview'  style='color: #3b82f6; text-decoration: underline;'>Ver Cartões de Embarque</a>", 'bot');

                  setTimeout(() => {
                    generateBoardingPasses();

                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage("Fique tranquilo, caso não tenha feito o download dos cartões de embarque iremos enviar em seu WhatsApp, vamos continuar?", 'bot');
                        setShowQuickOptions(true);
                        setCurrentStep('boarding-passes');
                      }, 5000);
                    }, 3000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'baggage-payment':
        if (messageToSend.toLowerCase().includes('ok') || messageToSend.toLowerCase().includes('rapidamente')) {
          botResponse = "Tabom, vou te enviar a chave Pix para você efetuar o pagamento!";
          nextStep = 'baggage-pix';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              
              // Gerar PIX real para bagagem (rota avião)
              createBaggagePixPayment();

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Lembre-se: assim que realizar o pagamento, volte aqui para concluirmos o cadastro por completo. Te aguardo!", 'bot');

                  setShowPaymentStatus(true);
                  setPaymentTimer(300); // 5 minutos
                  setCurrentStep('waiting-baggage-payment');

                  // Sistema de verificação real do gateway implementado

                  // Timeout após 2 minutos
                  setTimeout(() => {
                    if (currentStep === 'waiting-baggage-payment') {
                      setShowPaymentStatus(false);
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage("Não consegui confirmar seu pagamento, vamos continuar sem adicionar o kit bagagem?", 'bot');
                        setShowQuickOptions(true);
                        setCurrentStep('baggage-payment-timeout');
                      }, 5000);
                    }
                  }, 120000);

                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'baggage-payment-confirmed':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('prosseguir')) {
          botResponse = "Ok, vou finalizar a compra das suas passagens, aguarde um segundo!";
          nextStep = 'boarding-passes';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Pronto, suas passagens estão compradas, vou te enviar os seus cartões de embarque!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Faça o download dos seus cartões de embarque para facilitar o seu embarque: <a href='/cartao-preview'  style='color: #3b82f6; text-decoration: underline;'>Ver Cartões de Embarque</a>", 'bot');

                  setTimeout(() => {
                    generateBoardingPasses();

                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage("Fique tranquilo, caso não tenha feito o download dos cartões de embarque iremos enviar em seu WhatsApp, vamos continuar?", 'bot');
                        setShowQuickOptions(true);
                        setCurrentStep('boarding-passes');
                      }, 5000);
                    }, 3000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'baggage-payment-timeout':
      case 'baggage_payment_timeout':
        if (messageToSend.toLowerCase().includes('continuar sem bagagem')) {
          setShowPaymentStatus(false);
          setHasBaggage(false);
          ChatStorage.clearPaymentState();
          botResponse = "Ok, vou finalizar a compra das suas passagens, aguarde um segundo!";
          nextStep = 'boarding-passes';
          showOptions = false;
        } else if (messageToSend.toLowerCase().includes('já fiz o pagamento')) {
          setShowPaymentStatus(false);
          setHasBaggage(true);
          botResponse = "Perfeito! Vou aguardar mais um pouco a confirmação do pagamento da bagagem.";
          
          // Reativar verificação de pagamento
          const paymentId = localStorage.getItem('baggagePaymentId');
          if (paymentId) {
            ChatStorage.setAwaitingPayment(paymentId);
            startPaymentVerification(paymentId, 'baggage');
          }
          return;
        } else {
          // Fallback para opções antigas
          if (messageToSend.toLowerCase().includes('cancelar') || messageToSend.toLowerCase().includes('continuar')) {
            setShowPaymentStatus(false);
            setHasBaggage(false);
            botResponse = "Ok, vou finalizar a compra das suas passagens, aguarde um segundo!";
            nextStep = 'boarding-passes';
            showOptions = false;
          } else if (messageToSend.toLowerCase().includes('já fiz') || messageToSend.toLowerCase().includes('pagamento')) {
            setShowPaymentStatus(false);
            setHasBaggage(true);
            botResponse = "Perfeito! Vou aguardar mais um pouco a confirmação do pagamento da bagagem.";
            
            const paymentId = localStorage.getItem('baggagePaymentId');
            if (paymentId) {
              startPaymentVerification(paymentId, 'baggage');
            }
            return;
          }
        }

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("Pronto, suas passagens estão compradas, vou te enviar os seus cartões de embarque!", 'bot');

            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage("Faça o download dos seus cartões de embarque para facilitar o seu embarque: <a href='/cartao-preview'  style='color: #3b82f6; text-decoration: underline;'>Ver Cartões de Embarque</a>", 'bot');

                setTimeout(() => {
                  generateBoardingPasses();

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Fique tranquilo, caso não tenha feito o download dos cartões de embarque iremos enviar em seu WhatsApp, vamos continuar?", 'bot');
                      setShowQuickOptions(true);
                      setCurrentStep('boarding-passes');
                    }, 5000);
                  }, 3000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }, 5000);
        break;

      case 'van-confirmation':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('confirmar')) {
          let vanDate = '';
          if (selectedDate) {
            const appointmentDate = new Date(selectedDate);
            const vanDateObj = new Date(appointmentDate);
            vanDateObj.setDate(appointmentDate.getDate() - 3);
            vanDate = vanDateObj.toLocaleDateString('pt-BR');
          }

          botResponse = `Tudo certo, sua viagem já está agendada, e dia **${vanDate || 'XX/XX'}** às **13:40h** o motorista do **SBT** junto com a **Van** estará em sua porta, para te buscar!`;
          nextStep = 'van-baggage-info';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Antes de prosseguir quero te dar uma informação importante!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Como nosso espaço em van é reduzido, precisamos levar outra Van onde fica responsável para transportar apenas bagagens de nossos candidatos. Caso precise levar uma bagagem temos um programa chamado \"Bagagem do Bem\" que por apenas R$ 29,90 você tem direito ao kit bagagem e todo o valor arrecadado é doado ao TELETON 2025.", 'bot');

                  // Adicionar imagem promocional da van após a mensagem sobre bagagem
                  setTimeout(() => {
                    const imageMessage: Message = {
                      id: Date.now(),
                      text: `<img src="${bagagemDoBemVanImage}" alt="Bagagem do Bem - Van SBT + Teleton" class="w-full max-w-sm mx-auto rounded-lg shadow-md" />`,
                      sender: 'bot',
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, imageMessage]);

                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage("Você gostaria de incluir bagagem por R$ 29,90 ou prefere viajar apenas com bagagem de mão?", 'bot');
                        setShowQuickOptions(true);
                        setCurrentStep('van-baggage-offer');
                      }, 5000);
                    }, 3000);
                  }, 2000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'van-baggage-offer':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('adicionar')) {
          setHasBaggage(true);
          botResponse = "Perfeito! Kit bagagem adicionado por R$ 29,90.";
          nextStep = 'van-baggage-payment-info';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Vou te enviar a chave PIX copia e cola para você fazer o pagamento do adicional de bagagem.", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Nosso chat irá se encerrar automaticamente em 5 minutos se não houver nenhuma atividade ou retorno. Realize o pagamento e volte antes de 5 minutos para evitar de recomeçar o cadastro do início.", 'bot');
                  setShowQuickOptions(true);
                  setCurrentStep('van-baggage-payment');
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        } else {
          setHasBaggage(false);
          botResponse = "Agora vou organizar a reserva do hotel que vai te hospedar após sua chegada no SBT.";
          nextStep = 'hotel-step1';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Em nossa sede, temos quartos de hotel onde hospedamos nossos candidatos com conforto e excelência!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("A única coisa que preciso fazer é deixar reservada sua estadia, só um minuto que já estou cuidando disso!", 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Esse é o quarto que você e os candidatos vão ficar:", 'bot');

                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          // Adicionar imagem do quarto de hotel específica para fluxo de van
                          const imageMessage: Message = {
                            id: Date.now() + 1,
                            text: `<img src="${hotelRoomVanImage}" alt="Quarto de hotel SBT - Conforto e excelência" class="w-full max-w-sm mx-auto rounded-lg shadow-md" />`,
                            sender: 'bot',
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, imageMessage]);

                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              setIsTyping(false);
                              addMessage("Lembrando que toda alimentação também será custeada pelo SBT.", 'bot');

                              setTimeout(() => {
                                setIsTyping(true);
                                setTimeout(() => {
                                  setIsTyping(false);
                                  addMessage("Estou finalizando sua reserva!", 'bot');

                                  setTimeout(() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      setIsTyping(false);
                                      addMessage("Pronto, sua reserva foi feita, vou te enviar o comprovante em seu WhatsApp, após conclusão da inscrição!", 'bot');

                                      setTimeout(() => {
                                        setIsTyping(true);
                                        setTimeout(() => {
                                          setIsTyping(false);
                                          addMessage("Vamos finalizar sua inscrição?", 'bot');
                                          setShowQuickOptions(true);
                                          setCurrentStep('hotel-reservation');
                                        }, 5000);
                                      }, 5000);
                                    }, 5000);
                                  }, 5000);
                                }, 5000);
                              }, 5000);
                            }, 5000);
                          }, 3000);
                        }, 5000);
                      }, 2000);
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
              addMessage("Em nossa sede, temos quartos de hotel onde hospedamos nossos candidatos com conforto e excelência!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("A única coisa que preciso fazer é deixar reservada sua estadia, só um minuto que já estou cuidando disso!", 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Esse é o quarto que você e os candidatos vão ficar:", 'bot');

                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage("Lembrando que toda alimentação também será custeada pelo SBT.", 'bot');

                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              setIsTyping(false);
                              addMessage("Estou finalizando sua reserva!", 'bot');

                              setTimeout(() => {
                                setIsTyping(true);
                                setTimeout(() => {
                                  setIsTyping(false);
                                  addMessage("Pronto, sua reserva foi feita, vou te enviar o comprovante em seu WhatsApp, após conclusão da inscrição!", 'bot');

                                  setTimeout(() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      setIsTyping(false);
                                      addMessage("Vamos finalizar sua inscrição?", 'bot');
                                      setShowQuickOptions(true);
                                      setCurrentStep('hotel-reservation');
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
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'van-baggage-payment':
        if (messageToSend.toLowerCase().includes('ok') || messageToSend.toLowerCase().includes('rapidamente')) {
          botResponse = "Tabom, vou te enviar a chave Pix para você efetuar o pagamento!";
          nextStep = 'van-baggage-pix';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              
              // Gerar PIX real para bagagem van
              createBaggagePixPayment();

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Lembre-se: assim que realizar o pagamento, volte aqui para concluirmos o cadastro por completo. Te aguardo!", 'bot');

                  setCurrentStep('waiting-van-baggage-payment');

                  // Sistema de verificação real implementado via startPaymentVerification

                  // Timeout após 2 minutos
                  setTimeout(() => {
                    if (currentStep === 'waiting-van-baggage-payment') {
                      setShowPaymentStatus(false);
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage("Não consegui confirmar seu pagamento, vamos continuar sem adicionar o kit bagagem?", 'bot');
                        setShowQuickOptions(true);
                        setCurrentStep('van-baggage-payment-timeout');
                      }, 5000);
                    }
                  }, 120000);

                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'van-baggage-payment-confirmed':
        if (messageToSend.toLowerCase().includes('sim') || messageToSend.toLowerCase().includes('prosseguir')) {
          botResponse = "Agora vou organizar a reserva do hotel que vai te hospedar após sua chegada no SBT.";
          nextStep = 'hotel-step1';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Em nossa sede, temos quartos de hotel onde hospedamos nossos candidatos com conforto e excelência!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("A única coisa que preciso fazer é deixar reservada sua estadia, só um minuto que já estou cuidando disso!", 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Esse é o quarto que você e os candidatos vão ficar:", 'bot');

                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          // Adicionar imagem do quarto de hotel específica para fluxo de van
                          const imageMessage: Message = {
                            id: Date.now() + 1,
                            text: `<img src="${hotelRoomVanImage}" alt="Quarto de hotel SBT - Conforto e excelência" class="w-full max-w-sm mx-auto rounded-lg shadow-md" />`,
                            sender: 'bot',
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, imageMessage]);

                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              setIsTyping(false);
                              addMessage("Lembrando que toda alimentação também será custeada pelo SBT.", 'bot');

                              setTimeout(() => {
                                setIsTyping(true);
                                setTimeout(() => {
                                  setIsTyping(false);
                                  addMessage("Estou finalizando sua reserva!", 'bot');

                                  setTimeout(() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      setIsTyping(false);
                                      addMessage("Pronto, sua reserva foi feita, vou te enviar o comprovante em seu WhatsApp, após conclusão da inscrição!", 'bot');

                                      setTimeout(() => {
                                        setIsTyping(true);
                                        setTimeout(() => {
                                          setIsTyping(false);
                                          addMessage("Vamos finalizar sua inscrição?", 'bot');
                                          setShowQuickOptions(true);
                                          setCurrentStep('hotel-reservation');
                                        }, 5000);
                                      }, 5000);
                                    }, 5000);
                                  }, 5000);
                                }, 5000);
                              }, 5000);
                            }, 5000);
                          }, 3000);
                        }, 5000);
                      }, 2000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'van-baggage-payment-timeout':
      case 'van_baggage_payment_timeout':
        if (messageToSend.toLowerCase().includes('continuar sem bagagem')) {
          setShowPaymentStatus(false);
          setHasBaggage(false);
          ChatStorage.clearPaymentState();
          botResponse = "Agora vou organizar a reserva do hotel que vai te hospedar após sua chegada no SBT.";
          nextStep = 'hotel-step1';
          showOptions = false;
        } else if (messageToSend.toLowerCase().includes('já fiz o pagamento')) {
          setShowPaymentStatus(false);
          setHasBaggage(true);
          botResponse = "Perfeito! Vou verificar a confirmação do seu pagamento da bagagem.";
          
          // Reativar verificação de pagamento
          const paymentId = localStorage.getItem('baggagePaymentId');
          if (paymentId) {
            ChatStorage.setAwaitingPayment(paymentId);
            startPaymentVerification(paymentId, 'baggage');
          }
          return;
        } else {
          // Fallback para opções antigas
          if (messageToSend.toLowerCase().includes('cancelar') || messageToSend.toLowerCase().includes('continuar')) {
            setShowPaymentStatus(false);
            setHasBaggage(false);
            botResponse = "Agora vou organizar a reserva do hotel que vai te hospedar após sua chegada no SBT.";
            nextStep = 'hotel-step1';
            showOptions = false;
          } else if (messageToSend.toLowerCase().includes('já fiz') || messageToSend.toLowerCase().includes('pagamento')) {
            setShowPaymentStatus(false);
            setHasBaggage(true);
            botResponse = "Perfeito! Vou aguardar mais um pouco a confirmação do pagamento da bagagem.";
            
            const paymentId = localStorage.getItem('baggagePaymentId');
            if (paymentId) {
              startPaymentVerification(paymentId, 'baggage');
            }
            return;
          }
        }

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("Em nossa sede, temos quartos de hotel onde hospedamos nossos candidatos com conforto e excelência!", 'bot');

            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage("A única coisa que preciso fazer é deixar reservada sua estadia, só um minuto que já estou cuidando disso!", 'bot');

                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    addMessage("Esse é o quarto que você e os candidatos vão ficar:", 'bot');

                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setIsTyping(false);
                        addMessage("Lembrando que toda alimentação também será custeada pelo SBT.", 'bot');

                        setTimeout(() => {
                          setIsTyping(true);
                          setTimeout(() => {
                            setIsTyping(false);
                            addMessage("Estou finalizando sua reserva!", 'bot');

                            setTimeout(() => {
                              setIsTyping(true);
                              setTimeout(() => {
                                setIsTyping(false);
                                addMessage("Pronto, sua reserva foi feita, vou te enviar o comprovante em seu WhatsApp, após conclusão da inscrição!", 'bot');

                                setTimeout(() => {
                                  setIsTyping(true);
                                  setTimeout(() => {
                                    setIsTyping(false);
                                    addMessage("Vamos finalizar sua inscrição?", 'bot');
                                    setShowQuickOptions(true);
                                    setCurrentStep('hotel-reservation');
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
              }, 5000);
            }, 5000);
          }, 5000);
        }, 5000);
        break;

      case 'boarding-passes':
        if (messageToSend.toLowerCase().includes('continuar')) {
          botResponse = "Agora vou organizar a reserva do hotel que vai te hospedar após sua chegada no SBT.";
          nextStep = 'hotel-step1';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Em nossa sede, temos quartos de hotel onde hospedamos nossos candidatos com conforto e excelência!", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("A única coisa que preciso fazer é deixar reservada sua estadia, só um minuto que já estou cuidando disso!", 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Esse é o quarto que você e os candidatos vão ficar:", 'bot');

                      // Adicionar imagem do quarto de hotel após a mensagem
                      setTimeout(() => {
                        const imageMessage: Message = {
                          id: Date.now(),
                          text: `<img src="${hotelRoomImage}" alt="Quarto de hotel SBT - Conforto e excelência" class="w-full max-w-sm mx-auto rounded-lg shadow-md" />`,
                          sender: 'bot',
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, imageMessage]);

                        setTimeout(() => {
                          setIsTyping(true);
                          setTimeout(() => {
                            setIsTyping(false);
                            addMessage("Lembrando que toda alimentação também será custeada pelo SBT.", 'bot');

                            setTimeout(() => {
                              setIsTyping(true);
                              setTimeout(() => {
                                setIsTyping(false);
                                addMessage("Estou finalizando sua reserva!", 'bot');

                                setTimeout(() => {
                                  setIsTyping(true);
                                  setTimeout(() => {
                                    setIsTyping(false);
                                    addMessage("Pronto, sua reserva foi feita, vou te enviar o comprovante em seu WhatsApp, após conclusão da inscrição!", 'bot');

                                    setTimeout(() => {
                                      setIsTyping(true);
                                      setTimeout(() => {
                                        setIsTyping(false);
                                        addMessage("Vamos finalizar sua inscrição?", 'bot');
                                        setShowQuickOptions(true);
                                        setCurrentStep('hotel-reservation');
                                      }, 5000);
                                    }, 5000);
                                  }, 5000);
                                }, 5000);
                              }, 5000);
                            }, 5000);
                          }, 5000);
                        }, 3000);
                      }, 2000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'hotel-reservation':
        if (messageToSend.toLowerCase().includes('finalizar')) {
          // Calcular valor da inscrição baseado no número de candidatos
          const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
          const totalCandidatos = candidatos.length;

          if (totalCandidatos > 1) {
            botResponse = `O valor de **inscrição** de cada **candidato** é de **R$ 89,90**, como você está inscrevendo **${totalCandidatos} candidatos**, o **SBT** tem um desconto como forma de incentivar mais **candidatos** a participar!`;
          } else {
            botResponse = "O valor de **inscrição** de cada **candidato** é de **R$ 89,90** e você inscreveu apenas **1 candidato**!";
          }

          nextStep = 'inscription-details';
          showOptions = false;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Lembrando que após o pagamento vamos te enviar a sua credencial, para que você apresente na entrada do **SBT** e sua entrada seja liberada.", 'bot');

              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Então assim que realizar o pagamento volte aqui, para fazer o **download da credencial**!", 'bot');
                  setShowQuickOptions(true);
                  setCurrentStep('inscription-info');
                }, 5000);
              }, 5000);
            }, 5000);
          }, 5000);
        }
        break;

      case 'inscription-info':
        if (messageToSend.toLowerCase().includes('entendi')) {
          botResponse = "Lembre-se que o chat se encerra automaticamente em **5 minutos** por inatividade, então assim que realizar o pagamento da **inscrição** volte rapidamente, para evitar o recomeço do processo, tudo bem?";
          nextStep = 'inscription-warning';
          showOptions = false;
          setTimeout(() => {
            setShowQuickOptions(true);
            setCurrentStep('inscription-payment');
          }, 5000);
        }
        break;

      case 'inscription-payment':
        if (messageToSend.toLowerCase().includes('rapidamente')) {
          botResponse = "Aqui está o **QR code** e a chave **PIX** copia e cola, para que você efetue o pagamento da **inscrição**!";
          nextStep = 'inscription-pix';
          showOptions = false;

          // Calcular valor total baseado no número de candidatos
          const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
          const totalCandidatos = candidatos.length;
          const valores = { 1: 89.90, 2: 134.85, 3: 179.80, 4: 224.75, 5: 269.70 };
          const valorTotal = valores[Math.min(totalCandidatos, 5)] || 269.70;

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              // Criar PIX real para inscrição
              createInscriptionPixPayment(valorTotal);

              setShowPaymentStatus(true);
              setPaymentTimer(300); // 5 minutos
              setCurrentStep('waiting-inscription-payment');

              // Simular confirmação após 45 segundos
              setTimeout(() => {
                setShowPaymentStatus(false);
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Seu pagamento foi confirmado, vou te enviar a sua credencial!", 'bot');

                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);

                      // Gerar credenciais (similar aos cartões de embarque)
                      generateCredentials();

                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          addMessage("Sua inscrição foi confirmada! Todos os dados e documentos foram enviados para seu WhatsApp. Tenha uma excelente participação no SBT!", 'bot');

                          setTimeout(() => {
                            // Redirecionar para página de confirmação
                            window.location.href = '/confirmacao-inscricao';
                          }, 3000);

                          setCurrentStep('complete');
                          setShowQuickOptions(false);
                        }, 5000);
                      }, 3000);
                    }, 5000);
                  }, 5000);
                }, 5000);
              }, 45000);

            }, 5000);
          }, 5000);
        }
        break;

      default:
        botResponse = "Desculpe, não entendi. Pode repetir?";
        showOptions = true;
    }

    if (botResponse) {
      setTimeout(() => {
        addMessage(botResponse, 'bot');
        setCurrentStep(nextStep);
        setShowQuickOptions(showOptions);
        ChatStorage.updateStep(nextStep);
        ChatStorage.updateQuickOptions(showOptions);
      }, 1000);
    }
  };

  const formatMessage = (text: string) => {
    // Componente PIX customizado
    if (text.startsWith('PIX_COMPONENT:')) {
      const pixData = JSON.parse(text.replace('PIX_COMPONENT:', ''));
      return (
        <div style={{ 
          background: '#f0f8ff', 
          border: '2px solid #2563eb', 
          borderRadius: '8px', 
          padding: '12px', 
          margin: '8px 0' 
        }}>
          <div style={{ 
            color: '#2563eb', 
            fontWeight: 'bold', 
            marginBottom: '8px' 
          }}>
            💳 Chave PIX {pixData.type === 'inscription' ? 'Inscrição' : ''} - {pixData.amount}
          </div>
          <div style={{ 
            background: 'white', 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            padding: '8px', 
            fontFamily: 'monospace', 
            fontSize: '11px', 
            wordBreak: 'break-all', 
            marginBottom: '8px' 
          }}>
            {pixData.pixCode}
          </div>
          <button 
            onClick={() => copyPixKey(pixData.pixCode)}
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '8px 12px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              width: '100%', 
              fontSize: '12px' 
            }}
          >
            📋 Copiar Chave PIX
          </button>
        </div>
      );
    }

    // Se o texto contém HTML (como imagens, links), renderizar como HTML
    if (text.includes('<img') || text.includes('<a href') || text.includes('<br')) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Caso contrário, processar quebras de linha normalmente
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Função para copiar PIX
  const copyPixKey = async (pixKey: string) => {
    try {
      await navigator.clipboard.writeText(pixKey);
      console.log('Chave PIX copiada para área de transferência');
      // Feedback visual poderia ser adicionado aqui
    } catch (error) {
      console.error('Erro ao copiar chave PIX:', error);
      // Fallback para dispositivos que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = pixKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  // Sistema de verificação de pagamento
  const startPaymentVerification = (paymentId: string, type: 'baggage' | 'inscription') => {
    let isPaymentConfirmed = false;
    let timeoutShown = false;
    
    console.log(`🚀 Iniciando verificação de pagamento: ${paymentId} (${type})`);
    
    const checkPayment = async () => {
      if (isPaymentConfirmed) return;
      
      try {
        const response = await fetch(`/api/pix/status/${paymentId}`);
        const data = await response.json();
        
        if (data.is_paid) {
          isPaymentConfirmed = true;
          
          // Limpar estado de aguardando pagamento
          ChatStorage.clearPaymentState();
          
          const confirmMessage = type === 'baggage' 
            ? '💚 Pagamento confirmado! Vamos continuar?'
            : '💚 Pagamento da **inscrição** confirmado! Vamos prosseguir?';
          
          addMessage(confirmMessage, 'bot');
          setShowQuickOptions(true);
          setCurrentStep(type === 'baggage' ? 'baggage_payment_confirmed' : 'inscription_payment_confirmed');
          console.log(`✅ Pagamento confirmado: ${paymentId}`);
          return;
        }
        
        // Continuar verificando se não confirmado
        if (!isPaymentConfirmed) {
          setTimeout(checkPayment, 3000);
        }
        
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        if (!isPaymentConfirmed) {
          setTimeout(checkPayment, 3000);
        }
      }
    };
    
    // Timer de 20 segundos para mostrar opções
    setTimeout(() => {
      if (!timeoutShown && !isPaymentConfirmed) {
        timeoutShown = true;
        const timeoutMessage = type === 'baggage'
          ? 'Deseja continuar sem **bagagem** ou já fez o pagamento?'
          : 'Deseja continuar ou já fez o pagamento?';
        
        console.log(`⏰ Timeout de 20s atingido - mostrando opções para: ${type}`);
        addMessage(timeoutMessage, 'bot');
        setShowQuickOptions(true);
        setCurrentStep(type === 'baggage' ? 'baggage_payment_timeout' : 'inscription_payment_timeout');
      }
    }, 20000);
    
    // Iniciar verificação após 3 segundos
    setTimeout(checkPayment, 3000);
  };

  // Função global para lidar com clique no link de cartões
  React.useEffect(() => {
    (window as any).handleCartaoPreviewClick = (event: Event) => {
      event.preventDefault();
      // Salvar estado completo antes de navegar
      saveCurrentState();
      
      if (onMinimize) {
        onMinimize();
      } else {
        setInternalMinimized(true);
      } // Minimizar o chat
      // Marcar que deve permanecer minimizado na próxima página
      localStorage.setItem('chatBotMinimized', 'true');
      setTimeout(() => {
        window.location.href = '/cartao-preview'; // Redirecionar na mesma janela
      }, 300);
    };
    
    return () => {
      delete (window as any).handleCartaoPreviewClick;
    };
  }, []);

  if (!isOpen) return null;

  const currentMinimized = onMinimize ? isMinimized : internalMinimized;
  
  console.log('🎯 Estado do chat:', { isOpen, currentMinimized, isMinimized, internalMinimized });
  console.log('🔍 Props recebidas:', { isOpen, isMinimized, onMinimize: !!onMinimize, onExpand: !!onExpand });

  // Balão minimizado
  if (currentMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <div 
          className="relative bg-blue-600 hover:bg-blue-700 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔧 Clique no balão - expandindo chat');
            console.log('🔍 onExpand existe?', !!onExpand);
            if (onExpand) {
              onExpand();
            } else {
              console.log('🔧 Usando setInternalMinimized');
              setInternalMinimized(false);
            }
          }}
        >
          {/* Ícone de chat mais simples */}
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          
          {/* Indicador online */}
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        
        {/* Tooltip que aparece no hover */}
        <div className="absolute bottom-full right-0 mb-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Rebeca - Assistente SBT
          <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg border-b">
          <div className="flex items-center space-x-3">
            {/* Foto de perfil com indicador online */}
            <div className="relative">
              <img 
                src={rebecaAvatar} 
                alt="Rebeca"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
              {/* Indicador online */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-base">Rebeca - Assistente SBT</h3>
              <p className="text-xs text-blue-100">Online agora</p>
            </div>
          </div>
          <button 
            onClick={() => {
              console.log('🔧 Clique em minimizar - salvando estado');
              saveCurrentState();
              if (onMinimize) {
                onMinimize();
              } else {
                setInternalMinimized(true);
              }
            }} 
            className="text-white hover:text-gray-200 text-xl font-bold"
            title="Minimizar"
          >
            −
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
                  className="w-full p-3 text-left bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input disabled - only quick options work */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-center text-sm text-gray-500">
            Use as opções de resposta acima para continuar
          </div>
        </div>
      </div>
    </div>
  );
}