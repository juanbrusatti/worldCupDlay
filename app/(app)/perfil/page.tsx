import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AchievementBadge } from '@/components/achievement-badge'
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/types'
import { ProfileActions } from './profile-actions'
import { Target, TrendingUp, Hash, MapPin } from 'lucide-react'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  // Fetch predictions stats
  const { data: predictions } = await supabase
    .from('predictions')
    .select(`
      *,
      match:matches(status)
    `)
    .eq('user_id', user!.id)

  const totalPredictions = predictions?.length || 0
  const finishedPredictions = predictions?.filter((p) => p.match?.status === 'finished') || []
  const correctPredictions = finishedPredictions.filter((p) => p.points_earned > 0)
  const exactPredictions = finishedPredictions.filter((p) => p.points_earned >= 3)
  const accuracy = finishedPredictions.length > 0
    ? Math.round((correctPredictions.length / finishedPredictions.length) * 100)
    : 0

  // Fetch achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', user!.id)

  const unlockedKeys = new Set(achievements?.map((a) => a.achievement_key) || [])

  // Get global rank
  const { count: rankAbove } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('points_total', profile?.points_total || 0)

  const globalRank = (rankAbove || 0) + 1

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {profile?.display_name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{profile?.display_name}</h1>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {profile?.city}
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<TrendingUp className="h-4 w-4 text-gold" />}
          value={profile?.points_total || 0}
          label="Puntos Totales"
        />
        <StatCard
          icon={<Target className="h-4 w-4 text-success" />}
          value={`#${globalRank}`}
          label="Ranking Global"
        />
        <StatCard
          icon={<Hash className="h-4 w-4 text-primary" />}
          value={totalPredictions}
          label="Pronosticos"
        />
        <StatCard
          icon={<Target className="h-4 w-4 text-chart-4" />}
          value={`${accuracy}%`}
          label="Efectividad"
        />
      </div>

      {/* Detailed stats */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Resultados exactos</span>
            <span className="font-semibold text-foreground">{exactPredictions.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ganador/empate acertado</span>
            <span className="font-semibold text-foreground">
              {correctPredictions.length - exactPredictions.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Partidos jugados</span>
            <span className="font-semibold text-foreground">{finishedPredictions.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Logros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(ACHIEVEMENT_DEFINITIONS).map((key) => (
              <AchievementBadge
                key={key}
                achievementKey={key}
                unlocked={unlockedKeys.has(key)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ProfileActions
        displayName={profile?.display_name || ''}
        points={profile?.points_total || 0}
        globalRank={globalRank}
      />
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
