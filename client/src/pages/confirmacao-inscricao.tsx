import React from 'react';
import { CheckCircle, Download, WhatsApp } from 'lucide-react';

export default function ConfirmacaoInscricao() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header com logo SBT */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inscrição Confirmada!
          </h1>
          <p className="text-lg text-gray-600">
            Parabéns! Sua inscrição foi realizada com sucesso.
          </p>
        </div>

        {/* Informações importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            Próximos Passos
          </h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold text-center mr-3 mt-0.5">1</span>
              <p>Todos os documentos foram enviados para seu WhatsApp</p>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold text-center mr-3 mt-0.5">2</span>
              <p>Apresente sua credencial na entrada do SBT no dia do teste</p>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold text-center mr-3 mt-0.5">3</span>
              <p>Chegue com 30 minutos de antecedência</p>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <WhatsApp className="w-5 h-5 mr-2" />
            Abrir WhatsApp
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Download Documentos
          </button>
        </div>

        {/* Informações de contato */}
        <div className="border-t pt-6 text-center">
          <p className="text-gray-600 mb-2">
            Em caso de dúvidas, entre em contato:
          </p>
          <p className="text-blue-600 font-semibold">
            📞 (11) 4004-4040 | 📧 casting@sbt.com.br
          </p>
        </div>

        {/* Botão voltar */}
        <div className="text-center mt-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}