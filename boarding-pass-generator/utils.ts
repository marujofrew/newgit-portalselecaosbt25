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
  
  // Verificar qual opção de voo foi selecionada no chat
  const selectedFlightOption = localStorage.getItem('selectedFlightOption') || '1';
  
  if (selectedDate) {
    const appointmentDate = new Date(selectedDate);
    
    if (selectedFlightOption === '1') {
      // Opção 1: 2 dias antes do agendamento, 13:20
      flightDate = new Date(appointmentDate);
      flightDate.setDate(appointmentDate.getDate() - 2);
      flightTime = '13:20';
    } else if (selectedFlightOption === '2') {
      // Opção 2: 1 dia antes do agendamento, 08:30
      flightDate = new Date(appointmentDate);
      flightDate.setDate(appointmentDate.getDate() - 1);
      flightTime = '08:30';
    }
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