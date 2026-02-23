'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MatchCard } from '@/components/match-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Match, Team, Prediction } from '@/lib/types'

type MatchWithTeams = Match & { team_home: Team; team_away: Team }

interface MatchListProps {
  matches: MatchWithTeams[]
  predictions: Prediction[]
}

export function MatchList({ matches, predictions }: MatchListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('upcoming')

  const predictionMap = useMemo(() => {
    const map = new Map<number, Prediction>()
    predictions.forEach((p) => map.set(p.match_id, p))
    return map
  }, [predictions])

  const filtered = useMemo(() => {
    if (filter === 'all') return matches
    return matches.filter((m) => {
      if (filter === 'upcoming') return m.status === 'upcoming' || m.status === 'live'
      return m.status === 'finished'
    })
  }, [matches, filter])

  // Group matches by date
  const grouped = useMemo(() => {
    const groups = new Map<string, MatchWithTeams[]>()
    filtered.forEach((match) => {
      const dateKey = new Date(match.match_date).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Argentina/Buenos_Aires',
      })
      if (!groups.has(dateKey)) groups.set(dateKey, [])
      groups.get(dateKey)!.push(match)
    })
    return groups
  }, [filtered])

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">Proximos</TabsTrigger>
          <TabsTrigger value="finished" className="flex-1">Finalizados</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
        </TabsList>
      </Tabs>

      {grouped.size === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-muted-foreground">
            {filter === 'finished'
              ? 'Todavia no hay partidos finalizados'
              : 'No hay partidos proximos'}
          </p>
        </div>
      )}

      {Array.from(grouped.entries()).map(([date, dayMatches]) => (
        <div key={date} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold capitalize text-muted-foreground">{date}</h2>
          {dayMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictionMap.get(match.id)}
              onPredictionSaved={() => router.refresh()}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
