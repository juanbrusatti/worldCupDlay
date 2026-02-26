'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calculator, CheckCircle, Trash2 } from 'lucide-react'
import { updateMatchResult, deleteMatch } from './actions'

interface Team {
  id: number
  name: string
  code?: string
  flag_emoji: string
}

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

    // UEFA (common)
    ALB: { left: '#E41E20', right: '#000000' },
    AUT: { left: '#ED2939', right: '#FFFFFF' },
    BEL: { left: '#000000', right: '#FFD90C' },
    BIH: { left: '#002F6C', right: '#FCD116' },
    BUL: { left: '#FFFFFF', right: '#00966E' },
    CRO: { left: '#FF0000', right: '#171796' },
    CZE: { left: '#11457E', right: '#D7141A' },
    DEN: { left: '#C60C30', right: '#FFFFFF' },
    ENG: { left: '#FFFFFF', right: '#CF142B' },
    ESP: { left: '#AA151B', right: '#F1BF00' },
    EST: { left: '#0072CE', right: '#000000' },
    FIN: { left: '#003580', right: '#FFFFFF' },
    FRA: { left: '#0055A4', right: '#EF4135' },
    GEO: { left: '#FFFFFF', right: '#E41E20' },
    GER: { left: '#000000', right: '#DD0000' },
    DEU: { left: '#000000', right: '#DD0000' },
    GRE: { left: '#0D5EAF', right: '#FFFFFF' },
    HUN: { left: '#CE2939', right: '#436F4D' },
    IRL: { left: '#169B62', right: '#FF883E' },
    ISL: { left: '#003897', right: '#D72828' },
    ITA: { left: '#008C45', right: '#CD212A' },
    KOS: { left: '#244AA5', right: '#D0A650' },
    LAT: { left: '#9E3039', right: '#FFFFFF' },
    LVA: { left: '#9E3039', right: '#FFFFFF' },
    LTU: { left: '#FDB913', right: '#006A44' },
    LUX: { left: '#00A1DE', right: '#EF3340' },
    MKD: { left: '#D20000', right: '#FFE600' },
    MDA: { left: '#0033A0', right: '#FFD100' },
    MNE: { left: '#D20000', right: '#D4AF37' },
    NED: { left: '#AE1C28', right: '#FF7F00' },
    HOL: { left: '#AE1C28', right: '#FF7F00' },
    NOR: { left: '#BA0C2F', right: '#00205B' },
    POL: { left: '#DC143C', right: '#FFFFFF' },
    POR: { left: '#006600', right: '#FF0000' },
    ROU: { left: '#002B7F', right: '#FCD116' },
    SCO: { left: '#005EB8', right: '#FFFFFF' },
    SRB: { left: '#C6363C', right: '#0C4076' },
    SVK: { left: '#0B4EA2', right: '#EE1C25' },
    SVN: { left: '#005CE6', right: '#FFFFFF' },
    SUI: { left: '#D52B1E', right: '#FFFFFF' },
    SWE: { left: '#006AA7', right: '#FECC00' },
    TUR: { left: '#E30A17', right: '#FFFFFF' },
    UKR: { left: '#0057B7', right: '#FFD700' },
    WAL: { left: '#D52B1E', right: '#FFFFFF' },

    // CAF
    ALG: { left: '#006233', right: '#D21034' },
    CPV: { left: '#003893', right: '#FFFFFF' },
    CMR: { left: '#007A5E', right: '#CE1126' },
    CIV: { left: '#F77F00', right: '#009E60' },
    COD: { left: '#007FFF', right: '#F7D618' },
    DRC: { left: '#007FFF', right: '#F7D618' },
    EGY: { left: '#CE1126', right: '#000000' },
    GHA: { left: '#CE1126', right: '#006B3F' },
    GUI: { left: '#CE1126', right: '#009460' },
    GIN: { left: '#CE1126', right: '#009460' },
    MAR: { left: '#C1272D', right: '#006233' },
    NGA: { left: '#008751', right: '#FFFFFF' },
    SEN: { left: '#00853F', right: '#FDEF42' },
    TUN: { left: '#E70013', right: '#FFFFFF' },

    // AFC

    // AFC
    AUS: { left: '#004B87', right: '#FFCD00' },
    CHN: { left: '#DE2910', right: '#FFDE00' },
    IRN: { left: '#239F40', right: '#DA0000' },
    IRQ: { left: '#CE1126', right: '#007A3D' },
    JPN: { left: '#FFFFFF', right: '#BC002D' },
    KOR: { left: '#003478', right: '#C60C30' },
    PRK: { left: '#024FA2', right: '#ED1C27' },
    KSA: { left: '#006C35', right: '#FFFFFF' },
    QAT: { left: '#8D1B3D', right: '#FFFFFF' },
    UAE: { left: '#00732F', right: '#000000' },

    // CONCACAF
    CAN: { left: '#FF0000', right: '#FFFFFF' },
    CRC: { left: '#002B7F', right: '#CE1126' },
    HON: { left: '#18A0FB', right: '#FFFFFF' },
    HAI: { left: '#00209F', right: '#D21034' },
    JAM: { left: '#009B3A', right: '#FED100' },
    MEX: { left: '#006847', right: '#CE1126' },
    PAN: { left: '#005293', right: '#D21034' },
    SLV: { left: '#0F47AF', right: '#FFFFFF' },
    USA: { left: '#3C3B6E', right: '#B22234' },

    // Caribbean / other
    CUW: { left: '#002B7F', right: '#F9E547' },

    // Oceania
    NZL: { left: '#00247D', right: '#CC142B' },

    // AFC extras
    JOR: { left: '#007A3D', right: '#CE1126' },
    UZB: { left: '#1EB7E8', right: '#1EB53A' },

    // Africa extras
    RSA: { left: '#007A4D', right: '#FFB612' },

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
  if (name.includes('brasil') || name.includes('brazil')) return byCode.BRA
  if (name.includes('uruguay')) return byCode.URU
  if (name.includes('francia') || name.includes('france')) return byCode.FRA
  if (name.includes('espa') || name.includes('spain')) return byCode.ESP
  if (name.includes('alem') || name.includes('german')) return byCode.GER
  if (name.includes('ital')) return byCode.ITA
  if (name.includes('ingl')) return byCode.ENG
  if (name.includes('portug')) return byCode.POR
  if (name.includes('eeuu') || name.includes('united states') || name === 'usa') return byCode.USA
  if (name.includes('mex')) return byCode.MEX

  return { left: '#334155', right: '#0f172a' }
}

