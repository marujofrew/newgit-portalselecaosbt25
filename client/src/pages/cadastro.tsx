import { useState, useEffect } from "react";
import { Link } from "wouter";

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export default function Cadastro() {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [vagasDisponiveis, setVagasDisponiveis] = useState<boolean | null>(null);
  const [cidadeInfo, setCidadeInfo] = useState<CepData | null>(null);
  const [cepError, setCepError] = useState("");

  const buscarCep = async (cepValue: string) => {
    if (cepValue.length !== 8) return;

    setLoading(true);
    setCepError("");
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data: CepData = await response.json();
      
      if (data.erro) {
        setCepError("CEP não encontrado. Verifique e tente novamente.");
        setCidadeInfo(null);
        setVagasDisponiveis(null);
        setLoading(false);
        return;
      }

      setCidadeInfo(data);
      verificarDisponibilidadeVagas(data);
    } catch (error) {
      setCepError("Erro ao consultar CEP. Tente novamente.");
      setCidadeInfo(null);
      setVagasDisponiveis(null);
    }
    
    setLoading(false);
  };

  const verificarDisponibilidadeVagas = (data: CepData) => {
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
  };

  const formatarCep = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    const limitado = numeros.slice(0, 8);
    
    // Aplicar máscara: 00000-000
    if (limitado.length > 5) {
      return `${limitado.slice(0, 5)}-${limitado.slice(5)}`;
    }
    return limitado;
  };

  // Buscar CEP automaticamente quando o usuário terminar de digitar
  useEffect(() => {
    const cepNumeros = cep.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      const timer = setTimeout(() => {
        buscarCep(cepNumeros);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCidadeInfo(null);
      setVagasDisponiveis(null);
      setCepError("");
    }
  }, [cep]);

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
              <div className="relative">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(formatarCep(e.target.value))}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={9}
                />
                {loading && (
                  <div className="absolute right-3 top-2">
                    <i className="fas fa-spinner fa-spin text-blue-500"></i>
                  </div>
                )}
              </div>
              {cepError && (
                <p className="text-red-500 text-sm mt-1">{cepError}</p>
              )}
            </div>

            {cidadeInfo && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Localização encontrada:
                </h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <p><strong>Cidade:</strong> {cidadeInfo.localidade} - {cidadeInfo.uf}</p>
                  <p><strong>Estado:</strong> {cidadeInfo.estado}</p>
                  <p><strong>Região:</strong> {cidadeInfo.regiao}</p>
                  {cidadeInfo.bairro && (
                    <p><strong>Bairro:</strong> {cidadeInfo.bairro}</p>
                  )}
                  {cidadeInfo.logradouro && (
                    <p><strong>Logradouro:</strong> {cidadeInfo.logradouro}</p>
                  )}
                  <p><strong>CEP:</strong> {cidadeInfo.cep}</p>
                  <p><strong>DDD:</strong> {cidadeInfo.ddd}</p>
                </div>
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