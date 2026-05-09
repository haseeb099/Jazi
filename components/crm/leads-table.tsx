'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const statusColors: Record<string, string> = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-purple-100 text-purple-800',
  'qualified': 'bg-orange-100 text-orange-800',
  'proposal': 'bg-yellow-100 text-yellow-800',
  'negotiation': 'bg-pink-100 text-pink-800',
  'won': 'bg-green-100 text-green-800',
  'lost': 'bg-red-100 text-red-800',
}

export function LeadsTable({ leads, loading, onRefresh }: any) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No leads found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Lead Score</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead: any) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                {lead.first_name} {lead.last_name}
              </TableCell>
              <TableCell>{lead.email || '-'}</TableCell>
              <TableCell>{lead.company || '-'}</TableCell>
              <TableCell>
                <Badge className={statusColors[lead.status] || 'bg-gray-100'}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>{lead.lead_score}/100</TableCell>
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
