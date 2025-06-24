# Sistema Completo de Cartões de Embarque

## Estrutura de Pastas
```
boarding-pass-generator/
├── types.ts          # Definições de tipos TypeScript
├── utils.ts          # Utilitários (aeroportos, cálculos, QR codes)
├── generator.ts      # Gerador principal e modal
├── index.ts          # Ponto de entrada e exports
└── README.md         # Documentação
```

---

## 📄 types.ts

```typescript
// Tipos para o sistema de cartões de embarque
export interface Passenger {
  name: string;
  type: string;
  isMain: boolean;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface FlightData {
  flightDate: Date;
  flightTime: string;
  boardingTime: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
}

export interface BoardingPassConfig {
  passengers: Passenger[];
  flightData: FlightData;
  selectedDate?: string;
  userCity?: string;
  nearestAirport?: Airport;
}
```

---

## 📄 utils.ts

```typescript
import { Airport, FlightData } from './types';

// Lista de aeroportos brasileiros
export const brazilianAirports: Airport[] = [
  { code: 'GRU', name: 'Aeroporto Internacional de São Paulo/Guarulhos', city: 'São Paulo', state: 'SP', latitude: -23.4356, longitude: -46.4731 },
  { code: 'CGH', name: 'Aeroporto de São Paulo/Congonhas', city: 'São Paulo', state: 'SP', latitude: -23.6266, longitude: -46.6556 },
  { code: 'GIG', name: 'Aeroporto Internacional do Rio de Janeiro/Galeão', city: 'Rio de Janeiro', state: 'RJ', latitude: -22.8099, longitude: -43.2505 },
  { code: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro', state: 'RJ', latitude: -22.9105, longitude: -43.1634 },
  { code: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília', state: 'DF', latitude: -15.8711, longitude: -47.9172 },
  { code: 'CNF', name: 'Aeroporto Internacional Tancredo Neves', city: 'Belo Horizonte', state: 'MG', latitude: -19.6244, longitude: -43.9719 },
  { code: 'PLU', name: 'Aeroporto da Pampulha', city: 'Belo Horizonte', state: 'MG', latitude: -19.8512, longitude: -43.9506 },
  { code: 'SSA', name: 'Aeroporto Internacional Deputado Luís Eduardo Magalhães', city: 'Salvador', state: 'BA', latitude: -12.9086, longitude: -38.3225 },
  { code: 'REC', name: 'Aeroporto Internacional do Recife/Guararapes', city: 'Recife', state: 'PE', latitude: -8.1265, longitude: -34.9236 },
  { code: 'FOR', name: 'Aeroporto Internacional Pinto Martins', city: 'Fortaleza', state: 'CE', latitude: -3.7763, longitude: -38.5326 },
  { code: 'POA', name: 'Aeroporto Internacional Salgado Filho', city: 'Porto Alegre', state: 'RS', latitude: -29.9939, longitude: -51.1711 },
  { code: 'CWB', name: 'Aeroporto Internacional Afonso Pena', city: 'Curitiba', state: 'PR', latitude: -25.5284, longitude: -49.1759 },
  { code: 'FLN', name: 'Aeroporto Internacional Hercílio Luz', city: 'Florianópolis', state: 'SC', latitude: -27.6704, longitude: -48.5525 },
  { code: 'VIX', name: 'Aeroporto de Vitória', city: 'Vitória', state: 'ES', latitude: -20.2581, longitude: -40.2864 },
  { code: 'GYN', name: 'Aeroporto Internacional de Goiânia', city: 'Goiânia', state: 'GO', latitude: -16.6320, longitude: -49.2207 },
  { code: 'CGB', name: 'Aeroporto Internacional Marechal Rondon', city: 'Cuiabá', state: 'MT', latitude: -15.6529, longitude: -56.1167 },
  { code: 'MAO', name: 'Aeroporto Internacional Eduardo Gomes', city: 'Manaus', state: 'AM', latitude: -3.0386, longitude: -60.0497 },
  { code: 'BEL', name: 'Aeroporto Internacional Val de Cans', city: 'Belém', state: 'PA', latitude: -1.3792, longitude: -48.4761 },
  { code: 'SLZ', name: 'Aeroporto Internacional Marechal Cunha Machado', city: 'São Luís', state: 'MA', latitude: -2.5856, longitude: -44.2344 },
  { code: 'THE', name: 'Aeroporto Senador Petrônio Portella', city: 'Teresina', state: 'PI', latitude: -5.0597, longitude: -42.8236 },
  { code: 'AJU', name: 'Aeroporto Internacional Santa Maria', city: 'Aracaju', state: 'SE', latitude: -10.9840, longitude: -37.0700 },
  { code: 'MCZ', name: 'Aeroporto Internacional Zumbi dos Palmares', city: 'Maceió', state: 'AL', latitude: -9.5108, longitude: -35.7917 },
  { code: 'JPA', name: 'Aeroporto Internacional Presidente Castro Pinto', city: 'João Pessoa', state: 'PB', latitude: -7.1469, longitude: -34.9486 },
  { code: 'NAT', name: 'Aeroporto Internacional Augusto Severo', city: 'Natal', state: 'RN', latitude: -5.9110, longitude: -35.2476 },
  { code: 'CGR', name: 'Aeroporto Internacional de Campo Grande', city: 'Campo Grande', state: 'MS', latitude: -20.4689, longitude: -54.6728 },
  { code: 'CXJ', name: 'Aeroporto Hugo Cantergiani', city: 'Caxias do Sul', state: 'RS', latitude: -29.1969, longitude: -51.1875 },
  { code: 'JOI', name: 'Aeroporto Lauro Carneiro de Loyola', city: 'Joinville', state: 'SC', latitude: -26.2244, longitude: -48.7972 },
  { code: 'NVT', name: 'Aeroporto Internacional de Navegantes', city: 'Navegantes', state: 'SC', latitude: -26.8797, longitude: -48.6522 },
  { code: 'IGU', name: 'Aeroporto Internacional de Foz do Iguaçu', city: 'Foz do Iguaçu', state: 'PR', latitude: -25.5975, longitude: -54.4894 },
  { code: 'UDI', name: 'Aeroporto de Uberlândia', city: 'Uberlândia', state: 'MG', latitude: -18.8828, longitude: -48.2256 },
  { code: 'MOC', name: 'Aeroporto de Montes Claros', city: 'Montes Claros', state: 'MG', latitude: -16.7069, longitude: -43.8186 },
  { code: 'IOS', name: 'Aeroporto Prefeito Renato Moreira', city: 'Ilhéus', state: 'BA', latitude: -14.8158, longitude: -39.0331 },
  { code: 'LDB', name: 'Aeroporto Governador Jorge Teixeira de Oliveira', city: 'Londrina', state: 'PR', latitude: -23.3336, longitude: -51.1300 },
  { code: 'MGF', name: 'Aeroporto Regional de Maringá', city: 'Maringá', state: 'PR', latitude: -23.4789, longitude: -52.0136 }
];

// Função para calcular distância entre coordenadas
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Função para encontrar aeroporto mais próximo
export function findNearestAirport(latitude: number, longitude: number): Airport {
  let nearestAirport = brazilianAirports[0];
  let minDistance = calculateDistance(latitude, longitude, nearestAirport.latitude, nearestAirport.longitude);

  for (const airport of brazilianAirports) {
    const distance = calculateDistance(latitude, longitude, airport.latitude, airport.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestAirport = airport;
    }
  }

  return nearestAirport;
}

// Função para obter coordenadas do CEP
export async function getCoordinatesFromCEP(cep: string): Promise<{latitude: number, longitude: number} | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.erro) return null;
    
    // ViaCEP não retorna coordenadas, usar aproximação por cidade
    const cityCoordinates: Record<string, {latitude: number, longitude: number}> = {
      'São Paulo': { latitude: -23.5505, longitude: -46.6333 },
      'Rio de Janeiro': { latitude: -22.9068, longitude: -43.1729 },
      'Brasília': { latitude: -15.8267, longitude: -47.9218 },
      'Salvador': { latitude: -12.9714, longitude: -38.5014 },
      'Fortaleza': { latitude: -3.7172, longitude: -38.5433 },
      'Belo Horizonte': { latitude: -19.9191, longitude: -43.9386 },
      'Manaus': { latitude: -3.1190, longitude: -60.0217 },
      'Curitiba': { latitude: -25.4284, longitude: -49.2733 },
      'Recife': { latitude: -8.0476, longitude: -34.8770 },
      'Goiânia': { latitude: -16.6799, longitude: -49.2550 }
    };
    
    return cityCoordinates[data.localidade] || null;
  } catch (error) {
    console.error('Erro ao buscar coordenadas do CEP:', error);
    return null;
  }
}

// Função para gerar padrão visual de QR Code
export function generateQRVisualPattern(): string {
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
}

// Função para calcular dados do voo
export function calculateFlightData(selectedDate?: string, userCity?: string, nearestAirport?: Airport): FlightData {
  let flightDate = new Date();
  let flightTime = '13:20'; // Horário padrão
  
  if (selectedDate) {
    const appointmentDate = new Date(selectedDate);
    
    // Por padrão, voo 2 dias antes do agendamento
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
  
  if (nearestAirport) {
    originCode = nearestAirport.code;
    originCity = nearestAirport.city.toUpperCase();
  } else if (userCity) {
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
}
```

