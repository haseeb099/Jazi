'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PipelineView({ leads, loading }: any) {
  const stages = [
    { id: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { id: 'contacted', label: 'Contacted', color: 'bg-purple-100 text-purple-800' },
    { id: 'qualified', label: 'Qualified', color: 'bg-orange-100 text-orange-800' },
    { id: 'proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-pink-100 text-pink-800' },
    { id: 'won', label: 'Won', color: 'bg-green-100 text-green-800' },
    { id: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
  ]

  return (
    <div className="grid grid-cols-7 gap-4">
      {stages.map(stage => {
        const stagLeads = leads.filter((l: any) => l.status === stage.id)
        return (
          <Card key={stage.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{stage.label}</CardTitle>
              <p className="text-xs text-muted-foreground">{stagLeads.length} leads</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {stagLeads.map((lead: any) => (
                <div key={lead.id} className="p-3 border rounded-lg bg-card hover:bg-accent cursor-pointer transition">
                  <p className="text-sm font-medium truncate">{lead.first_name} {lead.last_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.company || 'No company'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Score: {lead.lead_score}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
