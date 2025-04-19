import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Função para obter eventos do Google Calendar
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para acessar esta API." },
        { status: 401 }
      );
    }
    
    // Obter data de amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    // Formatar datas para a API do Google Calendar
    const timeMin = tomorrowStart.toISOString();
    const timeMax = tomorrowEnd.toISOString();
    
    // Fazer requisição para a API do Google Calendar
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao buscar eventos do Google Calendar:", errorData);
      
      // Se o token expirou, podemos implementar lógica de refresh aqui
      
      return NextResponse.json(
        { error: "Erro ao buscar eventos do Google Calendar" },
        { status: response.status }
      );
    }
    
    const calendarData = await response.json();
    
    // Processar eventos do Google Calendar
    const events = calendarData.items.map((event: any) => {
      // Determinar categoria com base no título ou descrição
      const category = determineCategory(event.summary, event.description);
      
      return {
        id: event.id,
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        category,
        is_all_day: !event.start.dateTime,
      };
    });
    
    // Adicionar eventos de deslocamento entre compromissos
    const eventsWithTravel = addTravelEvents(events);
    
    // Obter dados simulados de clima (em produção, usaríamos uma API real)
    const weather = getSimulatedWeather(tomorrow);
    
    // Verificar se o modo viagem está ativo
    const isTravelMode = checkTravelMode(events);
    
    // Dicas para viagem (apenas se o modo viagem estiver ativo)
    const travelTips = getTravelTips();
    
    // Checklist para viagem (apenas se o modo viagem estiver ativo)
    const travelChecklist = getTravelChecklist();
    
    // Retornar os dados
    return NextResponse.json({
      date: tomorrow.toISOString().split('T')[0],
      events: eventsWithTravel,
      weather,
      is_travel_mode: isTravelMode,
      travel_tips: travelTips,
      travel_checklist: travelChecklist
    });
    
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Função para determinar a categoria do evento
function determineCategory(summary: string, description?: string): string {
  const text = `${summary} ${description || ''}`.toLowerCase();
  
  if (text.includes('tatuagem') || text.includes('tattoo')) {
    return 'tatuagem';
  } else if (text.includes('filho') || text.includes('criança') || text.includes('escola')) {
    return 'filho';
  } else if (text.includes('família') || text.includes('pais') || text.includes('irmão') || text.includes('irmã')) {
    return 'familia';
  } else if (text.includes('namorada') || text.includes('namorado') || text.includes('date') || text.includes('encontro')) {
    return 'namorada';
  } else if (text.includes('jogo') || text.includes('jogar') || text.includes('game')) {
    return 'jogar';
  } else if (text.includes('treino') || text.includes('academia') || text.includes('exercício')) {
    return 'treinar';
  } else if (text.includes('trabalho') || text.includes('reunião') || text.includes('cliente')) {
    return 'trabalho';
  } else if (text.includes('viagem') || text.includes('voo') || text.includes('hotel')) {
    return 'viagem';
  } else {
    return 'outros';
  }
}

// Função para adicionar eventos de deslocamento entre compromissos
function addTravelEvents(events: any[]): any[] {
  const result: any[] = [];
  const realEvents = events.filter(e => !e.is_all_day);
  
  // Ordenar eventos por hora de início
  realEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  for (let i = 0; i < realEvents.length; i++) {
    // Adicionar o evento atual
    result.push(realEvents[i]);
    
    // Se não for o último evento, adicionar deslocamento
    if (i < realEvents.length - 1) {
      const currentEvent = realEvents[i];
      const nextEvent = realEvents[i + 1];
      
      // Calcular tempo entre eventos
      const currentEnd = new Date(currentEvent.end);
      const nextStart = new Date(nextEvent.start);
      const timeBetween = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60); // em minutos
      
      // Se houver pelo menos 10 minutos entre eventos, adicionar deslocamento
      if (timeBetween >= 10) {
        // Simular cálculo de tempo de deslocamento (em produção, usaríamos Google Maps API)
        const travelTime = Math.min(Math.floor(timeBetween * 0.7), timeBetween - 5);
        const buffer = Math.floor(travelTime * 0.2); // 20% de buffer
        
        // Verificar se há conflito (tempo de deslocamento maior que tempo disponível)
        const hasConflict = travelTime > timeBetween;
        
        // Criar evento de deslocamento
        const travelEvent = {
          id: `travel_${i}_${i+1}`,
          summary: `Deslocamento para ${nextEvent.summary}`,
          description: `Tempo estimado: ${travelTime} minutos${buffer > 0 ? ` (inclui ${buffer} min de folga)` : ''}`,
          start: currentEnd.toISOString(),
          end: new Date(currentEnd.getTime() + travelTime * 60 * 1000).toISOString(),
          category: 'travel',
          is_all_day: false
        };
        
        result.push(travelEvent);
        
        // Se houver conflito, marcar o próximo evento
        if (hasConflict) {
          const conflictMinutes = Math.ceil(travelTime - timeBetween);
          nextEvent.has_travel_conflict = true;
          nextEvent.travel_conflict_minutes = conflictMinutes;
        }
      }
    }
  }
  
  return result;
}

