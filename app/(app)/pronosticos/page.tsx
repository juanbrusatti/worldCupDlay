import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function PronosticosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch predictions with match and team info
  const { data: predictions } = await supabase
    .from('predictions')
    .select(`
      *,
      match:matches(
        *,
        team_home:teams!matches_team_home_id_fkey(*),
        team_away:teams!matches_team_away_id_fkey(*)
      )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const totalPredictions = predictions?.length || 0
  const totalPoints = predictions?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0
  const finishedPredictions = predictions?.filter((p) => p.match?.status === 'finished') || []
  const correctPredictions = finishedPredictions.filter((p) => p.points_earned > 0)
  const exactPredictions = finishedPredictions.filter((p) => p.points_earned >= 3)
  const accuracy = finishedPredictions.length > 0
    ? Math.round((correctPredictions.length / finishedPredictions.length) * 100)
    : 0

  // Group by match date
  const grouped = new Map<string, typeof predictions>()
  predictions?.forEach((pred) => {
    if (!pred.match) return
    const dateKey = new Date(pred.match.match_date).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'America/Argentina/Buenos_Aires',
    })
    if (!grouped.has(dateKey)) grouped.set(dateKey, [])
    grouped.get(dateKey)!.push(pred)
  })

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Mis Pronosticos</h1>
      </header>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={<TrendingUp className="h-4 w-4 text-gold" />} value={totalPoints} label="Puntos" />
        <StatCard icon={<Target className="h-4 w-4 text-success" />} value={`${accuracy}%`} label="Aciertos" />
        <StatCard icon={<Hash className="h-4 w-4 text-primary" />} value={totalPredictions} label="Prodes" />
      </div>

      {totalPredictions === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-muted-foreground">No hiciste ningun pronostico todavia</p>
          <p className="text-xs text-muted-foreground">Anda a Partidos para empezar</p>
        </div>
      ) : (
        Array.from(grouped.entries()).map(([date, preds]) => (
          <div key={date} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold capitalize text-muted-foreground">{date}</h2>
            {preds?.map((pred) => {
              const match = pred.match
              if (!match) return null
              const isFinished = match.status === 'finished'
              return (
                <Card key={pred.id}>
                  <CardContent className="flex flex-col gap-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Grupo {match.group_letter}
                      </span>
                      {isFinished && pred.points_earned > 0 && (
                        <Badge className={cn(
                          'text-xs',
                          pred.points_earned >= 3
                            ? 'bg-gold text-gold-foreground'
                            : 'bg-success text-success-foreground'
                        )}>
                          +{pred.points_earned} pts
                        </Badge>
                      )}
                      {isFinished && pred.points_earned === 0 && (
                        <Badge variant="secondary" className="text-xs">0 pts</Badge>
                      )}
                      {!isFinished && (
                        <Badge variant="outline" className="text-xs">Pendiente</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{match.team_home?.flag_emoji}</span>
                        <span className="text-sm font-medium text-foreground">{match.team_home?.code}</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-bold text-foreground">
                          {pred.predicted_home} - {pred.predicted_away}
                        </span>
                        {isFinished && (
                          <span className="text-xs text-muted-foreground">
                            Real: {match.score_home} - {match.score_away}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{match.team_away?.code}</span>
                        <span className="text-lg">{match.team_away?.flag_emoji}</span>
                      </div>
                    </div>

                    {pred.wildcard && (
                      <div className="flex justify-center">
                        <Badge className="bg-gold text-gold-foreground text-xs">
                          {pred.wildcard === 'double' ? 'Puntos x2' : 'Seguro'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-3">
        {icon}
        <span className="text-lg font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  )
}
