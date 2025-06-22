# Sistema de Geração de Cartões de Embarque

Este é um sistema completo e reutilizável para geração de cartões de embarque no padrão da Azul Airlines, desenvolvido originalmente para o projeto SBT News Portal.

## Características

- ✅ **Design Autêntico**: Replica exata do layout oficial dos cartões da Azul
- ✅ **Dados Dinâmicos**: Integração com dados reais de passageiros e voos
- ✅ **QR Codes Visuais**: Padrões visuais realistas de QR codes
- ✅ **Aeroportos Brasileiros**: Base completa de aeroportos do Brasil
- ✅ **Cálculos Automáticos**: Horários de embarque, assentos sequenciais
- ✅ **Modal Interativo**: Visualização e download empilhado
- ✅ **Responsivo**: Layout adaptável para diferentes telas
- ✅ **TypeScript**: Totalmente tipado para máxima segurança

## Estrutura de Arquivos

```
boarding-pass-generator/
├── types.ts          # Definições de tipos TypeScript
├── utils.ts          # Utilitários (aeroportos, cálculos, QR codes)
├── generator.ts      # Gerador principal e modal
├── index.ts          # Ponto de entrada e exports
└── README.md         # Documentação
```

## Como Usar

### Instalação

1. Copie a pasta `boarding-pass-generator` para seu projeto
2. Importe as funções necessárias:

```typescript
import { 
  generateBoardingPasses, 
  setupGlobalBoardingPassFunction,
  type Passenger,
  type BoardingPassConfig 
} from './boarding-pass-generator';
```

### Configuração Inicial

```typescript
// Configurar função global (uma vez no início da aplicação)
setupGlobalBoardingPassFunction();
```

### Uso Básico

```typescript
// Definir passageiros
const passengers: Passenger[] = [
  { name: "JOÃO SILVA SANTOS", type: "Responsável", isMain: true },
  { name: "MARIA SILVA SANTOS", type: "Candidato 1", isMain: false }
];

// Configurar geração
const config: BoardingPassConfig = {
  passengers,
  flightData: {
    flightDate: new Date('2025-07-15'),
    flightTime: '13:20',
    boardingTime: '12:55',
    originCode: 'GYN',
    originCity: 'GOIÂNIA',
    destinationCode: 'GRU',
    destinationCity: 'SÃO PAULO'
  },
  selectedDate: '2025-07-17',
  userCity: 'Goiânia'
};

// Gerar cartões
generateBoardingPasses(config);
```

### Uso Avançado com Detecção Automática

```typescript
import { 
  generateBoardingPasses,
  findNearestAirport,
  getCoordinatesFromCEP 
} from './boarding-pass-generator';

// Buscar aeroporto mais próximo automaticamente
const coordinates = await getCoordinatesFromCEP('74000-000');
const nearestAirport = coordinates ? 
  findNearestAirport(coordinates.latitude, coordinates.longitude) : null;

const config: BoardingPassConfig = {
  passengers,
  selectedDate: '2025-07-17',
  userCity: 'Goiânia',
  nearestAirport
};

generateBoardingPasses(config);
```

## Funcionalidades

### 1. Geração de Cartões
- Layout idêntico ao da Azul Airlines
- Dados dinâmicos de passageiros
- Cálculo automático de horários
- Assentos sequenciais (1D, 2D, 3D...)

### 2. Sistema de Aeroportos
- Base completa com 34 aeroportos brasileiros
- Detecção automática do aeroporto mais próximo
- Integração com API ViaCEP para coordenadas

### 3. Modal Interativo
- Visualização de todos os cartões
- Download em HTML para impressão
- Auto-fechamento após 30 segundos
- Design responsivo

### 4. Utilitários
- Geração de padrões visuais de QR codes
- Cálculos de distância entre coordenadas
- Formatação de datas e horários
- Validação de dados

## Dependências

- **Tailwind CSS**: Para estilização (CDN ou instalado)
- **TypeScript**: Para tipagem (opcional, pode usar JS)

## Personalização

### Modificar Layout do Cartão

Edite a função `generateBoardingPassHTML` em `generator.ts`:

```typescript
// Alterar cores, fontes, layout, etc.
const cardHTML = `
  <div class="boarding-pass bg-white border border-gray-300...">
    <!-- Seu layout customizado -->
  </div>
`;
```

### Adicionar Novos Aeroportos

Edite o array `brazilianAirports` em `utils.ts`:

```typescript
export const brazilianAirports: Airport[] = [
  // Aeroportos existentes...
  { 
    code: 'NEW', 
    name: 'Novo Aeroporto', 
    city: 'Nova Cidade', 
    state: 'NC', 
    latitude: -15.0000, 
    longitude: -47.0000 
  }
];
```

### Customizar QR Codes

Modifique `generateQRVisualPattern()` em `utils.ts`:

```typescript
export function generateQRVisualPattern(): string {
  // Seu padrão personalizado
  const patterns = [
    '██ ▄▄ ██',
    '▄▄ ██ ▄▄',
    // ...
  ];
  return patterns.join('\n');
}
```

## Integração com Projetos

### React/Next.js
```tsx
import { useEffect } from 'react';
import { setupGlobalBoardingPassFunction } from './boarding-pass-generator';

function App() {
  useEffect(() => {
    setupGlobalBoardingPassFunction();
  }, []);
  
  // Resto do componente...
}
```

### Vanilla JS
```html
<script src="./boarding-pass-generator/index.js"></script>
<script>
  // Configurar sistema
  setupGlobalBoardingPassFunction();
  
  // Usar sistema
  const config = { /* configuração */ };
  generateBoardingPasses(config);
</script>
```

## Container HTML Necessário

Adicione um container no seu HTML onde os cartões aparecerão:

```html
<div id="boarding-pass-container"></div>
```

## Exemplos de Uso

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

## Licença

Este código foi desenvolvido para o projeto SBT e pode ser reutilizado em outros projetos. Mantenha os créditos quando possível.

## Suporte

Para dúvidas ou melhorias, consulte a documentação dos tipos TypeScript incluída no código.