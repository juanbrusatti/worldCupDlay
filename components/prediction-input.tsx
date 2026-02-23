'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { submitPrediction } from '@/app/(app)/partidos/actions'
import type { Prediction } from '@/lib/types'

interface PredictionInputProps {
  matchId: number
  existingPrediction?: Prediction | null
  onSaved?: () => void
}

export function PredictionInput({ matchId, existingPrediction, onSaved }: PredictionInputProps) {
  const [homeScore, setHomeScore] = useState(
    existingPrediction ? String(existingPrediction.predicted_home) : ''
  )
  const [awayScore, setAwayScore] = useState(
    existingPrediction ? String(existingPrediction.predicted_away) : ''
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (homeScore === '' || awayScore === '') {
      toast.error('Completa ambos resultados')
      return
    }

    const h = parseInt(homeScore)
    const a = parseInt(awayScore)

    if (isNaN(h) || isNaN(a) || h < 0 || a < 0 || h > 20 || a > 20) {
      toast.error('Ingresa resultados validos (0-20)')
      return
    }

    setLoading(true)

    const result = await submitPrediction(matchId, h, a)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(existingPrediction ? 'Pronostico actualizado' : 'Pronostico guardado')
      onSaved?.()
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="flex items-end gap-2 rounded-lg bg-secondary p-3"
    >
      <div className="flex flex-1 items-center gap-2">
        <Input
          type="number"
          min={0}
          max={20}
          placeholder="0"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          className="h-10 w-14 text-center text-lg font-bold"
          aria-label="Goles equipo local"
        />
        <span className="text-sm font-medium text-muted-foreground">-</span>
        <Input
          type="number"
          min={0}
          max={20}
          placeholder="0"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          className="h-10 w-14 text-center text-lg font-bold"
          aria-label="Goles equipo visitante"
        />
      </div>
      <Button type="submit" size="sm" disabled={loading} className="h-10">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="mr-1 h-4 w-4" />
            Guardar
          </>
        )}
      </Button>
    </form>
  )
}
