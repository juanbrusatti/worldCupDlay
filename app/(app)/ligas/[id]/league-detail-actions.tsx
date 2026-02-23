'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Share2, LogOut, Trash2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { leaveLeague, deleteLeague } from '../actions'

interface LeagueDetailActionsProps {
  leagueId: number
  leagueName: string
  leagueCode: string
  isOwner: boolean
}

export function LeagueDetailActions({ leagueId, leagueName, leagueCode, isOwner }: LeagueDetailActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleShare() {
    const text = `Unite a mi liga "${leagueName}" en Prode Mundial 2026!\nCodigo: ${leagueCode}\n${window.location.origin}/ligas`
    if (navigator.share) {
      navigator.share({ title: 'Prode Mundial 2026', text }).catch(() => {
        navigator.clipboard.writeText(text)
        toast.success('Texto copiado al portapapeles')
      })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Texto copiado al portapapeles')
    }
  }

  async function handleLeave() {
    setLoading(true)
    const result = await leaveLeague(leagueId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Saliste de la liga')
      router.push('/ligas')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    const result = await deleteLeague(leagueId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Liga eliminada')
      router.push('/ligas')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
        <Share2 className="mr-1.5 h-4 w-4" />
        Compartir
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(leagueCode)
          toast.success('Codigo copiado')
        }}
      >
        <Copy className="mr-1.5 h-4 w-4" />
        {leagueCode}
      </Button>

      {isOwner ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar liga</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminara la liga y todos los miembros seran removidos. Esta accion no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={loading}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Salir de la liga</AlertDialogTitle>
              <AlertDialogDescription>
                Vas a dejar de participar en esta liga. Podes volver a unirte con el codigo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeave} disabled={loading}>
                Salir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
