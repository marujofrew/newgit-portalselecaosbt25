# SBT News Portal - Replit Configuration

## Overview

This is a full-stack news portal application built for SBT (Sistema Brasileiro de Televisão). The application uses a modern tech stack with React frontend, Express.js backend, and PostgreSQL database integration. It appears to be designed as a Brazilian news website with Portuguese language content.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with `/api` prefix
- **Database ORM**: Drizzle ORM
- **Session Management**: Prepared for PostgreSQL session storage

### Database Architecture
- **Primary Database**: PostgreSQL 16 (configured in Replit environment)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless driver

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Schema Location**: `shared/schema.ts`
- **Validation**: Zod schemas for type safety

### Storage Layer
- **Interface**: IStorage with CRUD operations
- **Implementation**: MemStorage (in-memory) for development
- **Methods**: getUser, getUserByUsername, createUser

### UI Components
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling System**: CSS variables with light/dark theme support
- **Icons**: Lucide React icons
- **Layout**: Responsive design with mobile-first approach

### Development Tools
- **Hot Reload**: Vite HMR with error overlay
- **Type Checking**: TypeScript strict mode
- **Code Quality**: Path aliases for clean imports

## Data Flow

1. **Client Requests**: Frontend makes API calls through TanStack Query
2. **API Routes**: Express routes handle requests with `/api` prefix
3. **Storage Layer**: Storage interface abstracts database operations
4. **Database**: Drizzle ORM manages PostgreSQL interactions
5. **Response**: JSON responses sent back to client

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and dev server

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (exposed as port 80 externally)
- **Hot Reload**: Enabled with Vite middleware

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Start Command**: `npm run start`
- **Platform**: Replit Autoscale deployment

### Database Setup
- **Environment**: PostgreSQL 16 module in Replit
- **Migrations**: `npm run db:push` using Drizzle Kit
- **Connection**: Environment variable `DATABASE_URL`

## Recent Changes

