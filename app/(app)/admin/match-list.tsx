'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calculator, CheckCircle } from 'lucide-react'
import { updateMatchResult } from './actions'

interface Team {
  id: number
  name: string
  flag_emoji: string
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
          <Card key={match.id}>
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
            <CardContent>
              <form action={updateMatchResult} key={`update-match-${match.id}`} className="space-y-4">
                <input type="hidden" name="matchId" value={match.id} />

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{match.team_home?.flag_emoji}</span>
                    <span className="font-medium">{match.team_home?.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {match.status === 'finished' ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{match.score_home}</span>
                        <span className="font-bold">VS</span>
                        <span className="font-bold text-lg">{match.score_away}</span>
                      </div>
                    ) : (
                      <>
                        <Input
                          type="number"
                          name="scoreHome"
                          placeholder="0"
                          className="w-16 text-center"
                          min="0"
                          max="99"
                          required
                        />
                        <span className="font-bold">VS</span>
                        <Input
                          type="number"
                          name="scoreAway"
                          placeholder="0"
                          className="w-16 text-center"
                          min="0"
                          max="99"
                          required
                        />
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">{match.team_away?.name}</span>
                    <span className="text-2xl">{match.team_away?.flag_emoji}</span>
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
