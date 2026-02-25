// Interfaces para la API de fútbol
interface FootballMatch {
  fixture: {
    id: number
    date: string
    status: {
      long: string
      short: string
    }
  }
  teams: {
    home: {
      id: number
      name: string
      code: string
    }
    away: {
      id: number
      name: string
      code: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
  }
}

// Función para obtener resultados de partidos (opción futura)
export async function fetchMatchResults(matchId?: number): Promise<FootballMatch[]> {
  // NOTA: Esta es una función placeholder para futura implementación
  // Requerirá una API key de servicio como football-api.org o similar
  
  const API_KEY = process.env.FOOTBALL_API_KEY
  const BASE_URL = 'https://v3.football.api.org'
  
  if (!API_KEY) {
    console.warn('FOOTBALL_API_KEY no configurada')
    return []
  }

  try {
    const url = matchId 
      ? `${BASE_URL}/fixtures?id=${matchId}`
      : `${BASE_URL}/fixtures?live=all`
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'v3.football.api.org'
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || []
  } catch (error) {
    console.error('Error fetching match results:', error)
    return []
  }
}

// Función para mapear resultados de API a nuestra base de datos
export function mapApiMatchToDb(apiMatch: FootballMatch) {
  return {
    external_id: apiMatch.fixture.id,
    status: apiMatch.fixture.status.short === 'FT' ? 'finished' : 
            apiMatch.fixture.status.short === 'LIVE' ? 'live' : 'upcoming',
    score_home: apiMatch.goals.home,
    score_away: apiMatch.goals.away,
    match_date: apiMatch.fixture.date,
    // Necesitarías mapear los equipos de la API a tus IDs de equipos
    team_home_name: apiMatch.teams.home.name,
    team_away_name: apiMatch.teams.away.name,
  }
}

// Función para actualizar resultados automáticamente (futuro)
export async function updateResultsFromAPI() {
  'use server'
  
  try {
    const matches = await fetchMatchResults()
    
    for (const apiMatch of matches) {
      if (apiMatch.fixture.status.short === 'FT') {
        const mappedData = mapApiMatchToDb(apiMatch)
        
        // Aquí actualizarías tu base de datos
        // Necesitarías buscar el partido por ID externo o nombre de equipos
        console.log('Actualizando partido:', mappedData)
      }
    }
    
    return { success: true, updated: matches.length }
  } catch (error) {
    console.error('Error updating results from API:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
