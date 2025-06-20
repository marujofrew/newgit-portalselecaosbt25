import { useState } from "react";
import { Link } from "wouter";

export default function Cadastro() {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [vagasDisponiveis, setVagasDisponiveis] = useState<boolean | null>(null);
  const [cidadeInfo, setCidadeInfo] = useState<any>(null);

  const verificarDisponibilidade = async () => {
    if (cep.length !== 8) {
      alert("Por favor, digite um CEP válido com 8 dígitos");
      return;
    }

    setLoading(true);
    
    try {
      // Consulta API dos Correios para validar CEP
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        alert("CEP não encontrado. Verifique e tente novamente.");
        setLoading(false);
        return;
      }

      setCidadeInfo(data);
      
      // Simular verificação de disponibilidade de vagas
      // Cidades com vagas disponíveis (capitais e principais cidades)
      const cidadesComVagas = [
        'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 
        'Salvador', 'Fortaleza', 'Recife', 'Porto Alegre', 'Curitiba',
        'Goiânia', 'Belém', 'Manaus', 'São Luís', 'Maceió', 'Natal',
        'João Pessoa', 'Aracaju', 'Teresina', 'Cuiabá', 'Campo Grande',
        'Florianópolis', 'Vitória', 'Palmas', 'Macapá', 'Boa Vista',
        'Rio Branco', 'Porto Velho'
      ];
      
      const temVagas = cidadesComVagas.some(cidade => 
        data.localidade.toLowerCase().includes(cidade.toLowerCase())
      );
      
      setVagasDisponiveis(temVagas);
    } catch (error) {
      alert("Erro ao verificar CEP. Tente novamente.");
    }
    
    setLoading(false);
  };

  const formatarCep = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    return numeros.slice(0, 8);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-[#041e41] text-white">
        <div className="p-4 flex justify-between items-center">
          <Link href="/">
            <i className="fas fa-arrow-left text-xl"></i>
          </Link>
          <img alt="SBT News logo" className="h-8" src="/attached_assets/Thays Souza_1750394417652.png" width="auto"/>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Cadastro para Seleção de Atores Mirins
          </h1>
          
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                1
              </div>
              <span className="text-sm font-medium">Verificação de Disponibilidade</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite seu CEP para verificar se há vagas disponíveis em sua região:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(formatarCep(e.target.value))}
                  placeholder="00000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={8}
                />
                <button
                  onClick={verificarDisponibilidade}
                  disabled={loading || cep.length !== 8}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? "Verificando..." : "Verificar"}
                </button>
              </div>
            </div>

            {cidadeInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Localização encontrada:</h3>
                <p className="text-sm text-gray-600">
                  {cidadeInfo.localidade} - {cidadeInfo.uf}
                </p>
                <p className="text-sm text-gray-600">
                  {cidadeInfo.bairro && `${cidadeInfo.bairro}, `}
                  CEP: {cidadeInfo.cep}
                </p>
              </div>
            )}

            {vagasDisponiveis === true && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  <h3 className="font-medium text-green-800">Ótimas notícias!</h3>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Há vagas disponíveis para sua região. Você pode prosseguir com o cadastro.
                </p>
                <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
                  Continuar Cadastro
                </button>
              </div>
            )}

            {vagasDisponiveis === false && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-times-circle text-red-500 mr-2"></i>
                  <h3 className="font-medium text-red-800">Infelizmente...</h3>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Não há vagas disponíveis para sua região no momento. Mantenha-se atualizado através do nosso portal para futuras oportunidades.
                </p>
                <Link href="/">
                  <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                    Voltar ao Portal
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              * A verificação de disponibilidade é baseada na localização e demanda regional
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}