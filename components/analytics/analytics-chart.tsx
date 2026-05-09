'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export function AnalyticsChart({ leads }: any) {
  const statusCount = leads.reduce((acc: any, lead: any) => {
    const status = lead.status || 'unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(statusCount).map(([name, value]: any) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#ec4899']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CallsChart({ calls }: any) {
  // Group calls by date
  const callsByDate = calls.reduce((acc: any, call: any) => {
    const date = call.started_at ? new Date(call.started_at).toLocaleDateString() : 'unknown'
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(callsByDate)
    .slice(-7)
    .map(([date, count]: any) => ({
      date,
      calls: count
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SentimentChart({ calls }: any) {
  const sentimentCount = calls.reduce((acc: any, call: any) => {
    const sentiment = call.sentiment_label || 'unknown'
    acc[sentiment] = (acc[sentiment] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(sentimentCount).map(([name, value]: any) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  const COLORS: Record<string, string> = {
    'Positive': '#10b981',
    'Neutral': '#9ca3af',
    'Negative': '#ef4444',
    'Unknown': '#d1d5db'
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
          {data.map((entry: any) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TopAgents({ calls }: any) {
  const agentStats = calls.reduce((acc: any, call: any) => {
    if (!call.agent_id) return acc
    if (!acc[call.agent_id]) {
      acc[call.agent_id] = { count: 0, duration: 0 }
    }
    acc[call.agent_id].count += 1
    acc[call.agent_id].duration += call.duration_seconds || 0
    return acc
  }, {})

  const data = Object.entries(agentStats)
    .map(([agentId, stats]: any) => ({
      agent: `Agent ${agentId.slice(0, 8)}`,
      calls: stats.count,
      duration: Math.round(stats.duration / 60)
    }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 5)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="agent" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="calls" fill="#3b82f6" name="Calls" />
        <Bar dataKey="duration" fill="#8b5cf6" name="Duration (min)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
