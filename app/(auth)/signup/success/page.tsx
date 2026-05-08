import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Check Your Email - Jazi",
  description: "Confirm your email to complete signup",
}

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-6 text-primary" />
          </div>
          <CardTitle>Check your email</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            We sent you an email with a confirmation link. Please click the link
            to verify your account and complete your registration.
          </p>
          <p className="text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or "}
            <Link href="/signup" className="text-primary hover:underline">
              try again
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
