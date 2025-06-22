import { Passenger, BoardingPassConfig } from './types';
import { calculateFlightData, generateQRVisualPattern } from './utils';

// Função principal para gerar cartões de embarque
export function generateBoardingPasses(config: BoardingPassConfig): void {
  try {
    if (!config.passengers || config.passengers.length === 0) {
      throw new Error('Nenhum passageiro fornecido');
    }

    console.log('Generating boarding passes for:', config.passengers);
    createUnifiedBoardingPassFile(config);
  } catch (error) {
    console.error('Erro ao gerar cartões de embarque:', error);
    throw error;
  }
}

// Função para criar arquivo único com todos os cartões
function createUnifiedBoardingPassFile(config: BoardingPassConfig): void {
  const { passengers, selectedDate, userCity, nearestAirport } = config;
  const passengersJson = JSON.stringify(passengers);
  
  console.log('Creating boarding pass file for passengers:', passengers);
  console.log('JSON to pass:', passengersJson);
  
  // Calcular dados do voo
  const flightData = calculateFlightData(selectedDate, userCity, nearestAirport);
  
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
        <h4 class="font-semibold text-gray-900">Cartões de Embarque - ${passengers.length} ${passengers.length === 1 ? 'Passageiro' : 'Passageiros'}</h4>
        <p class="text-sm text-gray-600">
          ${passengers.map(p => p.name).join(', ')}
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
    if (typeof window !== 'undefined' && (window as any).openUnifiedBoardingPass) {
      (window as any).openUnifiedBoardingPass(passengersJson, JSON.stringify(flightData));
    }
  };
  
  // Adicionar ao DOM (assumindo que existe um container com id 'boarding-pass-container')
  const container = document.getElementById('boarding-pass-container');
  if (container) {
    container.appendChild(fileElement);
  }
}

// Função para gerar HTML do cartão de embarque
export function generateBoardingPassHTML(passengers: Passenger[], flightData: any): string {
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
            <div class="text-2xl font-bold">${flightData.originCode || 'GRU'}</div>
            <div class="text-xs uppercase">${flightData.originCity || 'SÃO PAULO'}</div>
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
            <div class="text-2xl font-bold">${flightData.destinationCode || 'GRU'}</div>
            <div class="text-xs uppercase">${flightData.destinationCity || 'SÃO PAULO'}</div>
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
            <div class="font-semibold">${flightData.boardingTime || '12:55'}</div>
          </div>
          <div>
            <div class="text-gray-600">PARTIDA/DEPARTURE</div>
            <div class="font-semibold">${flightData.flightTime || '13:20'}</div>
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
}

// Função para criar modal com navegação
export function createBoardingPassModal(passengers: Passenger[], flightData: any): void {
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
}

// Função para download dos cartões
function downloadBoardingPasses(passengers: Passenger[], flightData: any): void {
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
}

// Função global para abrir modal (deve ser registrada no window)
export function setupGlobalBoardingPassFunction(): void {
  if (typeof window !== 'undefined') {
    (window as any).openUnifiedBoardingPass = (passengersJson: string, flightDataJson: string) => {
      try {
        const passengers = JSON.parse(passengersJson);
        const flightData = JSON.parse(flightDataJson);
        createBoardingPassModal(passengers, flightData);
      } catch (error) {
        console.error('Erro ao abrir modal de cartões:', error);
      }
    };
    console.log('Global function openUnifiedBoardingPass defined:', typeof (window as any).openUnifiedBoardingPass);
  }
}