import React from 'react';
import { Link } from 'wouter';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <img src="/azul-logo.png" alt="SBT Azul" className="h-12 mr-4" />
            <h1 className="text-3xl font-bold text-blue-900">Portal de Casting SBT</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">Casting Infantil SBT</h2>
          <p className="text-2xl text-gray-700 mb-4">Transforme o sonho do seu filho em realidade</p>
          <p className="text-lg text-gray-600">Sistema Brasileiro de Televisão</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Nova Inscrição</h3>
              <p className="text-gray-600 mb-6">Cadastre seu filho para participar dos castings</p>
              <Link href="/cadastro" className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Fazer Inscrição
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">Cartões de Embarque</h3>
              <p className="text-gray-600 mb-6">Visualize seus documentos de viagem</p>
              <Link href="/cartao-preview" className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Ver Cartões
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Pagamento PIX</h3>
              <p className="text-gray-600 mb-6">Sistema de pagamento instantâneo</p>
              <a href="/api/pix/status/test" className="inline-block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium" target="_blank">
                Testar PIX
              </a>
            </div>
          </div>
        </div>

        {/* Informações sobre o Casting */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Portal Interativo de Casting SBT</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Sistema completo para inscrição de talentos infantis do SBT. Realize seu cadastro online, 
                agende sua participação no casting e receba seus cartões de embarque digitais para viagem.
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Nossa plataforma oferece chat bot inteligente da Rebeca para organizar sua viagem, 
                sistema de pagamento PIX integrado e geração automática de documentos de viagem.
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Complete seu cadastro, escolha sua data de agendamento e prepare-se para a experiência 
                única de fazer parte da família SBT.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cadastro" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                  Iniciar Cadastro
                </Link>
                <Link href="/agendamento" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center">
                  Fazer Agendamento
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="/elenco-caverna-encantada_6687_1750391560158.jpeg" 
                alt="Elenco Caverna Encantada" 
                className="w-full max-w-md rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Status do Sistema</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 animate-pulse"></div>
              <a href="/api/health" className="text-sm font-medium text-gray-700 hover:text-blue-600" target="_blank">API Backend</a>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 animate-pulse"></div>
              <a href="/api/pix/create" className="text-sm font-medium text-gray-700 hover:text-blue-600" target="_blank">Gateway PIX</a>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Chat Bot Rebeca</span>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Sistema de Cartões</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <img src="/azul-logo.png" alt="SBT" className="h-8 mx-auto mb-4 opacity-80" />
          <p className="text-xl mb-2">Sistema Brasileiro de Televisão</p>
          <p className="text-blue-200">Portal oficial para casting de talentos infantis</p>
          <p className="text-blue-300 text-sm mt-4">Sistema desenvolvido para seleção oficial SBT</p>
        </div>
      </footer>
    </div>
  );
}