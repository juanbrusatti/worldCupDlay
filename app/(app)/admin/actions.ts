'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
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

export async function deleteMatch(formData: FormData) {
  const supabase = await createClient()
  const serviceSupabase = createServiceClient()
  const matchId = Number(formData.get('matchId'))
  
  console.log('Attempting to delete match:', matchId)
  
  try {
    // First, check if match exists
    const { data: matchExists, error: checkError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()
    
    console.log('Match exists check:', matchExists, 'Error:', checkError)
    
    if (checkError || !matchExists) {
      console.error('Match not found or error:', checkError)
      throw new Error('Match not found')
    }
    
    // Check predictions for this match
    const { data: predictions, error: predCheckError } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)
    
    console.log('Predictions found:', predictions, 'Error:', predCheckError)
    
    // Eliminar predicciones asociadas usando service client
    const { error: predError, data: predData } = await serviceSupabase
      .from('predictions')
      .delete()
      .eq('match_id', matchId)
      .select()
    
    console.log('Predictions deleted:', predData, 'Error:', predError)
    
    if (predError) {
      console.error('Error deleting predictions:', predError)
      throw new Error(predError.message)
    }
    
    // Eliminar el partido usando service client
    const { error: matchError, data: matchData } = await serviceSupabase
      .from('matches')
      .delete()
      .eq('id', matchId)
      .select()
    
    console.log('Match deleted:', matchData, 'Error:', matchError)
    
    if (matchError) {
      console.error('Error deleting match:', matchError)
      throw new Error(matchError.message)
    }
    
    // Recalcular puntos totales para todos los usuarios
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
    
    if (profiles && profiles.length > 0) {
      for (const profile of profiles) {
        // Sumar todos los puntos de las predicciones del usuario
        const { data: userPredictions } = await supabase
          .from('predictions')
          .select('points_earned')
          .eq('user_id', profile.id)
        
        const totalPoints = userPredictions?.reduce((sum, pred) => sum + (pred.points_earned || 0), 0) || 0
        
        // Actualizar el total del perfil usando service client
        await serviceSupabase
          .from('profiles')
          .update({ total_points: totalPoints })
          .eq('id', profile.id)
      }
    }
    
    console.log('Successfully deleted match:', matchId)
    redirect('/admin')
  } catch (error) {
    console.error('Complete error in deleteMatch:', error)
    throw error
  }
}

export async function updateMatchResult(formData: FormData) {
  const supabase = await createClient()
  const serviceSupabase = createServiceClient()
  const matchId = Number(formData.get('matchId'))
  const scoreHome = Number(formData.get('scoreHome'))
  const scoreAway = Number(formData.get('scoreAway'))

  console.log('Updating match result:', { matchId, scoreHome, scoreAway })
  
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

    console.log('Found predictions:', predictions)

    // Calcular puntos para cada predicción
    const updates = predictions?.map(pred => {
      const points = calculateMatchPoints(
        pred.predicted_home,
        pred.predicted_away,
        scoreHome,
        scoreAway,
        pred.wildcard as 'double' | 'insurance' | null
      )

      console.log(`Prediction ${pred.id}: predicted ${pred.predicted_home}-${pred.predicted_away}, actual ${scoreHome}-${scoreAway}, points: ${points}`)

      return {
        id: pred.id,
        points_earned: points
      }
    }) || []

    console.log('Updates to apply:', updates)

    // Actualizar puntos de todas las predicciones usando service client
    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await serviceSupabase.rpc('simple_update_points', {
          p_prediction_id: update.id,
          p_points: update.points_earned
        })

        if (updateError) {
          console.error('Error updating prediction', update.id, ':', updateError)
          throw new Error(updateError.message)
        } else {
          console.log(`Successfully updated prediction ${update.id} with ${update.points_earned} points`)
        }
      }
    }

    // Redirigir para refrescar los datos
    redirect('/admin')
    
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
