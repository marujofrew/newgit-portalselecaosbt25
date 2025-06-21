// Base de dados dos principais aeroportos do Brasil
export interface Airport {
  code: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export const brazilianAirports: Airport[] = [
  // Região Sudeste
  { code: "GRU", name: "Aeroporto Internacional de São Paulo/Guarulhos", city: "Guarulhos", state: "SP", latitude: -23.4356, longitude: -46.4731 },
  { code: "CGH", name: "Aeroporto de São Paulo-Congonhas", city: "São Paulo", state: "SP", latitude: -23.6266, longitude: -46.6554 },
  { code: "VCP", name: "Aeroporto Internacional de Viracopos", city: "Campinas", state: "SP", latitude: -23.0074, longitude: -47.1344 },
  { code: "GIG", name: "Aeroporto Internacional do Rio de Janeiro/Galeão", city: "Rio de Janeiro", state: "RJ", latitude: -22.8090, longitude: -43.2436 },
  { code: "SDU", name: "Aeroporto Santos Dumont", city: "Rio de Janeiro", state: "RJ", latitude: -22.9105, longitude: -43.1635 },
  { code: "CNF", name: "Aeroporto Internacional Tancredo Neves", city: "Confins", state: "MG", latitude: -19.6244, longitude: -43.9719 },
  { code: "PLU", name: "Aeroporto da Pampulha", city: "Belo Horizonte", state: "MG", latitude: -19.8512, longitude: -43.9506 },
  { code: "VIX", name: "Aeroporto de Vitória", city: "Vitória", state: "ES", latitude: -20.2581, longitude: -40.2864 },

  // Região Sul
  { code: "CWB", name: "Aeroporto Internacional Afonso Pena", city: "São José dos Pinhais", state: "PR", latitude: -25.5284, longitude: -49.1758 },
  { code: "POA", name: "Aeroporto Internacional Salgado Filho", city: "Porto Alegre", state: "RS", latitude: -29.9939, longitude: -51.1711 },
  { code: "FLN", name: "Aeroporto Internacional Hercílio Luz", city: "Florianópolis", state: "SC", latitude: -27.6703, longitude: -48.5525 },
  { code: "JOI", name: "Aeroporto de Joinville", city: "Joinville", state: "SC", latitude: -26.2245, longitude: -48.7974 },
  { code: "UDI", name: "Aeroporto Regional de Uberlândia", city: "Uberlândia", state: "MG", latitude: -18.8836, longitude: -48.2256 },

  // Região Centro-Oeste
  { code: "BSB", name: "Aeroporto Internacional Juscelino Kubitschek", city: "Brasília", state: "DF", latitude: -15.8697, longitude: -47.9208 },
  { code: "GYN", name: "Aeroporto Santa Genoveva", city: "Goiânia", state: "GO", latitude: -16.6320, longitude: -49.2207 },
  { code: "CGB", name: "Aeroporto Internacional Marechal Rondon", city: "Cuiabá", state: "MT", latitude: -15.6528, longitude: -56.1167 },
  { code: "CGR", name: "Aeroporto Internacional de Campo Grande", city: "Campo Grande", state: "MS", latitude: -20.4689, longitude: -54.6728 },

  // Região Nordeste
  { code: "SSA", name: "Aeroporto Internacional Deputado Luís Eduardo Magalhães", city: "Salvador", state: "BA", latitude: -12.9086, longitude: -38.3225 },
  { code: "REC", name: "Aeroporto Internacional do Recife/Guararapes", city: "Recife", state: "PE", latitude: -8.1263, longitude: -34.9236 },
  { code: "FOR", name: "Aeroporto Internacional Pinto Martins", city: "Fortaleza", state: "CE", latitude: -3.7763, longitude: -38.5327 },
  { code: "NAT", name: "Aeroporto Internacional Augusto Severo", city: "Natal", state: "RN", latitude: -5.9111, longitude: -35.2479 },
  { code: "MCZ", name: "Aeroporto Internacional Zumbi dos Palmares", city: "Maceió", state: "AL", latitude: -9.5108, longitude: -35.7917 },
  { code: "AJU", name: "Aeroporto Internacional Santa Maria", city: "Aracaju", state: "SE", latitude: -10.9840, longitude: -37.0703 },
  { code: "JPA", name: "Aeroporto Internacional Presidente Castro Pinto", city: "João Pessoa", state: "PB", latitude: -7.1486, longitude: -34.9486 },
  { code: "THE", name: "Aeroporto Senador Petrônio Portella", city: "Teresina", state: "PI", latitude: -5.0597, longitude: -42.8236 },
  { code: "SLZ", name: "Aeroporto Internacional Marechal Cunha Machado", city: "São Luís", state: "MA", latitude: -2.5853, longitude: -44.2347 },

  // Região Norte
  { code: "MAO", name: "Aeroporto Internacional Eduardo Gomes", city: "Manaus", state: "AM", latitude: -3.0386, longitude: -60.0497 },
  { code: "BEL", name: "Aeroporto Internacional Val de Cans", city: "Belém", state: "PA", latitude: -1.3794, longitude: -48.4775 },
  { code: "PVH", name: "Aeroporto Internacional Governador Jorge Teixeira", city: "Porto Velho", state: "RO", latitude: -8.7093, longitude: -63.9023 },
  { code: "RBR", name: "Aeroporto Internacional Plácido de Castro", city: "Rio Branco", state: "AC", latitude: -9.8687, longitude: -67.8983 },
  { code: "BVB", name: "Aeroporto Internacional de Boa Vista", city: "Boa Vista", state: "RR", latitude: 2.8463, longitude: -60.6903 },
  { code: "MCP", name: "Aeroporto Internacional de Macapá", city: "Macapá", state: "AP", latitude: 0.0506, longitude: -51.0719 },
  { code: "PNZ", name: "Aeroporto Senador Nilo Coelho", city: "Petrolina", state: "PE", latitude: -9.3624, longitude: -40.5691 }
];

// Função para calcular distância entre duas coordenadas usando fórmula de Haversine
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

// Função para encontrar o aeroporto mais próximo baseado em coordenadas
export function findNearestAirport(latitude: number, longitude: number): Airport {
  let nearestAirport = brazilianAirports[0];
  let shortestDistance = calculateDistance(latitude, longitude, nearestAirport.latitude, nearestAirport.longitude);

  for (const airport of brazilianAirports) {
    const distance = calculateDistance(latitude, longitude, airport.latitude, airport.longitude);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestAirport = airport;
    }
  }