- **Sistema de cartões de embarque separado**: Todo código de geração de cartões extraído para pasta `boarding-pass-generator/` reutilizável
- **Rota de passageiros implementada**: API `/api/passengers` criada para recuperar dados reais dos usuários cadastrados
- **Sistema de nomes reais nos cartões**: Cartões de embarque agora mostram nomes reais do cadastro em vez de "RESPONSÁVEL EXEMPLO"
- **Preview page atualizada**: Texto "PASSAGEIRO EXEMPLO" substituído por "-" como confirmação de funcionamento
- **Integração dados reais**: Sistema busca dados via API e localStorage para garantir nomes corretos nos cartões
- **Fluxo de documentos implementado**: Chat bot abre primeiro após agendamento, cartões só aparecem quando usuário clica no documento
- **Datas de agendamento ajustadas**: Apenas sábados, começam 1 mês (30 dias) a partir da data atual do preenchimento
- **Chat bot reiniciado**: Estado limpo a cada confirmação de agendamento para começar conversa do zero
- **Chat bot organizado**: Indicador de "iniciando conversa" por 3 segundos, primeira mensagem simplificada, segunda mensagem após resposta do usuário
- **Interface simplificada**: Botões de resposta maiores e em negrito, campo de entrada de texto removido (apenas respostas selecionáveis)
- **Sistema de bagagens implementado**: Oferta especial kit bagagem SBT-Azul por R$ 29,90 (de R$ 279,90) após escolha de voos
- **Delays de digitação padronizados**: 5 segundos entre todas as mensagens para ritmo consistente
- **Mensagens de bagagem humanizadas**: Sequência natural com valor R$ 29,90 em negrito e texto otimizado sobre bagagens
- **Fluxo completo do chatbot implementado**: Script exato seguido com correções ortográficas, incluindo transporte (avião/van), bagagens, hotel, inscrição e pagamento PIX
- **Página oficial de cartões de embarque redesenhada**: Layout profissional com header SBT, cards informativos azuis, grid responsivo de cartões, modal detalhado, download como imagens PNG, instruções de viagem, fundo branco e chatbot integrado
- **Download de cartões como imagens implementado**: html2canvas captura cada cartão individualmente em PNG alta qualidade
- **Chatbot automático na página de cartões**: Abre após download ou 30 segundos de inatividade para continuar fluxo da conversa
- **Sistema de persistência de conversa aprimorado**: ChatBot salva estado completo (mensagens, etapa, opções, transporte, bagagem) no localStorage e restaura posição exata quando aberto novamente, incluindo logs para debug
- **Página de confirmação redesenhada**: Layout idêntico à página de agendamento com logo SBT centralizada e mensagem de confirmação
- **Sistema de redirecionamento automático**: Após pagamento confirmado, usuário é direcionado para página de confirmação
- **Fluxo de van corrigido**: Sequência completa de mensagens sobre bagagem após confirmação da viagem de van implementada
- **Sistema de bagagem específico para van**: Programa "Bagagem do Bem" adaptado para limitações de espaço em van
- **Timer PIX para bagagem van**: Sistema de pagamento com timeout e confirmação automática específico para fluxo de van
- **Convergência de fluxos**: Ambos os fluxos (avião e van) convergem para hotel após suas respectivas etapas de bagagem
- **Header do chatbot redesenhado**: Foto de perfil da Rebeca com indicador online pulsante e status "Online agora"
- **Botões de resposta azuis**: Opções de resposta com fundo azul e texto branco em negrito para consistência visual
- **Imagem promocional "Bagagem do Bem"**: Imagem oficial adicionada após mensagem sobre bagagem no fluxo de avião
- **Imagem promocional van "Bagagem do Bem"**: Imagem específica da van adicionada no fluxo de van após mensagem sobre bagagem
- **Imagem do quarto de hotel**: Imagem do quarto SBT adicionada nos fluxos de avião e van após mensagem sobre hospedagem
- **Sistema de cartões de embarque aprimorado**: Documento único mostra quantidade de passageiros e lista todos os nomes, geração automática após pagamento, modal completo com navegação lateral, download empilhado, fechamento automático após 30 segundos
- **Assentos sequenciais implementados**: Responsável e candidatos ficam em assentos adjacentes (1D, 2D, 3D, 4D...) na mesma fileira, letra D fixa
- **Dados sincronizados implementados**: Data real do voo baseada na opção escolhida no chat, cidade/aeroporto do CEP preenchido, horários de embarque calculados (25min antes), nomes dos cadastrados
- **Seção de embarque padronizada**: Todos os elementos em linha única horizontal com espaçamento uniforme de 8px, layout flex com justify-space-between
- **Layout compacto implementado**: Todas as informações em linha única, fontes reduzidas (8px labels, 12px valores), largura aumentada (400px), bordas menos arredondadas (8px)
- **Seção de aeroportos reformulada**: Códigos reduzidos (28px), cidades em texto uppercase menores (10px), alinhamento lateral esquerda/direita
- **Header do cartão reorganizado**: Logo menor (24px) com data e voo alinhados na mesma linha horizontal
- **Códigos de aeroportos dinâmicos implementados**: Cartões usam códigos reais dos aeroportos encontrados pelo sistema com layout centralizado
- **Sistema de datas dinâmicas implementado**: Cartões de embarque mostram a data exata da opção de voo escolhida pelo usuário
- **Logo oficial da Azul implementada**: Cartões de embarque agora usam a logo oficial fornecida pelo usuário
- **Sistema de estado persistente implementado**: Chat bot salva automaticamente progresso e restaura posição exata após atualizações
- **MODELO PERFEITO DO CHATBOT**: Estado atual salvo como referência - todas as imagens funcionando (Rebeca com indicador online, bagagem do bem para avião/van, quarto de hotel para ambos fluxos), botões azuis, delays padronizados, fluxo completo de van e avião convergindo para hotel
- **Link para cartões de embarque implementado**: Botão clicável enviado após mensagem de download direcionando para `/cartao-preview`
- **Cartões de embarque redesenhados**: Layout idêntico ao modelo original da Azul com logo oficial, QR codes reais e dados dinâmicos
- **Modal de cartões como arquivos**: Cartões aparecem como arquivos clicáveis com visualização em modal
- **Sistema de múltiplos candidatos implementado**: Formulário agora suporta de 1 a 5 candidatos com seções dinâmicas
- **Seção de termos de autorização criada**: 4 termos obrigatórios com design destacado em vermelho/laranja
- **Notificações de vagas aprimoradas**: Cor azul escuro com 50% opacidade e efeito backdrop-blur
- **Seção de custos removida**: Informações sobre custos foram removidas do fluxo de cadastro
- **Termos com formato compacto**: "Texto... Ver mais" inline para economia de espaço
- **Página de agendamento criada**: Nova página para seleção de data e horário do teste
- **Chat bot implementado**: Assistente virtual Rebeca para organizar passagens e hospedagem após agendamento
- **Sistema de localização**: Captura cidade real do CEP preenchido e usa no chat bot
- **Opções interativas**: Botões clicáveis para respostas rápidas em todas as perguntas
- **Indicador de digitação**: Simulação variável de 2-4 segundos antes de cada resposta
- **Mensagem de voo**: Sistema automatizado que exibe detalhes do voo encontrado após seleção de transporte
- **Fluxo completo**: CEP → Vagas → Responsável → Candidato(s) → Termos → Agendamento → Chat Bot

## Changelog

- June 20, 2025: Sistema de cadastro SBT completo com múltiplos candidatos e termos legais

## User Preferences

- Communication style: Simple, everyday language
- Design preference: Clean, professional layouts without gamification
- Color scheme: Consistent neutral colors (grays, blues) for professional appearance
- UI approach: Intuitive and minimal interface design
- Development workflow: Always restore exact user position after updates, including open modals
- State persistence: Maintain chat bot progress and modal states across application restarts
- **MODELO PERFEITO**: Arquivo backup salvo como `ChatBot-modelo-perfeito.tsx` - usar como referência para reverter mudanças se necessário