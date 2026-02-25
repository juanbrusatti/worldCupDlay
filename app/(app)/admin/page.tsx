import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calculator, CheckCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

// Función de cálculo de puntos (temporalmente aquí para evitar error de importación)
function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
  wildcard: 'double' | 'insurance' | null
): number {
  let points = 0

  // Resultado exacto: 3 puntos
  if (predictedHome === actualHome && predictedAway === actualAway) {
    points = 3
  }
  // Ganador correcto: 1 punto
  else if (
    (predictedHome > predictedAway && actualHome > actualAway) ||
    (predictedHome < predictedAway && actualHome < actualAway) ||
    (predictedHome === predictedAway && actualHome === actualAway)
  ) {
    points = 1
  }

  // Aplicar comodines
  if (wildcard === 'double' && points > 0) {
    points *= 2
  } else if (wildcard === 'insurance' && points === 0) {
    points = 1
  }

  return points
}

async function getMatches() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('matches')
    .select(`
      *,
      team_home:teams!matches_team_home_id_fkey(*),
      team_away:teams!matches_team_away_id_fkey(*)
    `)
    .order('match_date', { ascending: true })

  return data || []
}

async function updateMatchResult(formData: FormData) {
  'use server'
  
  const matchId = Number(formData.get('matchId'))
  const scoreHome = Number(formData.get('scoreHome'))
  const scoreAway = Number(formData.get('scoreAway'))
  
  console.log('Datos recibidos:', { matchId, scoreHome, scoreAway })
  
  const supabase = await createClient()
  
  try {
    // Actualizar resultado del partido
    console.log('Actualizando partido:', matchId, 'con resultado:', scoreHome, '-', scoreAway)
    
    const { data: matchUpdateData, error: matchError } = await supabase
      .from('matches')
      .update({ 
        status: 'finished',
        score_home: scoreHome,
        score_away: scoreAway
      })
      .eq('id', matchId)
      .select()

    if (matchError) {
      console.error('Error updating match:', matchError)
      throw new Error(matchError.message)
    }

    console.log('Partido actualizado exitosamente:', matchUpdateData)

    // Obtener todas las predicciones para este partido
    const { data: predictions, error: predError } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)

    if (predError) {
      console.error('Error fetching predictions:', predError)
      throw new Error(predError.message)
    }

    console.log('Predicciones encontradas:', predictions?.length || 0)

    // Calcular puntos para cada predicción
    const updates = predictions?.map(pred => {
      const points = calculateMatchPoints(
        pred.predicted_home,
        pred.predicted_away,
        scoreHome,
        scoreAway,
        pred.wildcard as 'double' | 'insurance' | null
      )

      return {
        id: pred.id,
        points_earned: points
      }
    }) || []

    console.log('Updates a realizar:', updates)

    // Actualizar puntos de todas las predicciones usando función simple
    if (updates.length > 0) {
      console.log('Actualizando puntos para', updates.length, 'predicciones')
      
      for (const update of updates) {
        const { error: updateError } = await supabase.rpc('simple_update_points', {
          p_prediction_id: update.id,
          p_points: update.points_earned
        })

        if (updateError) {
          console.error('Error updating prediction', update.id, ':', updateError)
          throw new Error(updateError.message)
        }
        
        console.log('Predicción', update.id, 'actualizada con', update.points_earned, 'puntos')
      }

      console.log('Todos los puntos actualizados exitosamente')
    }

    // Actualizar puntos totales de todos los perfiles
    const { error: profileError } = await supabase.rpc('update_all_profile_points')
    
    if (profileError) {
      console.error('Error actualizando puntos totales:', profileError)
    } else {
      console.log('Puntos totales actualizados exitosamente')
    }

    // Redirigir o mostrar éxito
    console.log('Resultados cargados exitosamente')
    
    // Redirigir para refrescar los datos
    redirect('/admin')
    
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export default async function AdminPage() {
  const matches = await getMatches()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona los resultados de los partidos</p>
      </header>

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
              <form action={updateMatchResult} className="space-y-4">
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
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
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
    </div>
  )
}
