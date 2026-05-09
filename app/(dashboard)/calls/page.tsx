'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Phone, Clock, TrendingUp } from 'lucide-react'
import { CallsTable } from '@/components/calls/calls-table'
import { CallStats } from '@/components/calls/call-stats'

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(100)

      const { data, error } = await query

      if (error) throw error
      setCalls(data || [])
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCalls = calls.filter(call => {
    const matchesSearch = !searchTerm ||
      call.from_number?.includes(searchTerm) ||
      call.to_number?.includes(searchTerm)
    const matchesFilter = filter === 'all' || call.status === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.status === 'completed').length,
    totalDuration: calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0),
    averageScore: Math.round(calls.filter(c => c.sentiment_score).reduce((acc, c) => acc + c.sentiment_score, 0) / Math.max(1, calls.filter(c => c.sentiment_score).length))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Calls</h1>
        <p className="text-muted-foreground mt-1">Monitor and analyze all voice interactions</p>
      </div>

      {/* Stats */}
      <CallStats stats={stats} />

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Calls Table */}
      <Tabs value={filter} onValueChange={setFilter} defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Calls ({calls.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({calls.filter(c => c.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({calls.filter(c => c.status === 'in-progress').length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({calls.filter(c => c.status === 'failed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          <CallsTable calls={filteredCalls} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
