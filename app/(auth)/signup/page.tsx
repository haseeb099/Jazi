import { SignupForm } from "@/components/auth/signup-form"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up - Jazi",
  description: "Create your Jazi AI voice agent platform account",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with your AI voice agent platform
          </p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
