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

- **Sistema de múltiplos candidatos implementado**: Formulário agora suporta de 1 a 5 candidatos com seções dinâmicas
- **Seção de termos de autorização criada**: 4 termos obrigatórios com design destacado em vermelho/laranja
- **Notificações de vagas aprimoradas**: Cor azul escuro com 50% opacidade e efeito backdrop-blur
- **Fluxo completo funcional**: CEP → Vagas → Custos → Responsável → Candidato(s) → Termos

## Changelog

- June 20, 2025: Sistema de cadastro SBT completo com múltiplos candidatos e termos legais

## User Preferences

Preferred communication style: Simple, everyday language.