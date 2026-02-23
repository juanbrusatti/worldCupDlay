import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Users, TrendingUp } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/partidos')
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary">
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
              Prode Mundial 2026
            </h1>
            <p className="text-pretty text-lg text-muted-foreground">
              Pronostica los partidos, competi con amigos y demostra que sabes de futbol.
            </p>
          </div>

          <div className="mt-4 grid w-full max-w-xs gap-3">
            <Button asChild size="lg" className="w-full text-base">
              <Link href="/auth/sign-up">Registrarme</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full text-base">
              <Link href="/auth/login">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid w-full max-w-sm gap-4">
          <FeatureItem
            icon={<Target className="h-5 w-5 text-primary" />}
            title="Pronostica"
            description="Predeci el resultado de cada partido del Mundial"
          />
          <FeatureItem
            icon={<TrendingUp className="h-5 w-5 text-gold" />}
            title="Suma Puntos"
            description="3 puntos por resultado exacto, 1 por acertar el ganador"
          />
          <FeatureItem
            icon={<Users className="h-5 w-5 text-success" />}
            title="Competi"
            description="Crea ligas privadas y competil con tus amigos"
          />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        Prode Mundial 2026
      </footer>
    </div>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
