'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function createLeague(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No estas autenticado' }
  if (!name.trim() || name.trim().length < 2) return { error: 'El nombre debe tener al menos 2 caracteres' }
  if (name.trim().length > 40) return { error: 'El nombre es demasiado largo' }

  // Generate unique code
  let code = generateCode()
  let attempts = 0
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('leagues')
      .select('id')
      .eq('code', code)
      .single()
    if (!existing) break
    code = generateCode()
    attempts++
  }

  // Create the league
  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .insert({ name: name.trim(), code, owner_id: user.id })
    .select()
    .single()

  if (leagueError) return { error: 'Error al crear la liga: ' + leagueError.message }

  // Add owner as member
  const { error: memberError } = await supabase
    .from('league_members')
    .insert({ league_id: league.id, user_id: user.id })

  if (memberError) return { error: 'Liga creada pero error al unirse: ' + memberError.message }

  revalidateTag('leagues', 'max')
  return { success: true, league }
}

export async function joinLeague(code: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No estas autenticado' }
  if (!code.trim()) return { error: 'Ingresa un codigo' }

  const normalizedCode = code.trim().toUpperCase()

  const { data: league } = await supabase
    .from('leagues')
    .select('id, name')
    .eq('code', normalizedCode)
    .single()

  if (!league) return { error: 'No se encontro ninguna liga con ese codigo' }

  // Check if already a member
  const { data: existing } = await supabase
    .from('league_members')
    .select('id')
    .eq('league_id', league.id)
    .eq('user_id', user.id)
    .single()

  if (existing) return { error: 'Ya sos miembro de esta liga' }

  const { error } = await supabase
    .from('league_members')
    .insert({ league_id: league.id, user_id: user.id })

  if (error) return { error: 'Error al unirse: ' + error.message }

  revalidateTag('leagues', 'max')
  return { success: true, leagueName: league.name }
}

export async function leaveLeague(leagueId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No estas autenticado' }

  const { error } = await supabase
    .from('league_members')
    .delete()
    .eq('league_id', leagueId)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al salir de la liga' }

  revalidateTag('leagues', 'max')
  return { success: true }
}

export async function deleteLeague(leagueId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No estas autenticado' }

  // Verify ownership
  const { data: league } = await supabase
    .from('leagues')
    .select('owner_id')
    .eq('id', leagueId)
    .single()

  if (!league || league.owner_id !== user.id) {
    return { error: 'Solo el creador puede eliminar la liga' }
  }

  const { error } = await supabase
    .from('leagues')
    .delete()
    .eq('id', leagueId)

  if (error) return { error: 'Error al eliminar la liga' }

  revalidateTag('leagues', 'max')
  return { success: true }
}
