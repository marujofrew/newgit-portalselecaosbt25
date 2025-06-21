import { Link } from 'wouter';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#041e41] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <img 
              src="attached_assets/sbt_logo.png" 
              alt="SBT Logo" 
              className="h-12"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800">
              SBT Abre Seleção para Atores Mirins para Nova Novela
            </h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Emissora oferece contrato de 1 ano com salário de R$ 20 mil e custeia todos os gastos dos candidatos e responsáveis legais
            </p>
            
            <div className="mb-8 w-full">
              <div className="relative w-full" style={{paddingBottom: '56.25%'}}>
                <img 
                  src="/attached_assets/elenco-caverna-encantada_6687_1750391560158.jpeg" 
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" 
                  alt="Elenco da Caverna Encantada"
                />
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 mb-4">
                O SBT está realizando uma seleção especial para encontrar novos talentos mirins que farão parte do elenco de sua próxima novela. Esta é uma oportunidade única para crianças e adolescentes que sonham em trabalhar na televisão.
              </p>
              <p className="text-gray-700 mb-4">
                A emissora oferece um contrato de 1 ano com remuneração de R$ 20.000 mensais, além de custear todas as despesas de viagem, hospedagem e alimentação tanto dos candidatos quanto de seus responsáveis legais durante o período de gravação em São Paulo.
              </p>
              <p className="text-gray-700 mb-6">
                Para participar da seleção, é necessário fazer o cadastro completo e agendar um teste presencial que será realizado nos estúdios da emissora em São Paulo.
              </p>
            </div>

            <div className="text-center">
              <Link to="/cadastro">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-200 shadow-lg">
                  Quero Participar da Seleção
                </button>
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}