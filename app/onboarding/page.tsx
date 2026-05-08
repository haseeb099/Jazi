import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setup Your Workspace - Jazi",
  description: "Complete your setup to get started with Jazi",
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is already onboarded
  const { data: userData } = await supabase
    .from("users")
    .select("is_onboarded, tenant_id")
    .eq("id", user.id)
    .single()

  if (userData?.is_onboarded && userData?.tenant_id) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <OnboardingWizard userEmail={user.email || ""} userId={user.id} />
      </div>
    </div>
  )
}
