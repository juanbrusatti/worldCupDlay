import { createClient } from '@/lib/supabase/server'
import { createMatch, updateMatchResult } from './actions'
import { MatchForm } from './match-form'
import { MatchList } from './match-list'


async function getMatches() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('matches')
    .select(`
      *,
      team_home:teams!matches_team_home_id_fkey(*),
      team_away:teams!matches_team_away_id_fkey(*)
    `)
    .order('match_date', { ascending: true })

  return data || []
}

async function getTeams() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true })

  return data || []
}



export default async function AdminPage() {
  const matches = await getMatches()
  const teams = await getTeams()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona los resultados de los partidos</p>
      </header>

      <MatchForm teams={teams} />
      <MatchList matches={matches} />
    </div>
  )
}
