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

  const httpServer = createServer(app);

  return httpServer;
}
