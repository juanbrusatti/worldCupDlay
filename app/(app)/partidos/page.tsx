import { createClient } from '@/lib/supabase/server'
import { MatchList } from './match-list'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch matches with team info
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      team_home:teams!matches_team_home_id_fkey(*),
      team_away:teams!matches_team_away_id_fkey(*)
    `)
    .order('match_date', { ascending: true })

  // Fetch user predictions
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user!.id)

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Partidos</h1>
        <p className="text-sm text-muted-foreground">
          Toca un partido para ingresar tu pronostico
        </p>
      </header>
      <MatchList
        matches={matches || []}
        predictions={predictions || []}
      />
    </div>
  )
}
