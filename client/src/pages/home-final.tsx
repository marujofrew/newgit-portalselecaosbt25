export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <img 
              src="/sbt_logo.png" 
              alt="SBT Logo" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Portal de Casting SBT
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de seleção para talentos infantis
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Portal Interativo de Casting SBT
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Sistema completo para inscrição de talentos infantis do SBT. Realize seu cadastro online, 
            agende sua participação no casting e receba seus cartões de embarque digitais para viagem.
          </p>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Nossa plataforma oferece chat bot inteligente da Rebeca para organizar sua viagem, 
            sistema de pagamento PIX integrado e geração automática de documentos de viagem.
          </p>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Complete seu cadastro, escolha sua data de agendamento e prepare-se para a experiência 
            única de fazer parte da família SBT.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-4 text-blue-900 text-xl">Funcionalidades do Sistema:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Cadastro online completo com múltiplos candidatos</li>
              <li>Chat bot inteligente Rebeca para organização de viagem</li>
              <li>Sistema de agendamento com datas disponíveis</li>
              <li>Pagamento PIX integrado para taxas de inscrição</li>
              <li>Geração automática de cartões de embarque</li>
              <li>Acompanhamento completo do processo seletivo</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold mb-4 text-green-900 text-xl">Como usar o sistema:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Preencha o formulário de cadastro online</li>
              <li>Escolha a data de agendamento disponível</li>
              <li>Converse com a Rebeca para organizar viagem</li>
              <li>Efetue pagamentos via PIX quando necessário</li>
              <li>Baixe seus cartões de embarque digitais</li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/cadastro" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
              Iniciar Cadastro
            </a>
            <a href="/cartao-preview" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center">
              Ver Cartões de Embarque
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-blue-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">© 2025 SBT - Sistema Brasileiro de Televisão</p>
        </div>
      </footer>
    </div>
  );
}