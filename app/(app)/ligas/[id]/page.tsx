import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RankingTable } from '@/components/ranking-table'
import { LeagueDetailActions } from './league-detail-actions'

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch league
  const { data: league } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', id)
    .single()

  if (!league) notFound()

  // Check if user is a member
  const { data: membership } = await supabase
    .from('league_members')
    .select('id')
    .eq('league_id', league.id)
    .eq('user_id', user!.id)
    .single()

  if (!membership) {
    redirect('/ligas')
  }

  // Fetch members with profiles
  const { data: members } = await supabase
    .from('league_members')
    .select('user_id')
    .eq('league_id', league.id)

  const memberIds = members?.map((m) => m.user_id) || []

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', memberIds)
    .order('points_total', { ascending: false })

  const rankedProfiles = (profiles || []).map((p, i) => ({
    ...p,
    rank: i + 1,
  }))

  const isOwner = league.owner_id === user!.id

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">{league.name}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{rankedProfiles.length} miembros</span>
          <span className="font-mono tracking-wider text-primary">{league.code}</span>
        </div>
      </header>

      <LeagueDetailActions
        leagueId={league.id}
        leagueName={league.name}
        leagueCode={league.code}
        isOwner={isOwner}
      />

      <RankingTable
        profiles={rankedProfiles}
        currentUserId={user!.id}
        showCity={true}
      />
    </div>
  )
}
