export default function Home() {
  return (
    <div className="bg-gray-100">
      <header className="bg-[#041e41] text-white">
        <div className="p-4 flex justify-between items-center">
          <i className="fas fa-bars text-xl"></i>
          <img alt="SBT News logo" className="h-8" src="/attached_assets/Thays Souza_1750394417652.png" width="auto"/>
          <i className="fas fa-search text-xl"></i>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            <a className="text-white px-4 py-2 rounded-full border border-white/30 whitespace-nowrap flex items-center" href="#">
              <i className="fas fa-play mr-2 text-sm"></i>
              Vídeos
            </a>
            <a className="text-white px-4 py-2 rounded-full border border-white/30 whitespace-nowrap" href="#">Brasil</a>
            <a className="text-white px-4 py-2 rounded-full border border-white/30 whitespace-nowrap" href="#">Política</a>
            <a className="text-white px-4 py-2 rounded-full border border-white/30 whitespace-nowrap" href="#">Mundo</a>
            <a className="text-white px-4 py-2 rounded-full border border-white/30 whitespace-nowrap" href="#">Saúde</a>
            <a className="text-white px-4 py-2 rounded-full border border-white/30 whitespace-nowrap" href="#">Economia</a>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        <article className="bg-white p-6 mb-4 rounded-lg shadow-md">
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            SBT Abre Seleção para Atores Mirins para Nova Novela com Salário de R$ 20 Mil
          </h1>
          <p className="text-gray-600 mb-4">
            Emissora oferece contrato de 1 ano e custeia todos os gastos dos candidatos e responsáveis legais
          </p>
          <div className="mb-4 w-full">
            <div style={{position: 'relative', width: '100%', padding: '56.25% 0 0'}}>
              <img 
                src="/attached_assets/elenco-caverna-encantada_6687_1750391560158.jpeg" 
                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} 
                alt="Elenco da Caverna Encantada"
              />
            </div>
          </div>
          <div className="mb-4 text-sm text-gray-500">
            <span className="mr-4">Redação SBT</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              <i className="fab fa-facebook-f mr-1"></i>
              Compartilhar
            </button>
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
            
            <h3 className="text-lg font-bold mb-3">Benefício Especial:</h3>
            <p className="mb-4">
              Após a realização da inscrição, cada candidato receberá <strong>50% dos subsídios antecipados</strong>, no valor de <strong>R$ 1.700,00</strong>, destinados ao transporte de ida e alimentação inicial. O restante será depositado após a conclusão do teste.
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
              href="/cadastro" 
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
