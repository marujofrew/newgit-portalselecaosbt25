export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header oficial SBT */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <img src="/azul-logo.png" alt="SBT Azul" className="h-12 mr-4" />
            <h1 className="text-3xl font-bold text-blue-900">Portal de Casting SBT</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">Casting Infantil SBT</h2>
          <p className="text-2xl text-gray-700 mb-4">Transforme o sonho do seu filho em realidade</p>
          <p className="text-lg text-gray-600">Sistema Brasileiro de Televisão</p>
        </div>

        {/* Cards de navegação */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Nova Inscrição</h3>
              <p className="text-gray-600 mb-6">Cadastre seu filho para participar dos castings do SBT</p>
              <button 
                onClick={() => window.location.href = '/cadastro'} 
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Fazer Inscrição
              </button>
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
              <button 
                onClick={() => window.location.href = '/cartao-preview'} 
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Ver Cartões
              </button>
            </div>
          </div>
        </div>

        {/* Status do sistema */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Status do Sistema</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <a href="/api/health" className="text-sm text-gray-600 hover:text-blue-600" target="_blank">API Online</a>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <a href="/api/pix/status/test" className="text-sm text-gray-600 hover:text-blue-600" target="_blank">Sistema PIX</a>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <span className="text-sm text-gray-600">Chat Bot Rebeca</span>
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
        </div>
      </footer>
    </div>
  );
}
            <button className="bg-blue-400 text-white px-3 py-1 rounded-full text-sm">
              <i className="fab fa-twitter mr-1"></i>
            </button>
            <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              <i className="fab fa-whatsapp mr-1"></i>
            </button>
            <button className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm">
              <i className="fab fa-linkedin-in mr-1"></i>
            </button>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="mb-4">
              O SBT abriu inscrições para uma seleção especial de atores mirins que participarão da gravação de uma nova novela. A oportunidade oferece um salário inicial de <strong>R$ 20.000,00</strong> com contrato de 1 ano.
            </p>
            
            <p className="mb-4">
              O diferencial desta seleção é que todos os custos serão subsidiados pelo próprio SBT, incluindo:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Hotel e hospedagem</li>
              <li>Transporte</li>
              <li>Alimentação</li>
              <li>Demais custos relacionados</li>
            </ul>
            
            <p className="mb-4">
              O SBT custeará todos os gastos tanto para o candidato quanto para o responsável legal, garantindo que não haja nenhum custo para as famílias interessadas.
            </p>
            

          </div>
          
          <h2 className="text-xl font-bold mt-6 mb-2">
            Como Participar da Seleção:
          </h2>
          <ol className="list-decimal pl-5 mb-4">
            <li>Acesse o site oficial de inscrições abaixo</li>
            <li>Preencha o formulário com dados pessoais do candidato e responsável</li>
            <li>Anexe documentos solicitados e fotos recentes</li>
            <li>Aguarde confirmação e instruções para o teste</li>
          </ol>
          <div className="mt-4 mb-4 flex justify-center">
            <a 
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold inline-block hover:bg-blue-600 transition duration-300" 
              href="/loading" 
              style={{borderRadius: '4px'}}
            >
              Inscrever-se Agora
            </a>
          </div>
        </article>
        
        <div className="bg-white p-4 mb-4">
          <p className="text-gray-500 text-sm mb-4">Publicidade</p>
          <img alt="Banner publicitário" className="w-full" src="https://ecoms1.com/38373/@v3/1720154105555-bannerjequiticorreto.png"/>
        </div>
        
        <section className="bg-white p-4">
          <h2 className="text-xl font-bold mb-4">Últimas notícias</h2>
          <div className="space-y-4">
            <div className="flex">
              <img alt="Crowd at a book fair" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/f3w1F1LgwYQvRaFuPNadYEUyuYndLS2NVmNxOew7YyTTJvaTA/out-0.png"/>
              <div>
                <h3 className="font-semibold">Bienal do Livro de São Paulo atrai milhares de visitantes com promoções e presença de famosos</h3>
                <p className="text-sm text-gray-600">Evento acontece até o dia 15 de setembro e deve receber 600 mil pessoas</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Dry landscape of Pantanal" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/NXVkCa2dyGbIFpMgE6heCalz8iZcaTPFhiBG0Tvjmt1qkXtJA/out-0.png"/>
              <div>
                <h3 className="font-semibold">Pantanal sofre com estiagem severa e risco de desaparecimento de áreas alagadas</h3>
                <p className="text-sm text-gray-600">Seca prolongada afeta biodiversidade e economia local; veja imagens de satélite</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Candidates for São Paulo mayoral election" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/tmWud4fe2IqcbExHYVpOAIHgGiN0kd29erCEaBBhAr0dSeqNB/out-0.png"/>
              <div>
                <h3 className="font-semibold">Confira como foi o dia dos candidatos à Prefeitura de São Paulo neste sábado (07)</h3>
                <p className="text-sm text-gray-600">Políticos participaram de eventos de campanha e manifestações na Avenida Paulista</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Person using an electronic voting machine" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/YZXonQpBQurOOtbEYLlB3RlIHslLmupbZfK37EkrSeiUJvaTA/out-0.png"/>
              <div>
                <h3 className="font-semibold">TRE incentiva eleitores de Belém a praticarem o uso da urna eletrônica</h3>
                <p className="text-sm text-gray-600">Projeto "Voto Treino" prepara população para as eleições municipais e orienta sobre procedimentos no dia da votação</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Overturned bus on a road" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/fCOSbHFBRMVFVyxMYCHS1XlZKjUvoKNvFWQrYZ6NWMWpkXtJA/out-0.png"/>
              <div>
                <h3 className="font-semibold">Ônibus tomba no Rio de Janeiro e deixa 26 feridos</h3>
                <p className="text-sm text-gray-600">Três pessoas ficam gravemente feridas; motorista alega falha mecânica</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Actor in front of a house" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/f2bGbDZlfKqM5EO1GOs7iuq8gFUgaN4X09r6h2nitSegSeqNB/out-0.png"/>
              <div>
                <h3 className="font-semibold">Fábio Assunção é fotografado em sua casa no Jardim Paulista em São Paulo</h3>
                <p className="text-sm text-gray-600">Ator foi clicado por paparazzo enquanto fazia atividades cotidianas em sua residência</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Police officers at a scene" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/xx9gJrFM9uredawEbHiNZBXkIZf0xFB6lFROfKPTbursSeqNB/out-0.png"/>
              <div>
                <h3 className="font-semibold">Briga entre grupos termina com policial civil apontando arma para manifestantes</h3>
                <p className="text-sm text-gray-600">A Corregedoria Geral informou que vai instaurar um procedimento administrativo para apurar a conduta do agente envolvido</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Woman in a prison setting" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/XKypfYzxjIWaEyYoQy8ClnKwOoXF5eap68rmRkw9qF8RJvaTA/out-0.png"/>
              <div>
                <h3 className="font-semibold">Daniela Beyruti permanece isolada em presídio enquanto aguarda análise de habeas corpus</h3>
                <p className="text-sm text-gray-600">Defesa alega que prisão é ilegal e pede que empresária responda em liberdade</p>
              </div>
            </div>
            <div className="flex">
              <img alt="Person using a smartphone for online shopping" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/6iREeilYfyq5tUe8teKYimrhMwf4rZIkFmLCYOYESlikK5VbC/out-0.png"/>
              <div>
                <h3 className="font-semibold">IA no e-commerce: Tecnologia transforma atendimento ao cliente e experiência de compra online</h3>
                <p className="text-sm text-gray-600">Empresas investem em assistentes virtuais e personalização para melhorar vendas</p>
              </div>
            </div>
            <div className="flex">
              <img alt="People celebrating at a traditional event" className="w-24 h-24 object-cover mr-4" src="https://replicate.delivery/yhqm/M3Rav1lGVdbbNBDSYmlPgAOVe0j4fmZJ9HMAoH5nAp4SJvaTA/out-0.png"/>
              <div>
                <h3 className="font-semibold">Acampamento Farroupilha celebra tradição gaúcha após enchentes em Porto Alegre</h3>
                <p className="text-sm text-gray-600">Evento mantém programação apesar dos estragos causados pelas chuvas recentes</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#041e41] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <img alt="SBT News logo" className="h-8 mx-auto" src="/attached_assets/Thays Souza_1750394417652.png" width="auto"/>
          <div className="flex space-x-4">
            <a className="hover:text-gray-200" href="#"><i className="fab fa-facebook-f"></i></a>
            <a className="hover:text-gray-200" href="#"><i className="fab fa-twitter"></i></a>
            <a className="hover:text-gray-200" href="#"><i className="fab fa-youtube"></i></a>
            <a className="hover:text-gray-200" href="#"><i className="fab fa-instagram"></i></a>
            <a className="hover:text-gray-200" href="#"><i className="fas fa-rss"></i></a>
          </div>
        </div>
        <div className="text-center mt-4 text-sm">
          <p>©️ Copyright 2000-2024 Sbt</p>
        </div>
      </footer>
    </div>
  );
}