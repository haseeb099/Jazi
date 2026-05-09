import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's tenant
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!userData?.tenant_id) {
      return NextResponse.json({
        minutesUsed: 0,
        minutesTotal: 500,
        percentage: 0,
        callsThisMonth: 0,
        costThisMonth: 0
      })
    }

    // Get current month period
    const now = new Date()
    const periodMonth = now.toISOString().slice(0, 7)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get usage metrics
    const { data: usageData } = await supabase
      .from('usage_metrics')
      .select('minutes_used, cost_cents')
      .eq('tenant_id', userData.tenant_id)
      .eq('period_month', periodMonth)

    // Get tenant plan details
    const { data: tenantData } = await supabase
      .from('tenants')
      .select('plan_minutes_included')
      .eq('id', userData.tenant_id)
      .single()

    // Get calls this month
    const { count: callsCount } = await supabase
      .from('calls')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', userData.tenant_id)
      .gte('created_at', startOfMonth.toISOString())

    const minutesUsed = usageData?.reduce((acc, u) => acc + Number(u.minutes_used), 0) || 0
    const costCents = usageData?.reduce((acc, u) => acc + Number(u.cost_cents), 0) || 0
    const minutesTotal = tenantData?.plan_minutes_included || 500

    return NextResponse.json({
      minutesUsed: Math.round(minutesUsed),
      minutesTotal,
      percentage: Math.round((minutesUsed / minutesTotal) * 100),
      callsThisMonth: callsCount || 0,
      costThisMonth: (costCents / 100).toFixed(2)
    })
  } catch (error) {
    console.error('Error fetching billing usage:', error)
    return NextResponse.json({
      minutesUsed: 0,
      minutesTotal: 500,
      percentage: 0,
      callsThisMonth: 0,
      costThisMonth: 0
    })
  }
}
