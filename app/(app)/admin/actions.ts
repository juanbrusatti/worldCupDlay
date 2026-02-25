'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

export async function createMatch(formData: FormData) {
  const supabase = await createClient()
  
  const matchDate = new Date(formData.get('match_date') as string)
  
  const matchData = {
    team_home_id: Number(formData.get('team_home_id')),
    team_away_id: Number(formData.get('team_away_id')),
    group_letter: formData.get('group_letter') as string,
    match_date: matchDate.toISOString(),
    venue: formData.get('venue') as string,
    stage: formData.get('stage') as string,
    status: 'upcoming'
  }

  const { error } = await supabase
    .from('matches')
    .insert(matchData)

  if (error) {
    console.error('Error creating match:', error)
    throw new Error(error.message)
  }

  redirect('/admin')
}

export async function updateMatchResult(formData: FormData) {
  const matchId = Number(formData.get('matchId'))
  const scoreHome = Number(formData.get('scoreHome'))
  const scoreAway = Number(formData.get('scoreAway'))

  const supabase = await createClient()
  
  try {
    // Actualizar resultado del partido
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

    // Obtener todas las predicciones para este partido
    const { data: predictions, error: predError } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)

    if (predError) {
      console.error('Error fetching predictions:', predError)
      throw new Error(predError.message)
    }

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

    // Actualizar puntos de todas las predicciones usando función simple
    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await supabase.rpc('simple_update_points', {
          p_prediction_id: update.id,
          p_points: update.points_earned
        })

        if (updateError) {
          console.error('Error updating prediction', update.id, ':', updateError)
          throw new Error(updateError.message)
        }
      }
    }

    // Actualizar puntos totales de todos los perfiles
    const { error: profileError } = await supabase.rpc('update_all_profile_points')
    
    if (profileError) {
      console.error('Error actualizando puntos totales:', profileError)
    }

    // Redirigir para refrescar los datos
    redirect('/admin')
    
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
