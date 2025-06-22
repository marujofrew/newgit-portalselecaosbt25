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