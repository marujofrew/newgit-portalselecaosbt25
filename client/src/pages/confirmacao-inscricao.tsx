import React from 'react';
import { CheckCircle } from 'lucide-react';
const sbtLogo = "/sbt_logo.png";

export default function ConfirmacaoInscricao() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header com logo SBT */}
      <div className="flex justify-center pt-12 pb-8">
        <img 
          src={sbtLogo} 
          alt="SBT Logo" 
          className="h-24 w-auto"
        />
      </div>

      {/* Conteúdo principal centralizado */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* Ícone de confirmação */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Mensagem principal */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sua inscrição foi confirmada!
          </h1>

          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Parabéns! Todos os dados e documentos foram enviados para seu WhatsApp. 
            Tenha uma excelente participação no SBT!
          </p>

          {/* Botão para voltar */}
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Voltar ao início
          </button>
        </div>
      </div>

      {/* Rodapé com informações de contato */}
      <div className="text-center pb-8 px-4">
        <p className="text-gray-600 text-sm">
          Em caso de dúvidas: (11) 4004-4040 | casting@sbt.com.br
        </p>
      </div>
    </div>
  );
}