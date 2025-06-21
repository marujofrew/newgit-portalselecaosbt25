import { useState } from 'react';
import { Link } from 'wouter';

export default function Agendamento() {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Gerar próximas 2 semanas de datas disponíveis
  const gerarDatasDisponiveis = () => {
    const datas = [];
    const hoje = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      
      // Pular fins de semana
      if (data.getDay() !== 0 && data.getDay() !== 6) {
        datas.push({
          valor: data.toISOString().split('T')[0],
          texto: data.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return datas;
  };

  const horariosDisponiveis = [
    { valor: '09:00', texto: '09:00 - Manhã' },
    { valor: '10:00', texto: '10:00 - Manhã' },
    { valor: '11:00', texto: '11:00 - Manhã' },
    { valor: '14:00', texto: '14:00 - Tarde' },
    { valor: '15:00', texto: '15:00 - Tarde' },
    { valor: '16:00', texto: '16:00 - Tarde' },
    { valor: '17:00', texto: '17:00 - Tarde' }
  ];

  const confirmarAgendamento = () => {
    if (dataSelecionada && horarioSelecionado) {
      alert('Agendamento confirmado! Você receberá um e-mail com todas as informações.');
      // Aqui você pode redirecionar para uma página de confirmação
      window.location.href = '/confirmacao';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/attached_assets/sbt_logo.png" 
              alt="SBT Logo" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">Agendamento do Teste</h1>
            <p className="text-gray-600 mt-2">
              Selecione a data e horário que melhor se adequa à sua agenda
            </p>
          </div>

          {/* Formulário de Agendamento */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h2 className="font-semibold text-gray-800 text-lg mb-6">Escolha sua Data e Horário</h2>
            
            <div className="space-y-6">
              {/* Seleção de Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Data do Teste *
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {gerarDatasDisponiveis().map((data) => (
                    <label key={data.valor} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                      <input
                        type="radio"
                        name="data"
                        value={data.valor}
                        checked={dataSelecionada === data.valor}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{data.texto}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seleção de Horário */}
              {dataSelecionada && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Horário do Teste *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {horariosDisponiveis.map((horario) => (
                      <label key={horario.valor} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                        <input
                          type="radio"
                          name="horario"
                          value={horario.valor}
                          checked={horarioSelecionado === horario.valor}
                          onChange={(e) => setHorarioSelecionado(e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{horario.texto}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Alguma informação adicional que gostaria de compartilhar..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Informações Importantes */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">Informações Importantes:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Chegue 30 minutos antes do horário agendado</li>
                  <li>• Traga documento de identidade do responsável e certidão de nascimento da criança</li>
                  <li>• O teste terá duração aproximada de 2 horas</li>
                  <li>• Local: Estúdios SBT - Osasco/SP</li>
                </ul>
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
                <Link href="/cadastro" className="flex-1">
                  <button className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 font-medium">
                    Voltar
                  </button>
                </Link>
                
                <button 
                  onClick={confirmarAgendamento}
                  disabled={!dataSelecionada || !horarioSelecionado}
                  className={`flex-1 px-4 py-3 rounded-md font-medium transition duration-200 ${
                    (dataSelecionada && horarioSelecionado)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}