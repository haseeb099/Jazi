'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Download } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const statusColors: Record<string, string> = {
  'completed': 'bg-green-100 text-green-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'failed': 'bg-red-100 text-red-800',
  'queued': 'bg-gray-100 text-gray-800',
}

const sentimentColors: Record<string, string> = {
  'positive': 'bg-green-100 text-green-800',
  'neutral': 'bg-gray-100 text-gray-800',
  'negative': 'bg-red-100 text-red-800',
}

export function CallsTable({ calls, loading }: any) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (calls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No calls found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call: any) => (
            <TableRow key={call.id}>
              <TableCell className="font-mono text-sm">{call.from_number || '-'}</TableCell>
              <TableCell className="font-mono text-sm">{call.to_number || '-'}</TableCell>
              <TableCell>{Math.round(call.duration_seconds / 60)} min</TableCell>
              <TableCell>
                <Badge className={statusColors[call.status] || 'bg-gray-100'}>
                  {call.status}
                </Badge>
              </TableCell>
              <TableCell>
                {call.sentiment_label ? (
                  <Badge className={sentimentColors[call.sentiment_label] || 'bg-gray-100'}>
                    {call.sentiment_label}
                  </Badge>
                ) : '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {call.started_at ? new Date(call.started_at).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>
                {call.recording_url && (
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
