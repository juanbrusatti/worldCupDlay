'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RankingTable } from '@/components/ranking-table'
import type { Profile } from '@/lib/types'

interface RankedProfile extends Profile {
  rank: number
}

interface RankingTabsProps {
  currentUserId: string
  globalRanking: RankedProfile[]
  cityRanking: RankedProfile[]
  cityName: string
  leagueRankings: {
    league: { id: number; name: string }
    profiles: RankedProfile[]
  }[]
}

export function RankingTabs({
  currentUserId,
  globalRanking,
  cityRanking,
  cityName,
  leagueRankings,
}: RankingTabsProps) {
  return (
    <Tabs defaultValue="global">
      <TabsList className="w-full">
        <TabsTrigger value="global" className="flex-1">Global</TabsTrigger>
        <TabsTrigger value="city" className="flex-1">{cityName || 'Ciudad'}</TabsTrigger>
        <TabsTrigger value="leagues" className="flex-1">Mis Ligas</TabsTrigger>
      </TabsList>

      <TabsContent value="global" className="mt-4">
        <RankingTable profiles={globalRanking} currentUserId={currentUserId} />
      </TabsContent>

      <TabsContent value="city" className="mt-4">
        <RankingTable profiles={cityRanking} currentUserId={currentUserId} showCity={false} />
      </TabsContent>

      <TabsContent value="leagues" className="mt-4">
        {leagueRankings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-muted-foreground">No estas en ninguna liga todavia</p>
            <p className="text-xs text-muted-foreground">Anda a la seccion Ligas para crear o unirte a una</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {leagueRankings.map((lr) => (
              <div key={lr.league.id} className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-foreground">{lr.league.name}</h3>
                <RankingTable profiles={lr.profiles} currentUserId={currentUserId} showCity={false} />
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
