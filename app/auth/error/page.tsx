import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication Error - Jazi",
  description: "An error occurred during authentication",
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            There was a problem signing you in. This could happen if the link
            has expired or has already been used.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/login">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Create New Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
