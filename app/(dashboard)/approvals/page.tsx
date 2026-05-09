'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { ApprovalsTable } from '@/components/approvals/approvals-table'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApproval, setSelectedApproval] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchApprovals()
  }, [])

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .order('requested_at', { ascending: false })

      if (error) throw error
      setApprovals(data || [])
    } catch (error) {
      console.error('Error fetching approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (approvalId: string) => {
    try {
      const { error } = await supabase
        .from('approvals')
        .update({ status: 'approved' })
        .eq('id', approvalId)

      if (error) throw error
      fetchApprovals()
      setSelectedApproval(null)
    } catch (error) {
      console.error('Error approving:', error)
    }
  }

  const handleReject = async (approvalId: string) => {
    try {
      const { error } = await supabase
        .from('approvals')
        .update({ status: 'rejected' })
        .eq('id', approvalId)

      if (error) throw error
      fetchApprovals()
      setSelectedApproval(null)
    } catch (error) {
      console.error('Error rejecting:', error)
    }
  }

  const stats = {
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
  }

  const levelColors: Record<number, string> = {
    1: 'text-red-600',
    2: 'text-orange-600',
    3: 'text-yellow-600',
    4: 'text-blue-600',
    5: 'text-purple-600',
    6: 'text-gray-600',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Approvals & Controls</h1>
        <p className="text-muted-foreground mt-1">Human-in-the-loop oversight for critical actions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals Table */}
      <ApprovalsTable approvals={approvals} loading={loading} onSelectApproval={setSelectedApproval} />

      {/* Approval Detail Dialog */}
      {selectedApproval && (
        <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Approval Request</DialogTitle>
              <DialogDescription>
                Level {selectedApproval.level} ({selectedApproval.level_label})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Action Requested:</p>
                <p className="text-sm">{selectedApproval.action_requested}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Context:</p>
                <pre className="text-xs overflow-auto bg-white p-2 border rounded">
                  {JSON.stringify(selectedApproval.context, null, 2)}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(selectedApproval.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(selectedApproval.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
