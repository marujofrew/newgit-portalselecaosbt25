import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

import { For4PaymentsAPI, createQuickPixPayment } from './pix/for4payments.js';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Rota para recuperar dados dos usuários cadastrados
  app.get("/api/passengers", (req, res) => {
    try {
      // Dados reais baseados no localStorage do frontend
      // Em produção, estes dados viriam do banco de dados
      const passengers = [];
      
      // Recuperar dados reais do localStorage via query parameters ou header
      // Para teste, vamos simular dados que deveriam vir do frontend
      const responsavelData = {
        nome: "JOÃO SILVA SANTOS",
        email: "joao@email.com",
        telefone: "(11) 99999-9999",
        cep: "01310-100"
      };
      
      const candidatos = [
        {
          nome: "MARIA SILVA SANTOS",
          idade: 12,
          telefone: "(11) 88888-8888"
        }
      ];

      // Adicionar responsável
      if (responsavelData.nome) {
        passengers.push({
          name: responsavelData.nome,
          type: 'Responsável',
          isMain: true
        });
      }
      
      // Adicionar candidatos
      candidatos.forEach((candidato, index) => {
        if (candidato.nome) {
          passengers.push({
            name: candidato.nome,
            type: `Candidato ${index + 1}`,
            isMain: false
          });
        }
      });

      res.json({
        passengers,
        flightInfo: {
          selectedDate: "2025-07-26",
          selectedFlightOption: "1",
          nearestAirport: {
            code: "GRU",
            city: "São Paulo"
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao recuperar dados dos passageiros" });
    }
  });

  // Rotas PIX For4Payments
  app.post('/api/pix/create', async (req, res) => {
    try {
      console.log('=== INÍCIO CRIAÇÃO PIX ===');
      console.log('Body recebido:', JSON.stringify(req.body, null, 2));

      const { name, email, cpf, amount, description, phone } = req.body;

      if (!name || !email || !cpf || !amount) {
        console.log('❌ Dados obrigatórios ausentes');
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios: name, email, cpf, amount'
        });
      }

      console.log('🚀 Iniciando criação de pagamento...');
      const api = For4PaymentsAPI.fromEnv();
      
      console.log('🔑 API inicializada, criando pagamento...');
      const payment = await api.createPixPayment({
        name,
        email,
        cpf,
        amount,
        description,
        phone
      });

      console.log('✅ PIX criado com sucesso!');
      console.log('ID:', payment.id);
      console.log('PIX Code:', payment.pix_code ? 'PRESENTE' : 'AUSENTE');

      const response = {
        success: true,
        payment: {
          id: payment.id,
          pix_code: payment.pix_code,
          pix_qr_code: payment.pix_qr_code,
          expires_at: payment.expires_at,
          status: payment.status,
          formatted_amount: `R$ ${(amount / 100).toFixed(2).replace('.', ',')}`
        }
      };

      console.log('📤 Enviando resposta:', JSON.stringify(response, null, 2));
      res.json(response);

    } catch (error) {
      console.error('❌ ERRO COMPLETO na criação PIX:');
      console.error('Tipo:', error.constructor.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor',
        type: error.constructor.name
      });
    }
  });

  app.get('/api/pix/status/:payment_id', async (req, res) => {
    try {
      const { payment_id } = req.params;
      console.log('🔍 Verificando status PIX:', payment_id);

      const api = For4PaymentsAPI.fromEnv();
      const status = await api.getPaymentSummary(payment_id);

      console.log('📊 Status PIX:', status);

      res.json(status);

    } catch (error) {
      console.error('❌ Erro ao verificar status PIX:', error);
      res.status(500).json({
        error: error.message || 'Erro interno do servidor'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
