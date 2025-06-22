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