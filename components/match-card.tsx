'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PredictionInput } from '@/components/prediction-input'
import type { Match, Team, Prediction } from '@/lib/types'

// === QUICK TWEAKS: Adjust these values to change the gradient look ===
const GRADIENT_CONFIG = {
  // Gradient intensity (0.0 = invisible, 1.0 = full color)
  gradientAlpha: 0.33,          // try 0.6 for softer, 0.99 for stronger
  gradientAlphaEdge: 0.33,      // try 0.2 for softer, 0.5 for stronger
  // Overlay (background) opacity (0.0 = no cover, 1.0 = fully covers gradient)
  overlayOpacity: 0.35,       // try 0.2 for more color, 0.5 for more readability
  // Blur amount (px) - adds a modern glass effect
  blurPx: 0,                   // try 0 for no blur, 4 for more blur
  // Gradient stop positions (%)
  stopStart: 0,               // don't change
  stopMidEdge: 48,            // try 25 for more color, 35 for less
  stopMid: 50,                // don't change
  stopMidEdge2: 70,           // try 65 for more color, 75 for less
  stopEnd: 100,               // don't change
}
// ==================================================================

function getTeamColors(team?: Team): { left: string; right: string } {
  const code = (team?.code || '').toUpperCase()
  const name = (team?.name || '').toLowerCase()

  const byCode: Record<string, { left: string; right: string }> = {
    // CONMEBOL
    ARG: { left: '#75AADB', right: '#FFFFFF' },
    BOL: { left: '#D52B1E', right: '#007A33' },
    BRA: { left: '#009B3A', right: '#FFDF00' },
    CHI: { left: '#0039A6', right: '#D52B1E' },
    COL: { left: '#FCD116', right: '#003893' },
    ECU: { left: '#FCD116', right: '#003893' },
    PAR: { left: '#D52B1E', right: '#0038A8' },
    PER: { left: '#D91023', right: '#FFFFFF' },
    URU: { left: '#7CC0E6', right: '#FFFFFF' },
    VEN: { left: '#F4C300', right: '#00247D' },

    // UEFA / common
    AUT: { left: '#ED2939', right: '#FFFFFF' },
    BEL: { left: '#000000', right: '#FFD90C' },
    CRO: { left: '#FF0000', right: '#171796' },
    DEN: { left: '#C60C30', right: '#FFFFFF' },
    ENG: { left: '#FFFFFF', right: '#CF142B' },
    ESP: { left: '#AA151B', right: '#F1BF00' },
    FRA: { left: '#0055A4', right: '#EF4135' },
    GER: { left: '#000000', right: '#DD0000' },
    DEU: { left: '#000000', right: '#DD0000' },
    ITA: { left: '#008C45', right: '#CD212A' },
    NED: { left: '#AE1C28', right: '#FF7F00' },
    POR: { left: '#006600', right: '#FF0000' },
    SCO: { left: '#005EB8', right: '#FFFFFF' },
    SUI: { left: '#D52B1E', right: '#FFFFFF' },
    NOR: { left: '#BA0C2F', right: '#00205B' },

    // CAF
    ALG: { left: '#006233', right: '#D21034' },
    CPV: { left: '#003893', right: '#FFFFFF' },
    CIV: { left: '#F77F00', right: '#009E60' },
    EGY: { left: '#CE1126', right: '#000000' },
    GHA: { left: '#CE1126', right: '#006B3F' },
    MAR: { left: '#C1272D', right: '#006233' },
    SEN: { left: '#00853F', right: '#FDEF42' },
    TUN: { left: '#E70013', right: '#FFFFFF' },
    RSA: { left: '#007A4D', right: '#FFB612' },

    // AFC
    AUS: { left: '#004B87', right: '#FFCD00' },
    IRN: { left: '#239F40', right: '#DA0000' },
    JPN: { left: '#FFFFFF', right: '#BC002D' },
    JOR: { left: '#007A3D', right: '#CE1126' },
    KOR: { left: '#003478', right: '#C60C30' },
    KSA: { left: '#006C35', right: '#FFFFFF' },
    QAT: { left: '#8D1B3D', right: '#FFFFFF' },
    UZB: { left: '#1EB7E8', right: '#1EB53A' },

    // CONCACAF
    CAN: { left: '#FF0000', right: '#FFFFFF' },
    HAI: { left: '#00209F', right: '#D21034' },
    MEX: { left: '#006847', right: '#CE1126' },
    PAN: { left: '#005293', right: '#D21034' },
    USA: { left: '#3C3B6E', right: '#B22234' },
    CUW: { left: '#002B7F', right: '#F9E547' },

    // Oceania
    NZL: { left: '#00247D', right: '#CC142B' },

    // Placeholders / playoffs
    EUA: { left: '#64748b', right: '#0f172a' },
    EUB: { left: '#64748b', right: '#0f172a' },
    EUC: { left: '#64748b', right: '#0f172a' },
    EUD: { left: '#64748b', right: '#0f172a' },
    IP1: { left: '#64748b', right: '#0f172a' },
    IP2: { left: '#64748b', right: '#0f172a' },
  }

  if (code && byCode[code]) return byCode[code]
  if (name.includes('argentina')) return byCode.ARG
  if (name.includes('alem')) return byCode.GER
  if (name.includes('brasil') || name.includes('brazil')) return byCode.BRA
  if (name.includes('uruguay')) return byCode.URU
  if (name.includes('francia') || name.includes('france')) return byCode.FRA
  if (name.includes('espa') || name.includes('spain')) return byCode.ESP
  if (name.includes('ital')) return byCode.ITA
  if (name.includes('ingl')) return byCode.ENG
  if (name.includes('portug')) return byCode.POR
  if (name.includes('mex')) return byCode.MEX
  if (name.includes('eeuu') || name.includes('united states') || name === 'usa') return byCode.USA

  return { left: '#334155', right: '#0f172a' }
}

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

  const home = getTeamColors(match.team_home)
  const away = getTeamColors(match.team_away)

  const matchTime = new Date(match.match_date).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow py-0 gap-0',
        isUpcoming && 'cursor-pointer hover:shadow-md',
        isLive && 'ring-2 ring-gold'
      )}
      onClick={() => isUpcoming && setExpanded(!expanded)}
    >
      <CardContent className="relative flex flex-col gap-2 p-3">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${home.left}80 0%, ${home.right}4d 30%, transparent 50%, ${away.left}4d 70%, ${away.right}80 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-background/35 backdrop-blur-[2px]" />
        <div className="relative flex flex-col gap-2">
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
        </div>
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
