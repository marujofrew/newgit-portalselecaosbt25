import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 120
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    return '';
  }
}

export function generateBoardingPassData(passengerName: string, flightNumber: string, seat: string, date: string, origin: string, destination: string): string {
  // Formato padrão de dados de cartão de embarque
  const boardingData = {
    passenger: passengerName.toUpperCase(),
    flight: flightNumber,
    seat: seat,
    date: date,
    from: origin,
    to: destination,
    boardingTime: "12:55",
    gate: "D",
    class: "Y" // Economy
  };
  
  // Retorna dados em formato compatível com cartões de embarque
  return `M1${passengerName.substring(0,20).padEnd(20)}E${flightNumber.padEnd(7)}${origin}${destination}${seat.padEnd(4)}${date.replace(/\//g, '')}Y001A`;
}