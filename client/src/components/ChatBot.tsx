import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import rebecaAvatar from '@assets/telemarketing_reproduz_1750494256177.jpg';
import bagagemDoBemImage from '@assets/assets_task_01jyfgjxwkets8k907ads1nc55_1750719962_img_1_1750728660025.webp';
import bagagemDoBemVanImage from '@assets/assets_task_01jyfrshw7fw098r2wem6jjtgt_1750728607_img_1_1750729197124.webp';
import hotelRoomImage from '@assets/Leon-Park-157-1024x680_1750729457567.jpg';
import hotelRoomVanImage from '@assets/Leon-Park-157-1024x680_1750730216204.jpg';

// Sistema de cartões de embarque
interface Passenger {
  name: string;
  type: string;
  isMain: boolean;
}

interface FlightData {
  flightDate: Date;
  flightTime: string;
  boardingTime: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
}

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
  const [selectedTransport, setSelectedTransport] = useState<string>('');
  const [selectedFlightOption, setSelectedFlightOption] = useState<string>('');
  const [hasBaggage, setHasBaggage] = useState<boolean>(false);
  const [nearestAirport, setNearestAirport] = useState<any>(null);
  const [showBoardingPassModal, setShowBoardingPassModal] = useState(false);
  const [boardingPassData, setBoardingPassData] = useState<{passengers: Passenger[], flightData: FlightData} | null>(null);

  // Função para gerar padrão visual de QR Code
  const generateQRVisualPattern = (): string => {
    const patterns = [
      '█▀▀▀█ ▀▄█▄▀ █▀▀▀█',
      '█   █ █▀▀▀█ █   █', 
      '█▄▄▄█ █ ▀ █ █▄▄▄█',
      '▄▄▄▄▄ ▄ ▀ ▄ ▄▄▄▄▄',
      '█▀█▄▀▄▄▀█▄▀▄▀█▄▀█',
      '▄ ▀▄ ▄█▀▀▀█▄ ▄▀ ▄',
      '█▄▄▄█ ▄▀█▀▄ █▄▄▄█'
    ];
    return patterns.join('\n');
  };

  // Função para calcular dados do voo
  const calculateFlightData = (selectedDate?: string, userCity?: string): FlightData => {
    let flightDate = new Date();
    let flightTime = '13:20';
    
    if (selectedDate) {
      const appointmentDate = new Date(selectedDate);
      flightDate = new Date(appointmentDate);
      flightDate.setDate(appointmentDate.getDate() - 2);
      flightTime = '13:20';
    }
    
    // Calcular horário de embarque (25 minutos antes do voo)
    const flightTimeparts = flightTime.split(':');
    const flightHour = parseInt(flightTimeparts[0]);
    const flightMinute = parseInt(flightTimeparts[1]);
    
    let boardingHour = flightHour;
    let boardingMinute = flightMinute - 25;
    
    if (boardingMinute < 0) {
      boardingMinute += 60;
      boardingHour -= 1;
    }
    
    const boardingTime = `${boardingHour.toString().padStart(2, '0')}:${boardingMinute.toString().padStart(2, '0')}`;
    
    // Determinar aeroporto de origem
    let originCode = 'GRU';
    let originCity = 'SÃO PAULO';
    
    if (userCity) {
      const cityLower = userCity.toLowerCase();
      if (cityLower.includes('goiânia') || cityLower.includes('goiania')) {
        originCode = 'GYN';
        originCity = 'GOIÂNIA';
      } else if (cityLower.includes('brasília') || cityLower.includes('brasilia')) {
        originCode = 'BSB';
        originCity = 'BRASÍLIA';
      } else if (cityLower.includes('belo horizonte')) {
        originCode = 'CNF';
        originCity = 'BELO HORIZONTE';
      } else if (cityLower.includes('salvador')) {
        originCode = 'SSA';
        originCity = 'SALVADOR';
      } else if (cityLower.includes('recife')) {
        originCode = 'REC';
        originCity = 'RECIFE';
      } else if (cityLower.includes('fortaleza')) {
        originCode = 'FOR';
        originCity = 'FORTALEZA';
      } else if (cityLower.includes('porto alegre')) {
        originCode = 'POA';
        originCity = 'PORTO ALEGRE';
      } else if (cityLower.includes('curitiba')) {
        originCode = 'CWB';
        originCity = 'CURITIBA';
      }
    }
    
    return {
      flightDate,
      flightTime,
      boardingTime,
      originCode,
      originCity,
      destinationCode: 'GRU',
      destinationCity: 'SÃO PAULO'
    };
  };

  // Função para gerar HTML do cartão de embarque
  const generateBoardingPassHTML = (passengers: Passenger[], flightData: FlightData): string => {
    const qrPattern = generateQRVisualPattern();
    
    return passengers.map((passenger, index) => {
      const seatNumber = `${index + 1}D`;
      const passengerId = `SBT${String(Math.floor(Math.random() * 900000) + 100000)}`;
      
      return `
        <div class="boarding-pass bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6 max-w-md mx-auto" style="width: 400px; font-family: Arial, sans-serif;">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <img src="/azul-logo.png" alt="Azul" class="h-6">
            <div class="text-right">
              <div class="text-xs font-semibold">${flightData.flightDate ? new Date(flightData.flightDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('pt-BR')}</div>
              <div class="text-xs text-gray-600">VOO AD4455</div>
            </div>
          </div>

          <!-- Passenger Info -->
          <div class="mb-4">
            <div class="text-xs text-gray-600 mb-1">PASSAGEIRO/PASSENGER</div>
            <div class="font-bold text-sm uppercase">${passenger.name}</div>
          </div>

          <!-- Flight Route -->
          <div class="flex justify-between items-center mb-4">
            <div class="text-center">
              <div class="text-2xl font-bold">${flightData.originCode}</div>
              <div class="text-xs uppercase">${flightData.originCity}</div>
            </div>
            <div class="flex-1 mx-4">
              <div class="border-t border-dashed border-gray-400 relative">
                <div class="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">${flightData.destinationCode}</div>
              <div class="text-xs uppercase">${flightData.destinationCity}</div>
            </div>
          </div>

          <!-- Flight Details -->
          <div class="grid grid-cols-4 gap-2 text-xs mb-4">
            <div>
              <div class="text-gray-600">PORTÃO/GATE</div>
              <div class="font-semibold">12</div>
            </div>
            <div>
              <div class="text-gray-600">ASSENTO/SEAT</div>
              <div class="font-semibold">${seatNumber}</div>
            </div>
            <div>
              <div class="text-gray-600">EMBARQUE/BOARDING</div>
              <div class="font-semibold">${flightData.boardingTime}</div>
            </div>
            <div>
              <div class="text-gray-600">PARTIDA/DEPARTURE</div>
              <div class="font-semibold">${flightData.flightTime}</div>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="flex justify-between items-end">
            <div class="text-xs">
              <div class="text-gray-600">LOCALIZADOR/RECORD LOCATOR</div>
              <div class="font-semibold">${passengerId}</div>
            </div>
            <div class="text-right text-xs leading-3" style="font-family: monospace;">
              <pre class="text-xs">${qrPattern}</pre>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Função para criar modal com cartões de embarque
  const createBoardingPassModal = (passengers: Passenger[], flightData: FlightData): void => {
    const modalHTML = `
      <div id="boarding-pass-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold">Cartões de Embarque - ${passengers.length} ${passengers.length === 1 ? 'Passageiro' : 'Passageiros'}</h3>
            <button id="close-modal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="p-6">
            ${generateBoardingPassHTML(passengers, flightData)}
            
            <div class="text-center mt-6 space-y-3">
              <button id="download-all" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
                Baixar Todos os Cartões
              </button>
              <p class="text-sm text-gray-600">Apresente estes cartões no aeroporto para embarque</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Adicionar modal ao DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar eventos
    const modal = document.getElementById('boarding-pass-modal');
    const closeBtn = document.getElementById('close-modal');
    const downloadBtn = document.getElementById('download-all');
    
    if (closeBtn) {
      closeBtn.onclick = () => modal?.remove();
    }
    
    if (downloadBtn) {
      downloadBtn.onclick = () => downloadBoardingPasses(passengers, flightData);
    }
    
    // Fechar modal clicando fora
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Auto-fechar após 30 segundos
    setTimeout(() => {
      modal?.remove();
    }, 30000);
  };

  // Função para download dos cartões
  const downloadBoardingPasses = (passengers: Passenger[], flightData: FlightData): void => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cartões de Embarque - SBT</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            .boarding-pass { page-break-after: always; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body class="bg-gray-100 p-8">
        <div class="no-print mb-6 text-center">
          <h1 class="text-2xl font-bold mb-2">Cartões de Embarque - SBT</h1>
          <p class="text-gray-600">Apresente estes cartões no aeroporto para embarque</p>
        </div>
        
        ${generateBoardingPassHTML(passengers, flightData)}
        
        <div class="no-print text-center mt-8">
          <button onclick="window.print()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Imprimir Cartões
          </button>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cartoes-embarque-sbt-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Função para gerar cartões de embarque
  const generateBoardingPasses = async (): Promise<void> => {
    try {
      // Buscar dados dos passageiros
      const response = await fetch('/api/passengers');
      const data = await response.json();
      
      if (!data.passengers || data.passengers.length === 0) {
        console.error('Nenhum passageiro encontrado');
        return;
      }

      // Calcular dados do voo
      const flightData = calculateFlightData(selectedDate, userCity);
      
      // Criar elemento de arquivo clicável
      const fileElement = document.createElement('div');
      fileElement.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors mb-3';
      fileElement.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="bg-blue-500 text-white p-2 rounded">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4z"/>
              <path fill-rule="evenodd" d="M18 8.5H2V15a2 2 0 002 2h12a2 2 0 002-2V8.5zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900">Cartões de Embarque - ${data.passengers.length} ${data.passengers.length === 1 ? 'Passageiro' : 'Passageiros'}</h4>
            <p class="text-sm text-gray-600">
              ${data.passengers.map((p: Passenger) => p.name).join(', ')}
            </p>
            <p class="text-xs text-gray-500 mt-1">Clique para visualizar e baixar</p>
          </div>
          <div class="text-blue-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      `;
      
      // Adicionar evento de clique
      fileElement.onclick = () => {
        createBoardingPassModal(data.passengers, flightData);
      };
      
      // Adicionar arquivo como mensagem
      const fileMessage: Message = {
        id: Date.now(),
        text: fileElement.outerHTML,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
      
    } catch (error) {
      console.error('Função de cartões de embarque não encontrada');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
      setMessages([]);
      setCurrentStep('greeting');
      setShowQuickOptions(false);
      setIsTyping(false);
      setShowPaymentStatus(false);
      setPaymentTimer(0);

      // Buscar aeroporto mais próximo baseado no CEP
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      if (responsavelData.cep) {
        findNearestAirportFromCEP(responsavelData.cep);
      }

      // Mensagem inicial
      const welcomeMessage: Message = {
        id: Date.now(),
        text: "Olá! Sou a Rebeca, assistente da SBT. Preciso organizar sua viagem para São Paulo. Vamos começar com o transporte - você prefere viajar de avião ou Van?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setShowQuickOptions(true);
    }
  }, [isOpen, isInitialized]);

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
        return ['Avião', 'Van'];
      
      case 'flight-options':
        return ['Opção 1', 'Opção 2'];
      
      case 'baggage-offer':
        return ['Sim, adicionar kit bagagem', 'Não quero bagagem'];
      
      case 'baggage-payment':
        return ['OK, vou realizar o pagamento e volto rapidamente'];
      
      case 'baggage-payment-confirmed':
        return ['Sim, vamos prosseguir!'];
      
      case 'baggage-payment-timeout':
        return ['Quero cancelar a bagagem, vamos continuar!', 'Já fiz o pagamento, vamos continuar!'];
      
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
        return ['Quero cancelar a bagagem, vamos continuar!', 'Já fiz o pagamento, vamos continuar!'];
      
      case 'hotel-reservation':
        return ['Vamos finalizar'];
      
      case 'inscription-info':
        return ['OK, eu entendi!'];
      
      case 'inscription-payment':
        return ['OK vou realizar o pagamento e volto rapidamente!'];
      
      default:
        return [];
    }
  };


  // Função para abrir modal de cartões de embarque
  const openBoardingPassModal = () => {
    try {
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

      const flightData = calculateFlightData(selectedDate, userCity);
      createBoardingPassModal(passengers, flightData);
    } catch (error) {
      console.error('Erro ao abrir modal de cartões:', error);
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
          botResponse = "Perfeito! Voo é mais rápido. Vou buscar os melhores voos saindo do aeroporto mais próximo de você para São Paulo.";
          nextStep = 'flight-search';
          showOptions = false;
          
          // Sequência de mensagens com delay de 5 segundos
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
              const cidadeInfo = responsavelData.cidade || userCity || 'sua cidade';
              addMessage(`Identifiquei que você está em ${cidadeInfo}. Isso vai me ajudar a encontrar as melhores opções de viagem.`, 'bot');
              
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
          botResponse = "Ok, vou verificar a rota de nossa Van, para encaixar sua localização!";
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
                  
                  addMessage(`Certo, verifiquei que dia ${vanDate || 'XX/XX'} (3 dias antes do dia da data selecionada para agendamento de teste), a nossa van que busca os candidatos em todo o Brasil, vai estar próxima à localização.`, 'bot');
                  
                  setTimeout(() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage(`Então conseguimos agendar para o motorista buscar vocês dia ${vanDate || 'XX/XX'} às 13:40h, posso confirmar?`, 'bot');
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
        botResponse = `Senhor(a) ${responsavelData.nome || ''}, lembrando que as passagens são custeadas pelo SBT, ou seja, não terá gasto algum com passagens.`;
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
                addMessage('Na passagem não está incluso bagagem. Caso precise levar uma bagagem temos um programa em parceria com a AZUL, chamado "Bagagem do Bem" que por apenas R$ 29,90 você tem direito ao kit bagagem e todo o valor arrecadado é doado ao TELETON 2025.', 'bot');
                
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
                      addMessage('Você gostaria de incluir bagagem por R$ 29,90 ou prefere viajar apenas com bagagem de mão?', 'bot');
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
                  addMessage("Faça o download dos seus cartões de embarque para facilitar o seu embarque!", 'bot');
                  
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
              addMessage("Chave PIX copia e cola: bagagem@sbt.com.br", 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Lembre-se: assim que realizar o pagamento, volte aqui para concluirmos o cadastro por completo. Te aguardo!", 'bot');
                  
                  setShowPaymentStatus(true);
                  setPaymentTimer(300); // 5 minutos
                  setCurrentStep('waiting-baggage-payment');
                  
                  // Simular confirmação de pagamento após 30 segundos
                  setTimeout(() => {
                    setShowPaymentStatus(false);
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Seu pagamento foi confirmado, vamos continuar?", 'bot');
                      setShowQuickOptions(true);
                      setCurrentStep('baggage-payment-confirmed');
                    }, 5000);
                  }, 30000);
                  
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
                  addMessage("Faça o download dos seus cartões de embarque para facilitar o seu embarque!", 'bot');
                  
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
        if (messageToSend.toLowerCase().includes('cancelar') || messageToSend.toLowerCase().includes('continuar')) {
          setShowPaymentStatus(false);
          setHasBaggage(false);
        } else if (messageToSend.toLowerCase().includes('já fiz') || messageToSend.toLowerCase().includes('pagamento')) {
          setShowPaymentStatus(false);
          setHasBaggage(true);
        }
        
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
                addMessage("Faça o download dos seus cartões de embarque para facilitar o seu embarque!", 'bot');
                
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
          
          botResponse = `Tudo certo, sua viagem já está agendada, e dia ${vanDate || 'XX/XX'} às 13:40h o motorista do SBT junto com a Van estará em sua porta, para te buscar!`;
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
              addMessage("Chave PIX copia e cola: bagagem@sbt.com.br", 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Lembre-se: assim que realizar o pagamento, volte aqui para concluirmos o cadastro por completo. Te aguardo!", 'bot');
                  
                  setShowPaymentStatus(true);
                  setPaymentTimer(300); // 5 minutos
                  setCurrentStep('waiting-van-baggage-payment');
                  
                  // Simular confirmação de pagamento após 30 segundos
                  setTimeout(() => {
                    setShowPaymentStatus(false);
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      addMessage("Seu pagamento foi confirmado, vamos continuar?", 'bot');
                      setShowQuickOptions(true);
                      setCurrentStep('van-baggage-payment-confirmed');
                    }, 5000);
                  }, 30000);
                  
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
        if (messageToSend.toLowerCase().includes('cancelar') || messageToSend.toLowerCase().includes('continuar')) {
          setShowPaymentStatus(false);
          setHasBaggage(false);
        } else if (messageToSend.toLowerCase().includes('já fiz') || messageToSend.toLowerCase().includes('pagamento')) {
          setShowPaymentStatus(false);
          setHasBaggage(true);
        }
        
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
            botResponse = `O valor de inscrição de cada candidato é de R$ 89,90, como você está inscrevendo ${totalCandidatos} candidatos, o SBT tem um desconto como forma de incentivar mais candidatos a participar!`;
          } else {
            botResponse = "O valor de inscrição de cada candidato é de R$ 89,90 e você inscreveu apenas 1 candidato!";
          }
          
          nextStep = 'inscription-details';
          showOptions = false;
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage("Lembrando que após o pagamento vamos te enviar a sua credencial, para que você apresente na entrada do SBT e sua entrada seja liberada.", 'bot');
              
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  addMessage("Então assim que realizar o pagamento volte aqui, para fazer o download da credencial!", 'bot');
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
          botResponse = "Lembre-se que o chat se encerra automaticamente em 5 minutos por inatividade, então assim que realizar o pagamento da inscrição volte rapidamente, para evitar o recomeço do processo, tudo bem?";
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
          botResponse = "Aqui está o QR code e a chave PIX copia e cola, para que você efetue o pagamento da inscrição!";
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
              addMessage(`QR Code + Chave PIX copia e cola: inscricao@sbt.com.br\nValor: R$ ${valorTotal.toFixed(2).replace('.', ',')}`, 'bot');
              
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
      }, 1000);
    }
  };

  const formatMessage = (text: string) => {
    // Verificar se é um componente de cartão de embarque
    if (text.startsWith('BOARDING_PASS_COMPONENT:')) {
      const data = JSON.parse(text.replace('BOARDING_PASS_COMPONENT:', ''));
      const { passengers } = data;
      
      const handleBoardingPassClick = () => {
        console.log('Clique no cartão de embarque detectado');
        
        try {
          const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
          const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
          
          const fullPassengers = [
            { name: responsavelData.nome || 'RESPONSÁVEL', type: 'Responsável', isMain: true }
          ];
          
          candidatos.forEach((candidato: any, index: number) => {
            fullPassengers.push({
              name: candidato.nome || `CANDIDATO ${index + 1}`,
              type: `Candidato ${index + 1}`,
              isMain: false
            });
          });

          const flightData = calculateFlightData(selectedDate, userCity);
          
          // Usar state do React para controlar modal
          setBoardingPassData({ passengers: fullPassengers, flightData });
          setShowBoardingPassModal(true);
          
        } catch (error) {
          console.error('Erro ao preparar dados do modal:', error);
          // Fallback: modal básico de teste
          setShowBoardingPassModal(true);
          setBoardingPassData(null);
        }
      };
      
      return (
        <div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors mb-3"
          onClick={handleBoardingPassClick}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 text-white p-2 rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 8.5H2V15a2 2 0 002 2h12a2 2 0 002-2V8.5zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Cartões de Embarque - {passengers.length} {passengers.length === 1 ? 'Passageiro' : 'Passageiros'}</h4>
              <p className="text-sm text-gray-600">
                {passengers.map((p: any) => p.name).join(', ')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Clique para visualizar e baixar</p>
            </div>
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      );
    }
    
    // Se o texto contém HTML (como imagens), renderizar como HTML
    if (text.includes('<img') || text.includes('<')) {
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

  if (!isOpen) return null;

  // Modal de cartões de embarque
  const BoardingPassModal = () => {
    if (!showBoardingPassModal) return null;

    const handleCloseModal = () => {
      setShowBoardingPassModal(false);
      setBoardingPassData(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {boardingPassData ? `Cartões de Embarque - ${boardingPassData.passengers.length} ${boardingPassData.passengers.length === 1 ? 'Passageiro' : 'Passageiros'}` : 'Cartões de Embarque'}
            </h3>
            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {boardingPassData ? (
              <>
                {boardingPassData.passengers.map((passenger, index) => {
                  const seatNumber = `${index + 1}D`;
                  const passengerId = `SBT${String(Math.floor(Math.random() * 900000) + 100000)}`;
                  const qrPattern = generateQRVisualPattern();
                  
                  return (
                    <div key={index} className="boarding-pass bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6 max-w-md mx-auto" style={{width: '400px', fontFamily: 'Arial, sans-serif'}}>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <img src="/azul-logo.png" alt="Azul" className="h-6" />
                        <div className="text-right">
                          <div className="text-xs font-semibold">{boardingPassData.flightData.flightDate ? new Date(boardingPassData.flightData.flightDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('pt-BR')}</div>
                          <div className="text-xs text-gray-600">VOO AD4455</div>
                        </div>
                      </div>

                      {/* Passenger Info */}
                      <div className="mb-4">
                        <div className="text-xs text-gray-600 mb-1">PASSAGEIRO/PASSENGER</div>
                        <div className="font-bold text-sm uppercase">{passenger.name}</div>
                      </div>

                      {/* Flight Route */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{boardingPassData.flightData.originCode}</div>
                          <div className="text-xs uppercase">{boardingPassData.flightData.originCity}</div>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="border-t border-dashed border-gray-400 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{boardingPassData.flightData.destinationCode}</div>
                          <div className="text-xs uppercase">{boardingPassData.flightData.destinationCity}</div>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="grid grid-cols-4 gap-2 text-xs mb-4">
                        <div>
                          <div className="text-gray-600">PORTÃO/GATE</div>
                          <div className="font-semibold">12</div>
                        </div>
                        <div>
                          <div className="text-gray-600">ASSENTO/SEAT</div>
                          <div className="font-semibold">{seatNumber}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">EMBARQUE/BOARDING</div>
                          <div className="font-semibold">{boardingPassData.flightData.boardingTime}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">PARTIDA/DEPARTURE</div>
                          <div className="font-semibold">{boardingPassData.flightData.flightTime}</div>
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex justify-between items-end">
                        <div className="text-xs">
                          <div className="text-gray-600">LOCALIZADOR/RECORD LOCATOR</div>
                          <div className="font-semibold">{passengerId}</div>
                        </div>
                        <div className="text-right text-xs leading-3" style={{fontFamily: 'monospace'}}>
                          <pre className="text-xs">{qrPattern}</pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="text-center mt-6 space-y-3">
                  <button 
                    onClick={() => downloadBoardingPasses(boardingPassData.passengers, boardingPassData.flightData)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                  >
                    Baixar Todos os Cartões
                  </button>
                  <p className="text-sm text-gray-600">Apresente estes cartões no aeroporto para embarque</p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">Modal de teste aberto com sucesso!</p>
                <p className="text-sm text-gray-500 mt-2">O sistema de cartões está funcionando.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
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
      
      {/* Modal de cartões de embarque */}
      <BoardingPassModal />
    </div>
  );
}