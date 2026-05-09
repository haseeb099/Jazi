'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnalyticsChart } from '@/components/analytics/analytics-chart'
import { CallsChart } from '@/components/analytics/calls-chart'
import { SentimentChart } from '@/components/analytics/sentiment-chart'
import { TopAgents } from '@/components/analytics/top-agents'
import { BarChart, LineChart, PieChart } from 'lucide-react'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      const { data: callsData } = await supabase
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1000)

      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')

      const { data: metricsData } = await supabase
        .from('usage_metrics')
        .select('*')

      setData({
        calls: callsData || [],
        leads: leadsData || [],
        metrics: metricsData || []
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Monitor performance and insights</p>
      </div>

      {/* Period Tabs */}
      <Tabs value={period} onValueChange={setPeriod} defaultValue="7d">
        <TabsList>
          <TabsTrigger value="24h">Last 24 Hours</TabsTrigger>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 gap-6">
        {/* Call Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>Calls over time</CardDescription>
          </CardHeader>
          <CardContent>
            <CallsChart calls={data?.calls || []} />
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Call sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentChart calls={data?.calls || []} />
          </CardContent>
        </Card>
      </div>

      {/* Top Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
          <CardDescription>Agents by calls completed</CardDescription>
        </CardHeader>
        <CardContent>
          <TopAgents calls={data?.calls || []} />
        </CardContent>
      </Card>

      {/* Lead Status */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Distribution by Status</CardTitle>
            <CardDescription>Current pipeline status</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart leads={data?.leads || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
