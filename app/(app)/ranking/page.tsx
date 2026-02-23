import { createClient } from '@/lib/supabase/server'
import { RankingTabs } from './ranking-tabs'

export default async function RankingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile for city
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  // Fetch global ranking (top 100)
  const { data: globalProfiles } = await supabase
    .from('profiles')
    .select('*')
    .order('points_total', { ascending: false })
    .limit(100)

  // Fetch city ranking
  const { data: cityProfiles } = currentProfile
    ? await supabase
        .from('profiles')
        .select('*')
        .eq('city', currentProfile.city)
        .order('points_total', { ascending: false })
        .limit(100)
    : { data: [] }

  // Fetch leagues the user belongs to
  const { data: leagueMemberships } = await supabase
    .from('league_members')
    .select('league_id, leagues(id, name)')
    .eq('user_id', user!.id)

  // For each league, get member rankings
  const leagueRankings: { league: { id: number; name: string }; profiles: typeof globalProfiles }[] = []

  if (leagueMemberships) {
    for (const membership of leagueMemberships) {
      const league = membership.leagues as unknown as { id: number; name: string }
      if (!league) continue

      const { data: members } = await supabase
        .from('league_members')
        .select('user_id')
        .eq('league_id', league.id)

      if (members) {
        const memberIds = members.map((m) => m.user_id)
        const { data: memberProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', memberIds)
          .order('points_total', { ascending: false })

        leagueRankings.push({ league, profiles: memberProfiles || [] })
      }
    }
  }

  // Add rank numbers
  const addRanks = (profiles: typeof globalProfiles) =>
    (profiles || []).map((p, i) => ({ ...p, rank: i + 1 }))

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Ranking</h1>
      </header>
      <RankingTabs
        currentUserId={user!.id}
        globalRanking={addRanks(globalProfiles)}
        cityRanking={addRanks(cityProfiles)}
        cityName={currentProfile?.city || ''}
        leagueRankings={leagueRankings.map((lr) => ({
          league: lr.league,
          profiles: addRanks(lr.profiles),
        }))}
      />
    </div>
  )
}
