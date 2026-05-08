import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"

const onboardingSchema = z.object({
  companyName: z.string().min(1),
  slug: z.string().min(1),
  timezone: z.string().default("America/New_York"),
  phoneMode: z.enum(["browser", "personal", "trial"]).default("browser"),
  agentName: z.string().min(1),
  agentPrompt: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate the request body
    const body = await request.json()
    const validatedData = onboardingSchema.parse(body)

    // Use admin client to bypass RLS for onboarding
    const adminClient = createAdminClient()

    // Check if slug is already taken
    const { data: existingTenant } = await adminClient
      .from("tenants")
      .select("id")
      .eq("slug", validatedData.slug)
      .single()

    if (existingTenant) {
      return NextResponse.json(
        { error: "This workspace URL is already taken" },
        { status: 400 }
      )
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await adminClient
      .from("tenants")
      .insert({
        name: validatedData.companyName,
        slug: validatedData.slug,
        phone_mode: validatedData.phoneMode,
        status: "active",
        plan: "free",
      })
      .select()
      .single()

    if (tenantError) {
      console.error("[v0] Tenant creation error:", tenantError)
      return NextResponse.json(
        { error: "Failed to create workspace" },
        { status: 500 }
      )
    }

    // Update user with tenant_id
    const { error: userError } = await adminClient
      .from("users")
      .update({
        tenant_id: tenant.id,
        is_onboarded: true,
        role: "owner",
      })
      .eq("id", user.id)

    if (userError) {
      console.error("[v0] User update error:", userError)
      // Rollback tenant creation
      await adminClient.from("tenants").delete().eq("id", tenant.id)
      return NextResponse.json(
        { error: "Failed to setup user" },
        { status: 500 }
      )
    }

    // Create first agent
    const { error: agentError } = await adminClient.from("agents").insert({
      tenant_id: tenant.id,
      name: validatedData.agentName,
      system_prompt: validatedData.agentPrompt,
      status: "active",
      timezone: validatedData.timezone,
    })

    if (agentError) {
      console.error("[v0] Agent creation error:", agentError)
      // Non-fatal, user can create agents later
    }

    // Create tenant branding
    const { error: brandingError } = await adminClient
      .from("tenant_branding")
      .insert({
        tenant_id: tenant.id,
        company_name: validatedData.companyName,
      })

    if (brandingError) {
      console.error("[v0] Branding creation error:", brandingError)
      // Non-fatal
    }

    // Create default pipeline stages
    const defaultStages = [
      { name: "New", position: 1, probability: 10, color: "#6366f1" },
      { name: "Contacted", position: 2, probability: 25, color: "#8b5cf6" },
      { name: "Qualified", position: 3, probability: 50, color: "#22c55e" },
      { name: "Proposal", position: 4, probability: 75, color: "#f59e0b" },
      { name: "Won", position: 5, probability: 100, color: "#10b981" },
      { name: "Lost", position: 6, probability: 0, color: "#ef4444" },
    ]

    await adminClient.from("pipeline_stages").insert(
      defaultStages.map((stage) => ({
        ...stage,
        tenant_id: tenant.id,
      }))
    )

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
    })
  } catch (error) {
    console.error("[v0] Onboarding error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
