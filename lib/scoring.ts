export function calculateMatchPoints(
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

export function calculateStreak(predictions: Array<{ points_earned: number }>): number {
  let streak = 0
  for (const pred of predictions) {
    if (pred.points_earned > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function calculateAccuracy(predictions: Array<{ points_earned: number }>): number {
  if (predictions.length === 0) return 0
  const correct = predictions.filter(p => p.points_earned > 0).length
  return Math.round((correct / predictions.length) * 100)
}
