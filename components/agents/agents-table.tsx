'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Zap, Archive } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function AgentsTable({ agents, loading, onRefresh }: any) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No agents found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Voice Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent: any) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell className="text-muted-foreground">{agent.description || '-'}</TableCell>
              <TableCell>{agent.voice_provider || 'elevenlabs'}</TableCell>
              <TableCell>
                <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(agent.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