interface Match {
  id: number
  team_home: Team
  team_away: Team
  group_letter: string
  venue: string
  match_date: string
  status: 'upcoming' | 'live' | 'finished'
  score_home?: number
  score_away?: number
}

interface MatchListProps {
  matches: Match[]
}

export function MatchList({ matches }: MatchListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Partidos Existentes</h2>
      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span>Partido #{match.id}</span>
                </div>
                <Badge variant={match.status === 'live' ? 'default' : match.status === 'finished' ? 'destructive' : 'secondary'}>
                  {match.status === 'live' ? 'En vivo' : match.status === 'finished' ? 'Finalizado' : 'Pendiente'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(() => {
                const home = getTeamColors(match.team_home)
                const away = getTeamColors(match.team_away)
                return (
                  <div className="relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          `linear-gradient(90deg, ${home.left}33 0%, ${home.right}1f 30%, transparent 50%, ${away.left}1f 70%, ${away.right}33 100%)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-background/70" />
                    <div className="relative p-6">
              <form action={updateMatchResult} key={`update-match-${match.id}`} className="space-y-4">
                <input type="hidden" name="matchId" value={match.id} />

                <div className="rounded-xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 rounded-full border"
                        style={{
                          background: `linear-gradient(135deg, ${home.left}, ${home.right})`,
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl leading-none">{match.team_home?.flag_emoji}</span>
                          <span className="font-semibold truncate">{match.team_home?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {match.status === 'finished' ? (
                        <div className="flex items-baseline gap-2 rounded-lg border bg-background/70 px-3 py-1">
                          <span className="font-bold text-xl tabular-nums">{match.score_home}</span>
                          <span className="text-xs text-muted-foreground">VS</span>
                          <span className="font-bold text-xl tabular-nums">{match.score_away}</span>
                        </div>
                      ) : (
                        <>
                          <Input
                            type="number"
                            name="scoreHome"
                            placeholder="0"
                            className="w-16 text-center tabular-nums"
                            min="0"
                            max="99"
                            required
                          />
                          <span className="text-xs text-muted-foreground">VS</span>
                          <Input
                            type="number"
                            name="scoreAway"
                            placeholder="0"
                            className="w-16 text-center tabular-nums"
                            min="0"
                            max="99"
                            required
                          />
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 min-w-0">
                      <div className="min-w-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold truncate">{match.team_away?.name}</span>
                          <span className="text-2xl leading-none">{match.team_away?.flag_emoji}</span>
                        </div>
                      </div>
                      <div
                        className="h-10 w-10 rounded-full border"
                        style={{
                          background: `linear-gradient(135deg, ${away.left}, ${away.right})`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Grupo {match.group_letter} • {match.venue}</span>
                  <span>{new Date(match.match_date).toLocaleString('es-AR', {
                    timeZone: 'America/Argentina/Buenos_Aires',
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</span>
                </div>

                {match.status !== 'finished' && (
                  <Button type="submit" className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Cargar Resultado y Calcular Puntos
                  </Button>
                )}
              </form>
              
              {/* Formulario para eliminar partido */}
              <form action={deleteMatch} className="mt-2">
                <input type="hidden" name="matchId" value={match.id} />
                <Button 
                  type="submit" 
                  variant="destructive" 
                  className="w-full"
                  onClick={(e) => {
                    if (!confirm('¿Estás seguro de que quieres eliminar este partido? Se eliminarán todas las predicciones asociadas.')) {
                      e.preventDefault()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Partido
                </Button>
              </form>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No hay partidos pendientes de cargar</p>
            <p className="text-xs text-muted-foreground">Todos los partidos tienen resultados</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
