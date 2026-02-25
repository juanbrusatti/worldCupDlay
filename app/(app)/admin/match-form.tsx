'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createMatch } from './actions'

interface Team {
  id: number
  name: string
  flag_emoji: string
}

interface MatchFormProps {
  teams: Team[]
}

export function MatchForm({ teams }: MatchFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Crear Nuevo Partido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createMatch} key="create-match-form" className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="team_home_id">Equipo Local</Label>
            <Select name="team_home_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar equipo local" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{team.flag_emoji}</span>
                      <span>{team.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_away_id">Equipo Visitante</Label>
            <Select name="team_away_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar equipo visitante" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{team.flag_emoji}</span>
                      <span>{team.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group_letter">Grupo</Label>
            <Select name="group_letter" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar grupo" />
              </SelectTrigger>
              <SelectContent>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => (
                  <SelectItem key={letter} value={letter}>
                    Grupo {letter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Fase</Label>
            <Select name="stage" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round_of_16">Octavos de Final</SelectItem>
                <SelectItem value="quarter">Cuartos de Final</SelectItem>
                <SelectItem value="semi">Semifinales</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="match_date">Fecha y Hora</Label>
            <Input
              type="datetime-local"
              name="match_date"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Estadio</Label>
            <Input
              type="text"
              name="venue"
              placeholder="Ej: Estadio Monumental"
              required
            />
          </div>

          <div className="col-span-2">
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Crear Partido
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
