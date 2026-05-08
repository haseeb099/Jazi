'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const levelIcons: Record<number, any> = {
  1: AlertTriangle,
  2: AlertTriangle,
  3: AlertCircle,
  4: Info,
  5: Info,
  6: Info,
}

const levelColors: Record<number, string> = {
  1: 'bg-red-100 text-red-800',
  2: 'bg-orange-100 text-orange-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-blue-100 text-blue-800',
  5: 'bg-purple-100 text-purple-800',
  6: 'bg-gray-100 text-gray-800',
}

export function ApprovalsTable({ approvals, loading, onSelectApproval }: any) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (approvals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No approval requests</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Level</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.map((approval: any) => (
            <TableRow key={approval.id}>
              <TableCell>
                <Badge className={levelColors[approval.level]}>
                  {approval.level_label}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{approval.action_requested}</TableCell>
              <TableCell>
                <Badge variant={approval.status === 'pending' ? 'secondary' : 'default'}>
                  {approval.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(approval.requested_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(approval.expires_at).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {approval.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectApproval(approval)}
                  >
                    Review
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
