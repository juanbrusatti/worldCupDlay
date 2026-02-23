import { Star, Target, Flame, Crown, Trophy, Medal, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  target: Target,
  flame: Flame,
  crown: Crown,
  trophy: Trophy,
  medal: Medal,
}

interface AchievementBadgeProps {
  achievementKey: string
  unlocked: boolean
}

export function AchievementBadge({ achievementKey, unlocked }: AchievementBadgeProps) {
  const def = ACHIEVEMENT_DEFINITIONS[achievementKey]
  if (!def) return null

  const Icon = ICON_MAP[def.icon] || Star

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-colors',
        unlocked ? 'bg-gold/10' : 'bg-secondary opacity-50'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          unlocked ? 'bg-gold text-gold-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        {unlocked ? (
          <Icon className="h-5 w-5" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
      </div>
      <span className={cn(
        'text-xs font-semibold leading-tight',
        unlocked ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {def.name}
      </span>
      <span className="text-[10px] leading-tight text-muted-foreground">
        {def.description}
      </span>
    </div>
  )
}
