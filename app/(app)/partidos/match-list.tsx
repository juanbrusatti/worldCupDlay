'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MatchCard } from '@/components/match-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import type { Match, Team, Prediction } from '@/lib/types'

type MatchWithTeams = Match & { team_home: Team; team_away: Team }

interface MatchListProps {
  matches: MatchWithTeams[]
  predictions: Prediction[]
}

export function MatchList({ matches, predictions }: MatchListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('upcoming')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

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

  const groupedByStage = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime(),
    )

    const groupStage = new Map<string, MatchWithTeams[]>()
    const knockouts = new Map<string, MatchWithTeams[]>()

    sorted.forEach((match) => {
      if (match.stage === 'group') {
        const key = match.group_letter || 'Sin grupo'
        if (!groupStage.has(key)) groupStage.set(key, [])
        groupStage.get(key)!.push(match)
        return
      }

      const key = match.stage
      if (!knockouts.has(key)) knockouts.set(key, [])
      knockouts.get(key)!.push(match)
    })

    return { groupStage, knockouts }
  }, [filtered])

  const stageOrder = useMemo(() => {
    const order: Array<Match['stage']> = [
      'round_of_16',
      'quarter',
      'semi',
      'third_place',
      'final',
    ]
    return order
  }, [])

  const stageLabels: Partial<Record<Match['stage'], string>> = {
    group: 'Fase de Grupos',
    round_of_16: 'Octavos de Final',
    quarter: 'Cuartos de Final',
    semi: 'Semifinales',
    third_place: 'Tercer Puesto',
    final: 'Final',
  }

  function sectionKey(key: string) {
    return `${filter}:${key}`
  }

  function isOpen(key: string) {
    return Boolean(openSections[sectionKey(key)])
  }

  function setOpen(key: string, next: boolean) {
    setOpenSections((prev) => ({ ...prev, [sectionKey(key)]: next }))
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">Proximos</TabsTrigger>
          <TabsTrigger value="finished" className="flex-1">Finalizados</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-muted-foreground">
            {filter === 'finished'
              ? 'Todavia no hay partidos finalizados'
              : 'No hay partidos proximos'}
          </p>
        </div>
      )}

      {groupedByStage.groupStage.size > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{stageLabels.group}</h2>
          {Array.from(groupedByStage.groupStage.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([groupLetter, groupMatches]) => {
              const key = `group-${groupLetter}`
              return (
                <Collapsible
                  key={groupLetter}
                  open={isOpen(key)}
                  onOpenChange={(next) => setOpen(key, next)}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-base">Grupo {groupLetter}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{groupMatches.length} partidos</span>
                          <CollapsibleTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background/60">
                            <ChevronDown className={isOpen(key) ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'} />
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="flex flex-col gap-2">
                        {groupMatches.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            prediction={predictionMap.get(match.id)}
                            onPredictionSaved={() => router.refresh()}
                          />
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}
        </div>
      )}

      {Array.from(groupedByStage.knockouts.entries()).length > 0 && (
        <div className="flex flex-col gap-3">
          {stageOrder
            .filter((stage) => groupedByStage.knockouts.has(stage))
            .map((stage) => {
              const key = `stage-${stage}`
              const list = groupedByStage.knockouts.get(stage) || []
              return (
                <Collapsible
                  key={stage}
                  open={isOpen(key)}
                  onOpenChange={(next) => setOpen(key, next)}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-base">{stageLabels[stage] || stage}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{list.length} partidos</span>
                          <CollapsibleTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background/60">
                            <ChevronDown className={isOpen(key) ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'} />
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="flex flex-col gap-2">
                        {list.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            prediction={predictionMap.get(match.id)}
                            onPredictionSaved={() => router.refresh()}
                          />
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}

          {Array.from(groupedByStage.knockouts.keys())
            .filter((k) => !stageOrder.includes(k as Match['stage']))
            .sort((a, b) => a.localeCompare(b))
            .map((stage) => {
              const key = `stage-${stage}`
              const list = groupedByStage.knockouts.get(stage) || []
              return (
                <Collapsible
                  key={stage}
                  open={isOpen(key)}
                  onOpenChange={(next) => setOpen(key, next)}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-base">{stageLabels[stage as Match['stage']] || stage}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{list.length} partidos</span>
                          <CollapsibleTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background/60">
                            <ChevronDown className={isOpen(key) ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'} />
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="flex flex-col gap-2">
                        {list.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            prediction={predictionMap.get(match.id)}
                            onPredictionSaved={() => router.refresh()}
                          />
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}
        </div>
      )}
    </div>
  )
}
