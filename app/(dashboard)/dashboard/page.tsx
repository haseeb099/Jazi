import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { MetricCard } from "@/components/dashboard/metric-card"
import { CallVolumeChart } from "@/components/dashboard/call-volume-chart"
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table"
import { UsageProgress } from "@/components/dashboard/usage-progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, Clock, Users, TrendingUp } from "lucide-react"
import { Metadata } from "next"
import { formatDuration } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard - Jazi",
  description: "Your AI voice agent dashboard",
}

async function DashboardMetrics() {
  const supabase = await createClient()

  // Get current month period
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Fetch metrics in parallel
  const [callsResult, leadsResult, usageResult, prevCallsResult] =
    await Promise.all([
      supabase
        .from("calls")
        .select("id, duration_seconds, sentiment_label", { count: "exact" })
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("leads")
        .select("id, lead_score", { count: "exact" })
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("usage_metrics")
        .select("minutes_used")
        .eq("period_month", now.toISOString().slice(0, 7)),
      supabase
        .from("calls")
        .select("id", { count: "exact" })
        .gte("created_at", sixtyDaysAgo.toISOString())
        .lt("created_at", thirtyDaysAgo.toISOString()),
    ])

  const totalCalls = callsResult.count || 0
  const prevCalls = prevCallsResult.count || 0
  const callTrend =
    prevCalls > 0 ? ((totalCalls - prevCalls) / prevCalls) * 100 : 0

  const avgDuration =
    callsResult.data && callsResult.data.length > 0
      ? callsResult.data.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) /
        callsResult.data.length
      : 0

  const totalLeads = leadsResult.count || 0
  const hotLeads =
    leadsResult.data?.filter((l) => l.lead_score >= 67).length || 0
  const warmLeads =
    leadsResult.data?.filter((l) => l.lead_score >= 34 && l.lead_score < 67)
      .length || 0

  const minutesUsed =
    usageResult.data?.reduce((acc, u) => acc + Number(u.minutes_used), 0) || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Calls"
        value={totalCalls}
        icon={Phone}
        trend={callTrend}
        description="Last 30 days"
      />
      <MetricCard
        title="Avg. Duration"
        value={formatDuration(Math.round(avgDuration))}
        icon={Clock}
        description="Per call"
      />
      <MetricCard
        title="Leads Captured"
        value={totalLeads}
        icon={Users}
        description={`${hotLeads} hot, ${warmLeads} warm`}
      />
      <MetricCard
        title="Minutes Used"
        value={Math.round(minutesUsed)}
        icon={TrendingUp}
        description="This month"
      />
    </div>
  )
}

async function DashboardCharts() {
  const supabase = await createClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const { data: calls } = await supabase
    .from("calls")
    .select("created_at, sentiment_label")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  // Aggregate by day
  const dailyData: Record<
    string,
    { date: string; calls: number; positive: number; neutral: number; negative: number }
  > = {}

  calls?.forEach((call) => {
    const date = call.created_at.split("T")[0]
    if (!dailyData[date]) {
      dailyData[date] = { date, calls: 0, positive: 0, neutral: 0, negative: 0 }
    }
    dailyData[date].calls++
    if (call.sentiment_label === "positive") dailyData[date].positive++
    else if (call.sentiment_label === "negative") dailyData[date].negative++
    else dailyData[date].neutral++
  })

  const chartData = Object.values(dailyData)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CallVolumeChart data={chartData} />
      <UsageProgress />
    </div>
  )
}

async function RecentCalls() {
  const supabase = await createClient()

  const { data: calls } = await supabase
    .from("calls")
    .select("*, leads(first_name, last_name), agents(name)")
    .order("created_at", { ascending: false })
    .limit(10)

  return <RecentCallsTable calls={calls || []} />
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your AI voice agent performance
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        }
      >
        <DashboardMetrics />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        }
      >
        <DashboardCharts />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <RecentCalls />
      </Suspense>
    </div>
  )
}
