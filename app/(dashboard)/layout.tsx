import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { TenantProvider } from "@/components/providers/tenant-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*, tenants(*)")
    .eq("id", user.id)
    .single()

  if (!userData?.tenant_id) {
    redirect("/onboarding")
  }

  return (
    <TenantProvider tenant={userData.tenants} user={userData}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </TenantProvider>
  )
}
