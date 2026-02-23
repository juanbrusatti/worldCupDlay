import { createClient } from '@/lib/supabase/server'
import { LigasList } from './ligas-list'

export default async function LigasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch leagues the user is part of
  const { data: memberships } = await supabase
    .from('league_members')
    .select(`
      league_id,
      leagues(
        id, name, code, owner_id, created_at
      )
    `)
    .eq('user_id', user!.id)

  // Count members per league
  const leagues = await Promise.all(
    (memberships || []).map(async (m) => {
      const league = m.leagues as unknown as {
        id: number; name: string; code: string; owner_id: string; created_at: string
      }
      const { count } = await supabase
        .from('league_members')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', league.id)

      return { ...league, member_count: count || 0 }
    })
  )

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Mis Ligas</h1>
        <p className="text-sm text-muted-foreground">
          Crea o unite a una liga para competir con amigos
        </p>
      </header>
      <LigasList leagues={leagues} currentUserId={user!.id} />
    </div>
  )
}
