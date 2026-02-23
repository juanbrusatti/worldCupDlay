import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <MailCheck className="h-7 w-7 text-success" />
          </div>
          <CardTitle className="text-xl">Revisa tu email</CardTitle>
          <CardDescription>
            Te enviamos un link de confirmacion. Hace click en el link para activar tu cuenta y empezar a jugar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Volver a Iniciar Sesion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