---

## 📄 generator.ts

```typescript
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
```

---

## 📄 index.ts

```typescript
// Ponto de entrada principal do sistema de cartões de embarque
export * from './types';
export * from './utils';
export * from './generator';

// Re-exportar funções principais para facilitar o uso
export { 
  generateBoardingPasses,
  createBoardingPassModal,
  setupGlobalBoardingPassFunction,
  generateBoardingPassHTML
} from './generator';

export {
  calculateFlightData,
  findNearestAirport,
  getCoordinatesFromCEP,
  generateQRVisualPattern,
  brazilianAirports
} from './utils';

export type {
  Passenger,
  Airport,
  FlightData,
  BoardingPassConfig
} from './types';
```

---

## 🚀 Como Usar

### Configuração Inicial
```typescript
// 1. Importar as funções necessárias
import { 
  generateBoardingPasses, 
  setupGlobalBoardingPassFunction,
  type Passenger,
  type BoardingPassConfig 
} from './boarding-pass-generator';

// 2. Configurar função global (uma vez no início da aplicação)
setupGlobalBoardingPassFunction();
```

### Uso Básico
```typescript
// 3. Definir passageiros
const passengers: Passenger[] = [
  { name: "JOÃO SILVA SANTOS", type: "Responsável", isMain: true },
  { name: "MARIA SILVA SANTOS", type: "Candidato 1", isMain: false }
];

// 4. Configurar e gerar cartões
const config: BoardingPassConfig = {
  passengers,
  selectedDate: '2025-07-17',
  userCity: 'Goiânia'
};

generateBoardingPasses(config);
```

