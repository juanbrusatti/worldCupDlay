'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Share2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileActionsProps {
  displayName: string
  points: number
  globalRank: number
}

export function ProfileActions({ displayName, points, globalRank }: ProfileActionsProps) {
  const router = useRouter()

  function handleShare() {
    const text = `Soy ${displayName} en Prode Mundial 2026!\nPosicion global: #${globalRank}\nPuntos: ${points}\n\nJugate vos tambien!`
    if (navigator.share) {
      navigator.share({ title: 'Prode Mundial 2026', text }).catch(() => {
        navigator.clipboard.writeText(text)
        toast.success('Texto copiado')
      })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Texto copiado')
    }
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={handleShare} className="w-full">
        <Share2 className="mr-2 h-4 w-4" />
        Compartir mi posicion
      </Button>
      <Button variant="ghost" onClick={handleLogout} className="w-full text-destructive hover:text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesion
      </Button>
    </div>
  )
}
