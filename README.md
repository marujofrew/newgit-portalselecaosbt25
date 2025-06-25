# SBT Casting Portal

Sistema de cadastro para castings infantis do SBT com integração PIX e geração de cartões de embarque.

## Funcionalidades

- 📝 Sistema de cadastro completo para responsáveis e candidatos
- 📅 Agendamento de testes (apenas sábados)
- 🤖 Chat bot inteligente (Rebeca) para organização de viagens
- ✈️ Opções de transporte (avião e van)
- 💳 Pagamentos PIX via For4Payments
- 🎫 Geração automática de cartões de embarque
- 📱 Interface responsiva e moderna

## Deploy no Heroku

### Pré-requisitos

1. Conta no Heroku
2. Heroku CLI instalado
3. Git configurado
4. Chave API da For4Payments

### Passos para Deploy

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd sbt-casting-portal
   ```

2. **Login no Heroku:**
   ```bash
   heroku login
   ```

3. **Criar aplicação no Heroku:**
   ```bash
   heroku create seu-app-name
   ```

4. **Adicionar PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Configurar variáveis de ambiente:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FOR4PAYMENTS_SECRET_KEY=sua_chave_aqui
   ```

6. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy inicial"
   git push heroku main
   ```

7. **Executar migrações do banco:**
   ```bash
   heroku run npm run db:push
   ```

### Variáveis de Ambiente Necessárias

- `DATABASE_URL` - Configurada automaticamente pelo addon PostgreSQL
- `FOR4PAYMENTS_SECRET_KEY` - Chave da API For4Payments
- `NODE_ENV` - Definir como "production"
- `PORT` - Configurada automaticamente pelo Heroku

## Desenvolvimento Local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar banco PostgreSQL local**

3. **Copiar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

4. **Executar migrações:**
   ```bash
   npm run db:push
   ```

5. **Iniciar desenvolvimento:**
   ```bash
   npm run dev
   ```

## Tecnologias

- **Frontend:** React, TypeScript, Tailwind CSS, Wouter
- **Backend:** Node.js, Express, TypeScript
- **Banco:** PostgreSQL, Drizzle ORM
- **Pagamentos:** For4Payments PIX API
- **Build:** Vite, esbuild
- **Deploy:** Heroku

## Estrutura do Projeto

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schemas compartilhados
├── boarding-pass-generator/  # Sistema de cartões
├── dist/           # Build de produção
└── attached_assets/ # Assets estáticos
```

## Suporte

Para dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.