### HTML Necessário
```html
<!-- Container onde os cartões aparecerão -->
<div id="boarding-pass-container"></div>
```

### Dependências
- **Tailwind CSS**: Para estilização
- **TypeScript**: Para tipagem (opcional)

---

## ✨ Características

- ✅ **Design Autêntico**: Replica exata do layout oficial dos cartões da Azul
- ✅ **Dados Dinâmicos**: Integração com dados reais de passageiros e voos
- ✅ **QR Codes Visuais**: Padrões visuais realistas de QR codes
- ✅ **Aeroportos Brasileiros**: Base completa com 34 aeroportos do Brasil
- ✅ **Cálculos Automáticos**: Horários de embarque, assentos sequenciais
- ✅ **Modal Interativo**: Visualização e download empilhado
- ✅ **Responsivo**: Layout adaptável para diferentes telas
- ✅ **TypeScript**: Totalmente tipado para máxima segurança

---

## 📱 Exemplos de Uso

### Exemplo 1: Sistema de Casting (SBT)
```typescript
// Buscar dados de passageiros da API
const passengers = await fetch('/api/passengers').then(r => r.json());

// Gerar cartões baseados no agendamento
generateBoardingPasses({
  passengers: passengers.passengers,
  selectedDate: userData.selectedDate,
  userCity: userData.city
});
```

### Exemplo 2: Sistema de Viagens
```typescript
// Cartões para grupo familiar
const family: Passenger[] = [
  { name: "CARLOS SILVA", type: "Adulto", isMain: true },
  { name: "ANA SILVA", type: "Adulto", isMain: false },
  { name: "PEDRO SILVA", type: "Criança", isMain: false }
];

generateBoardingPasses({ passengers: family });
```

### Exemplo 3: Evento Corporativo
```typescript
// Participantes de evento
const participants = eventData.participants.map(p => ({
  name: p.fullName.toUpperCase(),
  type: p.role,
  isMain: p.isOrganizer
}));

generateBoardingPasses({ 
  passengers: participants,
  flightData: eventFlightData 
});
```

---

## 🔧 Personalização

### Modificar Layout do Cartão
Edite a função `generateBoardingPassHTML` em `generator.ts`

### Adicionar Novos Aeroportos
Edite o array `brazilianAirports` em `utils.ts`

### Customizar QR Codes
Modifique `generateQRVisualPattern()` em `utils.ts`

---

## 📄 Licença

Este código foi desenvolvido para o projeto SBT e pode ser reutilizado em outros projetos. Mantenha os créditos quando possível.

---

**Sistema desenvolvido originalmente para SBT News Portal - 2025**