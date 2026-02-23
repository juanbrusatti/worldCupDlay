'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

export async function submitPrediction(
  matchId: number,
  predictedHome: number,
  predictedAway: number,
  wildcard?: 'double' | 'insurance' | null
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No estas autenticado' }
  }

  // Check match is still upcoming
  const { data: match } = await supabase
    .from('matches')
    .select('id, status, match_date')
    .eq('id', matchId)
    .single()

  if (!match) {
    return { error: 'Partido no encontrado' }
  }

  if (match.status !== 'upcoming') {
    return { error: 'Este partido ya empezo, no podes cambiar tu pronostico' }
  }

  // Double-check: match_date should be in the future
  if (new Date(match.match_date) <= new Date()) {
    return { error: 'Este partido ya empezo' }
  }

  // Upsert prediction
  const { error } = await supabase
    .from('predictions')
    .upsert(
      {
        user_id: user.id,
        match_id: matchId,
        predicted_home: predictedHome,
        predicted_away: predictedAway,
        wildcard: wildcard || null,
      },
      { onConflict: 'user_id,match_id' }
    )

  if (error) {
    return { error: 'Error al guardar el pronostico: ' + error.message }
  }

  revalidateTag('predictions', 'max')

  return { success: true }
}