  return nearestAirport;
}

// Função para obter coordenadas de um CEP usando API do ViaCEP + geolocalização aproximada
export async function getCoordinatesFromCEP(cep: string): Promise<{latitude: number, longitude: number} | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }

    // Coordenadas aproximadas baseadas na cidade (dados estimados para cidades principais)
    const cityCoordinates: {[key: string]: {lat: number, lng: number}} = {
      "São Paulo": {lat: -23.5505, lng: -46.6333},
      "Rio de Janeiro": {lat: -22.9068, lng: -43.1729},
      "Belo Horizonte": {lat: -19.9167, lng: -43.9345},
      "Brasília": {lat: -15.8267, lng: -47.9218},
      "Salvador": {lat: -12.9714, lng: -38.5014},
      "Fortaleza": {lat: -3.7319, lng: -38.5267},
      "Recife": {lat: -8.0476, lng: -34.8770},
      "Porto Alegre": {lat: -30.0346, lng: -51.2177},
      "Curitiba": {lat: -25.4284, lng: -49.2733},
      "Goiânia": {lat: -16.6864, lng: -49.2643},
      "Aparecida de Goiânia": {lat: -16.8239, lng: -49.2439},
      "Manaus": {lat: -3.1190, lng: -60.0217},
      "Belém": {lat: -1.4558, lng: -48.5044},
      "Vitória": {lat: -20.2976, lng: -40.2958},
      "Florianópolis": {lat: -27.5954, lng: -48.5480},
      "Campo Grande": {lat: -20.4697, lng: -54.6201},
      "Cuiabá": {lat: -15.6014, lng: -56.0979},
      "João Pessoa": {lat: -7.1195, lng: -34.8450},
      "Teresina": {lat: -5.0892, lng: -42.8019},
      "Natal": {lat: -5.7945, lng: -35.2110},
      "Maceió": {lat: -9.6658, lng: -35.7353},
      "São Luís": {lat: -2.5297, lng: -44.3028},
      "Aracaju": {lat: -10.9472, lng: -37.0731}
    };

    const coords = cityCoordinates[data.localidade];
    if (coords) {
      return {latitude: coords.lat, longitude: coords.lng};
    }

    // Fallback: coordenadas aproximadas baseadas no estado
    const stateCoordinates: {[key: string]: {lat: number, lng: number}} = {
      "SP": {lat: -23.5505, lng: -46.6333},
      "RJ": {lat: -22.9068, lng: -43.1729},
      "MG": {lat: -19.9167, lng: -43.9345},
      "DF": {lat: -15.8267, lng: -47.9218},
      "GO": {lat: -16.6864, lng: -49.2643},
      "BA": {lat: -12.9714, lng: -38.5014},
      "CE": {lat: -3.7319, lng: -38.5267},
      "PE": {lat: -8.0476, lng: -34.8770},
      "RS": {lat: -30.0346, lng: -51.2177},
      "PR": {lat: -25.4284, lng: -49.2733},
      "SC": {lat: -27.5954, lng: -48.5480},
      "AM": {lat: -3.1190, lng: -60.0217},
      "PA": {lat: -1.4558, lng: -48.5044},
      "ES": {lat: -20.2976, lng: -40.2958},
      "MS": {lat: -20.4697, lng: -54.6201},
      "MT": {lat: -15.6014, lng: -56.0979},
      "PB": {lat: -7.1195, lng: -34.8450},
      "PI": {lat: -5.0892, lng: -42.8019},
      "RN": {lat: -5.7945, lng: -35.2110},
      "AL": {lat: -9.6658, lng: -35.7353},
      "MA": {lat: -2.5297, lng: -44.3028},
      "SE": {lat: -10.9472, lng: -37.0731},
      "RO": {lat: -8.7612, lng: -63.8999},
      "AC": {lat: -8.7672, lng: -70.5515},
      "RR": {lat: 2.8235, lng: -60.6758},
      "AP": {lat: 1.4144, lng: -51.7865},
      "TO": {lat: -10.1689, lng: -48.3317}
    };

    const stateCoords = stateCoordinates[data.uf];
    if (stateCoords) {
      return {latitude: stateCoords.lat, longitude: stateCoords.lng};
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter coordenadas do CEP:', error);
    return null;
  }
}