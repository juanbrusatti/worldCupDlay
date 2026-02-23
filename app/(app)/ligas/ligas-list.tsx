'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, LogIn, Users, Copy, Share2, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createLeague, joinLeague } from './actions'
import type { League } from '@/lib/types'

interface LigasListProps {
  leagues: (League & { member_count: number })[]
  currentUserId: string
}

export function LigasList({ leagues, currentUserId }: LigasListProps) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [leagueName, setLeagueName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await createLeague(leagueName)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Liga creada')
      setCreateOpen(false)
      setLeagueName('')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await joinLeague(joinCode)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Te uniste a ${result.leagueName}`)
      setJoinOpen(false)
      setJoinCode('')
      router.refresh()
    }
    setLoading(false)
  }

  function handleShare(league: League) {
    const text = `Unite a mi liga "${league.name}" en Prode Mundial 2026!\nCodigo: ${league.code}\n${window.location.origin}/ligas`
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

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Crear Liga</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Liga</DialogTitle>
              <DialogDescription>
                Crea una liga privada y compartil el codigo con tus amigos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="leagueName">Nombre de la Liga</Label>
                <Input
                  id="leagueName"
                  placeholder="Ej: Los Pibes del Barrio"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  required
                  maxLength={40}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Crear
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3">
              <LogIn className="h-5 w-5" />
              <span className="text-xs">Unirme</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unirse a una Liga</DialogTitle>
              <DialogDescription>
                Ingresa el codigo que te compartieron
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="joinCode">Codigo de la Liga</Label>
                <Input
                  id="joinCode"
                  placeholder="Ej: ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  required
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest uppercase"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Unirme
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {leagues.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No estas en ninguna liga</p>
          <p className="text-xs text-muted-foreground">Crea una o pedile el codigo a un amigo</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {leagues.map((league) => (
            <Card key={league.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex flex-1 flex-col gap-0.5">
                  <Link
                    href={`/ligas/${league.id}`}
                    className="text-sm font-semibold text-foreground hover:underline"
                  >
                    {league.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {league.member_count} miembros
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(league.code)
                        toast.success('Codigo copiado')
                      }}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Copy className="h-3 w-3" />
                      {league.code}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShare(league)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label="Compartir liga"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/ligas/${league.id}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label="Ver liga"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
