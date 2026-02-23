'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PredictionInput } from '@/components/prediction-input'
import type { Match, Team, Prediction } from '@/lib/types'

interface MatchCardProps {
  match: Match & { team_home: Team; team_away: Team }
  prediction?: Prediction | null
  onPredictionSaved?: () => void
}

export function MatchCard({ match, prediction, onPredictionSaved }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isUpcoming = match.status === 'upcoming'
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  const matchTime = new Date(match.match_date).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow',
        isUpcoming && 'cursor-pointer hover:shadow-md',
        isLive && 'ring-2 ring-gold'
      )}
      onClick={() => isUpcoming && setExpanded(!expanded)}
    >
      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Grupo {match.group_letter} - {match.venue}
          </span>
          {isLive && (
            <Badge variant="secondary" className="bg-gold text-gold-foreground text-xs">
              EN VIVO
            </Badge>
          )}
          {isFinished && (
            <Badge variant="secondary" className="text-xs">
              Finalizado
            </Badge>
          )}
          {isUpcoming && (
            <span className="text-xs font-medium text-muted-foreground">{matchTime}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <TeamDisplay team={match.team_home} side="home" />

          <div className="flex flex-col items-center gap-0.5">
            {isFinished || isLive ? (
              <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <span>{match.score_home}</span>
                <span className="text-muted-foreground">-</span>
                <span>{match.score_away}</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">vs</span>
            )}
          </div>

          <TeamDisplay team={match.team_away} side="away" />
        </div>

        {isFinished && prediction && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-secondary p-2">
            <span className="text-xs text-muted-foreground">Tu prode:</span>
            <span className="text-sm font-semibold text-foreground">
              {prediction.predicted_home} - {prediction.predicted_away}
            </span>
            {prediction.points_earned > 0 && (
              <Badge className={cn(
                'text-xs',
                prediction.points_earned === 3
                  ? 'bg-gold text-gold-foreground'
                  : 'bg-success text-success-foreground'
              )}>
                +{prediction.points_earned} pts
              </Badge>
            )}
            {prediction.points_earned === 0 && (
              <Badge variant="secondary" className="text-xs">
                0 pts
              </Badge>
            )}
          </div>
        )}

        {isUpcoming && prediction && !expanded && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-secondary p-2">
            <span className="text-xs text-muted-foreground">Tu prode:</span>
            <span className="text-sm font-semibold text-foreground">
              {prediction.predicted_home} - {prediction.predicted_away}
            </span>
            {prediction.wildcard && (
              <Badge className="bg-gold text-gold-foreground text-xs">
                {prediction.wildcard === 'double' ? 'x2' : 'Seguro'}
              </Badge>
            )}
          </div>
        )}

        {isUpcoming && expanded && (
          <PredictionInput
            matchId={match.id}
            existingPrediction={prediction}
            onSaved={() => {
              setExpanded(false)
              onPredictionSaved?.()
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

function TeamDisplay({ team, side }: { team: Team; side: 'home' | 'away' }) {
  return (
    <div className={cn(
      'flex flex-1 items-center gap-2',
      side === 'away' && 'flex-row-reverse'
    )}>
      <span className="text-2xl" role="img" aria-label={`Bandera de ${team.name}`}>
        {team.flag_emoji}
      </span>
      <div className={cn(
        'flex flex-col',
        side === 'away' && 'items-end'
      )}>
        <span className="text-sm font-semibold text-foreground leading-tight">{team.name}</span>
        <span className="text-xs text-muted-foreground">{team.code}</span>
      </div>
    </div>
  )
}
