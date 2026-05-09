import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { MetricCard } from "@/components/dashboard/metric-card"
import { CallVolumeChart } from "@/components/dashboard/call-volume-chart"
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table"
import { UsageProgress } from "@/components/dashboard/usage-progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Clock, Users, TrendingUp, Bot, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Metadata } from "next"
import { formatDuration } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard - Jazi",
  description: "Your AI voice agent dashboard",
}

async function DashboardMetrics() {
  const supabase = await createClient()

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const [callsResult, leadsResult, usageResult, prevCallsResult, agentsResult] =
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
      supabase
        .from("agents")
        .select("id, status", { count: "exact" })
        .eq("status", "active"),
    ])

  const totalCalls = callsResult.count || 0
  const prevCalls = prevCallsResult.count || 0
  const callTrend = prevCalls > 0 ? ((totalCalls - prevCalls) / prevCalls) * 100 : 0

  const avgDuration =
    callsResult.data && callsResult.data.length > 0
      ? callsResult.data.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) /
        callsResult.data.length
      : 0

  const totalLeads = leadsResult.count || 0
  const hotLeads = leadsResult.data?.filter((l) => l.lead_score >= 67).length || 0
  const warmLeads = leadsResult.data?.filter((l) => l.lead_score >= 34 && l.lead_score < 67).length || 0

  const minutesUsed = usageResult.data?.reduce((acc, u) => acc + Number(u.minutes_used), 0) || 0
  const activeAgents = agentsResult.count || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Calls"
        value={totalCalls}
        icon={Phone}
        trend={callTrend}
        description="Last 30 days"
        gradient="primary"
      />
      <MetricCard
        title="Avg. Duration"
        value={formatDuration(Math.round(avgDuration))}
        icon={Clock}
        description="Per call"
        gradient="accent"
      />
      <MetricCard
        title="Leads Captured"
        value={totalLeads}
        icon={Users}
        description={`${hotLeads} hot, ${warmLeads} warm`}
        gradient="success"
      />
      <MetricCard
        title="Active Agents"
        value={activeAgents}
        icon={Bot}
        description="Handling calls 24/7"
        gradient="warning"
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

  const dailyData: Record<
    string,
    { date: string; calls: number; positive: number; neutral: number; negative: number }
  > = {}

  // Generate dates for last 30 days (even if no calls)
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split("T")[0]
    dailyData[dateStr] = { date: dateStr, calls: 0, positive: 0, neutral: 0, negative: 0 }
  }

  calls?.forEach((call) => {
    const date = call.created_at.split("T")[0]
    if (dailyData[date]) {
      dailyData[date].calls++
      if (call.sentiment_label === "positive") dailyData[date].positive++
      else if (call.sentiment_label === "negative") dailyData[date].negative++
      else dailyData[date].neutral++
    }
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

function QuickActions() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-card/50">
          <Bot className="size-5 text-primary" />
          <span className="text-xs">New Agent</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-card/50">
          <Phone className="size-5 text-accent" />
          <span className="text-xs">Test Call</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-card/50">
          <Users className="size-5 text-success" />
          <span className="text-xs">Add Lead</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-card/50">
          <Zap className="size-5 text-warning" />
          <span className="text-xs">Integrations</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your AI voice agent performance
          </p>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <span className="size-2 rounded-full bg-success mr-2 animate-pulse" />
          All Systems Operational
        </Badge>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Metrics */}
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

      {/* Charts */}
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

      {/* Recent Calls */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <RecentCalls />
      </Suspense>
    </div>
  )
}
