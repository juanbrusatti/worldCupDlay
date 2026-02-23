import { cn } from '@/lib/utils'
import { Trophy, Medal } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface RankedProfile extends Profile {
  rank: number
}

interface RankingTableProps {
  profiles: RankedProfile[]
  currentUserId?: string
  showCity?: boolean
}

export function RankingTable({ profiles, currentUserId, showCity = true }: RankingTableProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-muted-foreground">Todavia no hay datos de ranking</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {profiles.map((profile) => {
        const isCurrentUser = profile.id === currentUserId
        return (
          <div
            key={profile.id}
            className={cn(
              'flex items-center gap-3 rounded-lg p-3 transition-colors',
              isCurrentUser ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-card'
            )}
          >
            <div className="flex w-8 items-center justify-center">
              {profile.rank === 1 ? (
                <Trophy className="h-5 w-5 text-gold" />
              ) : profile.rank === 2 ? (
                <Medal className="h-5 w-5 text-muted-foreground" />
              ) : profile.rank === 3 ? (
                <Medal className="h-5 w-5 text-chart-4" />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">{profile.rank}</span>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <span className={cn(
                'text-sm font-semibold leading-tight',
                isCurrentUser ? 'text-primary' : 'text-foreground'
              )}>
                {profile.display_name}
                {isCurrentUser && <span className="ml-1 text-xs font-normal text-primary">(vos)</span>}
              </span>
              {showCity && (
                <span className="text-xs text-muted-foreground">{profile.city}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-foreground">{profile.points_total}</span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
