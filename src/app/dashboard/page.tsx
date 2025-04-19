import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { CalendarIcon, CloudIcon, MapPinIcon, AlertTriangleIcon, CheckSquareIcon, BellIcon, ClipboardCheckIcon } from 'lucide-react';
import type { Event, Weather } from '@/app/api/agenda/route';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    date: string;
    events: Event[];
    weather: Weather;
    is_travel_mode: boolean;
    travel_tips: string[];
    travel_checklist: Record<string, string[]>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Verificar autenticação
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  // Buscar dados da agenda
  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated") return;
      
      try {
        setLoading(true);
        // Em produção, usaríamos a API real que acessa o Google Calendar
        // const response = await fetch('/api/calendar');
        
        // Para desenvolvimento, usamos a API simulada
        const response = await fetch('/api/agenda');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados da agenda');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  // Manipuladores de modais
  const openReminderModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveModal('reminder');
  };

  const openChecklistModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveModal('checklist');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedEventId(null);
  };

  // Manipulador de modo viagem
  const toggleTravelMode = async () => {
    try {
      setLoading(true);
      // Em produção, faríamos uma chamada real para ativar/desativar o modo viagem
      // await fetch('/api/travel-mode', { method: 'POST' });
      
      // Para desenvolvimento, apenas simulamos a mudança
      if (data) {
        setData({
          ...data,
          is_travel_mode: !data.is_travel_mode
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar modo viagem');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="container">
        <div className="card text-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded w-full max-w-md"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="card bg-red-50 border border-red-200">
          <h2 className="text-red-600">Erro ao carregar dados</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const { date, events, weather, is_travel_mode, travel_tips, travel_checklist } = data;
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Encontrar o evento selecionado para os modais
  const selectedEvent = events.find(e => e.id === selectedEventId);
  
  // Determinar o checklist com base na categoria do evento
  const getChecklistForCategory = (category: string) => {
    const checklists: Record<string, string[]> = {
      'tatuagem': [
        "Levar documento de identidade",
        "Comer bem antes da sessão",
        "Levar água",
        "Vestir roupas confortáveis",
        "Verificar formas de pagamento"
      ],
      'filho': [
        "Levar brinquedos/entretenimento",
        "Verificar se há lanches/refeições necessárias",
        "Levar documentos da criança se necessário",
        "Verificar horário de retorno"
      ],
      'familia': [
        "Verificar se precisa levar algo (comida, bebida, presente)",
        "Confirmar endereço e horário",
        "Avisar se vai atrasar"
      ],
      'namorada': [
        "Verificar reservas se necessário",
        "Confirmar local e horário",
        "Verificar se precisa levar algo"
      ],
      'jogar': [
        "Verificar se equipamentos estão funcionando",
        "Carregar controles/dispositivos",
        "Confirmar com amigos se for jogo em grupo"
      ],
      'treinar': [
        "Preparar roupa de treino",
        "Levar garrafa de água",
        "Levar toalha",
        "Verificar horário da academia/treino"
      ],
      'trabalho': [
        "Verificar documentos necessários",
        "Preparar apresentações/materiais",
        "Revisar agenda e pontos a discutir",
        "Verificar endereço e sala de reunião"
      ],
      'viagem': [
        "Verificar documentos (RG, passagens, reservas)",
        "Verificar previsão do tempo no destino",
        "Preparar mala com antecedência",
        "Verificar transporte para o local de partida",
        "Configurar alarmes extras",
        "Verificar rotas e mapas do destino"
      ],
      'outros': [
        "Verificar horário e local",
        "Verificar transporte",
        "Preparar materiais necessários",
        "Definir alarme de saída"
      ]
    };
    
    return checklists[category] || checklists['outros'];
  };

  return (
    <main className="container pb-8">
      <section className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">
            Planejamento para {formattedDate}
          </h2>
          {is_travel_mode && (
            <div className="bg-[var(--category-viagem)] text-white px-3 py-1 rounded-[var(--border-radius)] text-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 2 22M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-4.18-8.73A2 2 0 0 0 16 2H7.82a2 2 0 0 0-1.82 1.18"></path>
                <path d="m2 7 10 5 10-5"></path>
              </svg>
              Modo Viagem Ativo
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Previsão do Tempo</h3>
          <div className="weather-card">
            <div className="mr-4">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                alt={weather.condition}
                width={64}
                height={64}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold mb-1">{weather.avg_temp}°C</p>
              <p className="capitalize mb-1">{weather.condition}</p>
              <p className="text-sm text-[var(--text-light)] mb-1">
                Min: {weather.min_temp}°C / Max: {weather.max_temp}°C
              </p>
              <p className="text-sm text-[var(--text-light)]">
                Chance de chuva: {weather.rain_chance}%
              </p>
            </div>
          </div>
          
          {weather.affects_travel && (
            <>
              <div className="weather-alert">
                <AlertTriangleIcon size={16} />
                <p className="m-0">Condições climáticas podem afetar seus deslocamentos!</p>
              </div>
              {weather.travel_advice && weather.travel_advice.length > 0 && (
                <div className="bg-[var(--background-color)] rounded-[var(--border-radius)] p-4">
                  <h4 className="font-semibold mb-2">Recomendações:</h4>
                  <ul className="list-none pl-4">
                    {weather.travel_advice.map((advice, index) => (
                      <li key={index} className="mb-2 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-[var(--warning-color)]">
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Agenda do Dia</h3>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={`timeline-item ${event.category === 'travel' ? 'timeline-travel' : `timeline-event category-${event.category}`} ${event.has_travel_conflict ? 'has-conflict' : ''}`}
                >
                  <div className="min-w-[80px] text-center mr-4">
                    <span className="font-semibold block">
                      {new Date(event.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!event.is_all_day && (
                      <span className="text-xs text-[var(--text-light)] block">
                        {new Date(event.end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{event.summary}</h4>
                    {event.location && (
                      <p className="text-sm text-[var(--text-light)] mb-1 flex items-center gap-1">
                        <MapPinIcon size={14} />
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm mb-2">{event.description}</p>
                    )}
                    {event.has_travel_conflict && (
                      <div className="conflict-warning">
                        <AlertTriangleIcon size={16} />
                        <p className="m-0">
                          Conflito de tempo! Você chegará aproximadamente {event.travel_conflict_minutes} minutos atrasado.
                        </p>
                      </div>
                    )}
                    {!event.category.includes('travel') && !event.is_all_day && (
                      <div className="flex gap-2 mt-2">
                        <button 
                          className="bg-transparent border border-[var(--border-color)] text-[var(--text-color)] px-2 py-1 rounded-[var(--border-radius)] text-xs flex items-center gap-1 hover:bg-[var(--background-color)]"
                          onClick={() => openReminderModal(event.id)}
                        >
                          <BellIcon size={14} />
                          Configurar Lembretes
                        </button>
                        <button 
                          className="bg-transparent border border-[var(--border-color)] text-[var(--text-color)] px-2 py-1 rounded-[var(--border-radius)] text-xs flex items-center gap-1 hover:bg-[var(--background-color)]"
                          onClick={() => openChecklistModal(event.id)}
                        >
                          <ClipboardCheckIcon size={14} />
                          Ver Checklist
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">Não há eventos agendados para amanhã.</p>
              <button className="btn btn-primary">
                Adicionar Evento
              </button>
            </div>
          )}
        </div>
      </section>

      {is_travel_mode ? (
        <section className="card mt-6">
          <h3 className="text-lg font-semibold mb-4">Dicas para Viagem</h3>
          <div className="bg-[var(--background-color)] rounded-[var(--border-radius)] p-4 mb-4">
            <h4 className="font-semibold mb-2">Para reduzir ansiedade em locais desconhecidos:</h4>
            <ul className="list-none pl-4">
              {travel_tips.map((tip, index) => (
                <li key={index} className="mb-2 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-[var(--category-viagem)]">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[var(--background-color)] rounded-[var(--border-radius)] p-4 mb-4">
            <h4 className="font-semibold mb-2">Checklist de Viagem:</h4>
            {Object.entries(travel_checklist).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h5 className="font-semibold mb-2 text-[var(--category-viagem)]">{category}</h5>
                <ul className="list-none pl-4">
                  {items.map((item, index) => (
                    <li key={index} className="mb-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <button 
              className="btn btn-secondary inline-flex items-center gap-2"
              onClick={toggleTravelMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 2 22M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-4.18-8.73A2 2 0 0 0 16 2H7.82a2 2 0 0 0-1.82 1.18"></path>
                <path d="m2 7 10 5 10-5"></path>
              </svg>
              Desativar Modo Viagem
            </button>
          </div>
        </section>
      ) : (
        <div className="text-center mt-6">
          <button 
            className="btn btn-primary inline-flex items-center gap-2"
            onClick={toggleTravelMode}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 2 22M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-4.18-8.73A2 2 0 0 0 16 2H7.82a2 2 0 0 0-1.82 1.18"></path>
              <path d="m2 7 10 5 10-5"></path>
            </svg>
            Ativar Modo Viagem
          </button>
        </div>
      )}

      {/* Modal de Lembretes */}
      {activeModal === 'reminder' && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Configurar Lembretes</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <p className="mb-4">Configurar lembretes para: <strong>{selectedEvent.summary}</strong></p>
            <div className="mb-4">
              <p className="mb-2">Receber lembretes:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  1 hora antes
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  30 minutos antes
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  15 minutos antes
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  5 minutos antes
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={closeModal}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checklist */}
      {activeModal === 'checklist' && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Checklist para {selectedEvent.summary}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {getChecklistForCategory(selectedEvent.category).map((item, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