// Função para obter dados simulados de clima
function getSimulatedWeather(date: Date): any {
  const dateStr = date.toISOString().split('T')[0];
  
  return {
    date: dateStr,
    city: 'São Paulo',
    avg_temp: 25,
    max_temp: 28,
    min_temp: 22,
    condition: 'Parcialmente nublado com chuva à tarde',
    icon: '10d',
    rain_chance: 70,
    affects_travel: true,
    travel_advice: [
      'Às 14:00, alta chance de chuva. Leve guarda-chuva e saia com antecedência.',
      'Às 18:30, previsão de chuva moderada. Considere um tempo extra para o deslocamento.'
    ],
    hourly: [
      {
        time: '09:00',
        temp: 22,
        description: 'Parcialmente nublado',
        icon: '02d',
        humidity: 70,
        wind_speed: 2.1,
        rain_chance: 10
      },
      {
        time: '12:00',
        temp: 26,
        description: 'Nublado',
        icon: '03d',
        humidity: 65,
        wind_speed: 2.5,
        rain_chance: 30
      },
      {
        time: '15:00',
        temp: 28,
        description: 'Chuva leve',
        icon: '10d',
        humidity: 75,
        wind_speed: 3.1,
        rain_chance: 70
      },
      {
        time: '18:00',
        temp: 25,
        description: 'Chuva moderada',
        icon: '10d',
        humidity: 85,
        wind_speed: 3.8,
        rain_chance: 80
      },
      {
        time: '21:00',
        temp: 23,
        description: 'Parcialmente nublado',
        icon: '02n',
        humidity: 75,
        wind_speed: 2.2,
        rain_chance: 20
      }
    ]
  };
}

// Função para verificar se o modo viagem deve estar ativo
function checkTravelMode(events: any[]): boolean {
  // Verificar se há eventos de viagem ou em locais não habituais
  for (const event of events) {
    if (event.category === 'viagem') {
      return true;
    }
    
    // Verificar se o local do evento está fora das localizações habituais
    if (event.location && !isFamiliarLocation(event.location)) {
      return true;
    }
  }
  
  return false;
}

// Função para verificar se uma localização é familiar
function isFamiliarLocation(location: string): boolean {
  // Lista de localizações familiares
  const familiarLocations = [
    'casa', 'trabalho', 'academia', 'escola', 
    'São Paulo', 'SP', 'casa dos pais'
  ];
  
  const locationLower = location.toLowerCase();
  
  for (const familiar of familiarLocations) {
    if (locationLower.includes(familiar.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

// Função para obter dicas de viagem
function getTravelTips(): string[] {
  return [
    "Prepare uma lista de verificação de viagem com antecedência",
    "Baixe mapas offline da região que vai visitar",
    "Pesquise sobre transporte público ou opções de táxi/Uber no destino",
    "Saia com antecedência extra para compromissos em locais desconhecidos",
    "Salve os endereços importantes no Google Maps antes da viagem",
    "Configure alarmes extras para compromissos importantes",
    "Tenha um plano B para caso se perca ou atrase",
    "Mantenha contatos de emergência facilmente acessíveis",
    "Pratique técnicas de respiração para reduzir ansiedade (4-7-8: inspire por 4s, segure por 7s, expire por 8s)",
    "Lembre-se que é normal sentir-se ansioso em lugares desconhecidos"
  ];
}

// Função para obter checklist de viagem
function getTravelChecklist(): Record<string, string[]> {
  return {
    "Documentos": [
      "RG/CNH",
      "Cartões de crédito/débito",
      "Seguro viagem (se aplicável)",
      "Passagens e reservas impressas (backup)",
      "Cartão do plano de saúde"
    ],
    "Tecnologia": [
      "Celular e carregador",
      "Notebook e carregador (se necessário)",
      "Adaptadores de tomada",
      "Powerbank",
      "Fones de ouvido"
    ],
    "Roupas": [
      "Verificar previsão do tempo no destino",
      "Roupas adequadas para os compromissos",
      "Roupas confortáveis para deslocamentos",
      "Calçados confortáveis"
    ],
    "Saúde": [
      "Medicamentos de uso contínuo",
      "Analgésicos básicos",
      "Antialérgicos (se necessário)",
      "Máscara facial (opcional)"
    ]
  };
}
