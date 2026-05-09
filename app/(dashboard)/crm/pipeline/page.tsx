'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Building2,
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { Lead, PipelineStage } from '@/types/database'

export default function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [stagesRes, leadsRes] = await Promise.all([
        supabase.from('pipeline_stages').select('*').order('position'),
        supabase.from('leads').select('*').order('created_at', { ascending: false })
      ])

      if (stagesRes.data) setStages(stagesRes.data)
      if (leadsRes.data) setLeads(leadsRes.data)
    } catch (error) {
      console.error('Error fetching pipeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  const moveLeadToStage = async (leadId: string, stageId: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ pipeline_stage_id: stageId, updated_at: new Date().toISOString() })
      .eq('id', leadId)

    if (error) {
      toast.error('Failed to move lead')
    } else {
      toast.success('Lead moved successfully')
      fetchData()
    }
  }

  const getLeadsForStage = (stageId: string) => {
    return leads.filter(lead => lead.pipeline_stage_id === stageId)
  }

  const getTotalValue = (stageLeads: Lead[]) => {
    return stageLeads.length * 2500 // Placeholder value calculation
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-[600px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Drag and drop leads through your sales stages
          </p>
        </div>
        <Button className="gradient-primary text-white border-0">
          <Plus className="mr-2 size-4" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <DollarSign className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">${(leads.length * 2500).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Sparkles className="size-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <ArrowRight className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Won This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Building2 className="size-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Deal Size</p>
                <p className="text-2xl font-bold">$2,500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = getLeadsForStage(stage.id)
          const totalValue = getTotalValue(stageLeads)
          
          return (
            <div 
              key={stage.id} 
              className="flex-shrink-0 w-72"
            >
              <Card className="bg-card/30 border-border/30 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stage.color || '#6366f1' }}
                      />
                      <CardTitle className="text-sm font-medium">
                        {stage.name}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-1">
                        {stageLeads.length}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Rename Stage</DropdownMenuItem>
                        <DropdownMenuItem>Set Color</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Stage
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${totalValue.toLocaleString()} • {stage.probability}% prob.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 min-h-[400px]">
                  {stageLeads.map((lead) => (
                    <Card 
                      key={lead.id}
                      className="bg-card border-border/50 cursor-grab active:cursor-grabbing card-hover"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {lead.first_name?.[0]}{lead.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {lead.first_name} {lead.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lead.company || 'No company'}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="size-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Call Lead</DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Lead Score */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                              style={{ width: `${lead.lead_score || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{lead.lead_score || 0}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          {lead.phone && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Phone className="size-3" />
                            </Button>
                          )}
                          {lead.email && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Mail className="size-3" />
                            </Button>
                          )}
                          <span className="text-xs ml-auto">$2,500</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="p-3 rounded-full bg-muted/50 mb-3">
                        <Plus className="size-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No leads in this stage
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Add Lead
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
