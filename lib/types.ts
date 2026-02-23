export interface Profile {
  id: string
  display_name: string
  city: string
  avatar_url: string | null
  points_total: number
  created_at: string
}

export interface Team {
  id: number
  name: string
  code: string
  group_letter: string
  flag_emoji: string
}

export interface Match {
  id: number
  team_home_id: number
  team_away_id: number
  group_letter: string
  match_date: string
  venue: string
  stage: 'group' | 'round_of_32' | 'round_of_16' | 'quarter' | 'semi' | 'third_place' | 'final'
  status: 'upcoming' | 'live' | 'finished'
  score_home: number | null
  score_away: number | null
  team_home?: Team
  team_away?: Team
}

export interface Prediction {
  id: number
  user_id: string
  match_id: number
  predicted_home: number
  predicted_away: number
  wildcard: 'double' | 'insurance' | null
  points_earned: number
  created_at: string
  match?: Match
}

export interface League {
  id: number
  name: string
  code: string
  owner_id: string
  created_at: string
  member_count?: number
}

export interface LeagueMember {
  id: number
  league_id: number
  user_id: string
  joined_at: string
  profile?: Profile
}

export interface Wildcard {
  id: number
  user_id: string
  stage: string
  wildcard_type: 'double' | 'insurance'
  used: boolean
  used_on_prediction_id: number | null
}

export interface Achievement {
  id: number
  user_id: string
  achievement_key: string
  unlocked_at: string
}

export interface RankedProfile extends Profile {
  rank: number
}

export const ACHIEVEMENT_DEFINITIONS: Record<string, { name: string; description: string; icon: string }> = {
  first_prediction: {
    name: 'Primera Jugada',
    description: 'Hiciste tu primer pronostico',
    icon: 'star',
  },
  sharpshooter_3: {
    name: 'Francotirador',
    description: '3 resultados exactos seguidos',
    icon: 'target',
  },
  hot_streak_5: {
    name: 'En Racha',
    description: '5 aciertos seguidos',
    icon: 'flame',
  },
  league_creator: {
    name: 'Lider Nato',
    description: 'Creaste tu primera liga',
    icon: 'crown',
  },
  perfect_day: {
    name: 'Dia Perfecto',
    description: 'Todos los pronosticos correctos en un dia',
    icon: 'trophy',
  },
  top_10_city: {
    name: 'Top 10 Ciudad',
    description: 'Llegaste al top 10 de tu ciudad',
    icon: 'medal',
  },
}

export const ARGENTINE_CITIES = [
  'Buenos Aires',
  'CABA',
  'Cordoba',
  'Rosario',
  'Mendoza',
  'La Plata',
  'Mar del Plata',
  'Tucuman',
  'Salta',
  'Santa Fe',
  'San Juan',
  'Neuquen',
  'Bahia Blanca',
  'Resistencia',
  'Corrientes',
  'Posadas',
  'San Luis',
  'Parana',
  'Formosa',
  'San Salvador de Jujuy',
  'Santiago del Estero',
  'Rio Gallegos',
  'Ushuaia',
  'Rawson',
  'Viedma',
  'La Rioja',
  'Catamarca',
  'Santa Rosa',
  'Otra',
]
