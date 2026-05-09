'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Bot, 
  Phone, 
  Sparkles,
  Volume2,
  Clock,
  MoreHorizontal,
  Play,
  Settings,
  Copy,
  Trash2,
  Zap,
  MessageSquare,
  Calendar,
  Users,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateAgentForm } from '@/components/agents/create-agent-form'
import { toast } from 'sonner'
import type { Agent } from '@/types/database'

const AGENT_TEMPLATES = [
  {
    id: 'receptionist',
    name: 'AI Receptionist',
    description: 'Professional front-desk agent for handling calls and scheduling',
    icon: Phone,
    color: 'from-blue-500 to-cyan-500',
    features: ['Appointment scheduling', 'Call routing', 'FAQ handling'],
    prompt: `You are a professional AI receptionist. Your role is to:
- Greet callers warmly and professionally
- Understand their needs and route calls appropriately
- Schedule appointments when requested
- Answer frequently asked questions
- Take messages when appropriate
- Maintain a helpful, friendly tone throughout

Always confirm details and spell back names and numbers.`
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    description: 'Convert leads into customers with persuasive conversations',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    features: ['Lead qualification', 'Product demos', 'Objection handling'],
    prompt: `You are an expert sales agent. Your goals are:
- Qualify leads using BANT (Budget, Authority, Need, Timeline)
- Present products/services compellingly
- Handle objections professionally
- Guide prospects toward purchase decisions
- Schedule follow-up calls or demos
- Never be pushy - focus on understanding needs

Build rapport and ask probing questions to understand pain points.`
  },
  {
    id: 'support',
    name: 'Support Agent',
    description: 'Resolve customer issues with empathy and expertise',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    features: ['Issue resolution', 'Ticket creation', 'Escalation handling'],
    prompt: `You are a helpful customer support agent. Your priorities are:
- Listen empathetically to customer concerns
- Troubleshoot issues methodically
- Provide clear, step-by-step solutions
- Create support tickets when needed
- Escalate complex issues appropriately
- Follow up on unresolved matters

Always acknowledge frustration and apologize for inconveniences.`
  },
  {
    id: 'scheduler',
    name: 'Appointment Setter',
    description: 'Book meetings and manage your calendar efficiently',
    icon: Calendar,
    color: 'from-orange-500 to-amber-500',
    features: ['Calendar integration', 'Rescheduling', 'Reminders'],
    prompt: `You are an efficient appointment scheduling assistant. Your tasks are:
- Check calendar availability
- Schedule meetings at convenient times
- Send confirmation details
- Handle rescheduling requests
- Send reminders before appointments
- Manage cancellations gracefully

Always confirm timezone and provide meeting details clearly.`
  },
]

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeAgents = agents.filter(a => a.status === 'active').length
  const draftAgents = agents.filter(a => a.status === 'draft').length

  const handleDuplicate = async (agent: Agent) => {
    const { error } = await supabase.from('agents').insert({
      tenant_id: agent.tenant_id,
      name: `${agent.name} (Copy)`,
      description: agent.description,
      system_prompt: agent.system_prompt,
      voice_provider: agent.voice_provider,
      voice_id: agent.voice_id,
      status: 'draft',
    })
    
    if (error) {
      toast.error('Failed to duplicate agent')
    } else {
      toast.success('Agent duplicated')
      fetchAgents()
    }
  }

  const handleDelete = async (agentId: string) => {
    const { error } = await supabase.from('agents').delete().eq('id', agentId)
    
    if (error) {
      toast.error('Failed to delete agent')
    } else {
      toast.success('Agent deleted')
      fetchAgents()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">
            Create and manage intelligent voice agents for your business
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white border-0">
              <Plus className="mr-2 size-4" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Choose a template or start from scratch
              </DialogDescription>
            </DialogHeader>
            
            {!selectedTemplate ? (
              <div className="grid grid-cols-2 gap-4 pt-4">
                {AGENT_TEMPLATES.map((template) => (
                  <Card 
                    key={template.id}
                    className="bg-card/50 border-border/50 cursor-pointer card-hover"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="pt-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${template.color} text-white w-fit mb-4`}>
                        <template.icon className="size-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card 
                  className="bg-card/50 border-border/50 border-dashed cursor-pointer card-hover"
                  onClick={() => setSelectedTemplate('custom')}
                >
                  <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                    <div className="p-3 rounded-xl bg-muted mb-4">
                      <Sparkles className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">Custom Agent</h3>
                    <p className="text-sm text-muted-foreground">
                      Build from scratch with full control
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <CreateAgentForm 
                template={AGENT_TEMPLATES.find(t => t.id === selectedTemplate)}
                onSuccess={() => { 
                  setShowCreateDialog(false)
                  setSelectedTemplate(null)
                  fetchAgents() 
                }}
                onBack={() => setSelectedTemplate(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Bot className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Zap className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="size-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{draftAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Phone className="size-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calls Today</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredAgents.length === 0 ? (
        <Card className="bg-card/30 border-border/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Bot className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No agents yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Create your first AI agent to start handling calls automatically
            </p>
            <Button 
              className="gradient-primary text-white border-0"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="mr-2 size-4" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card 
              key={agent.id}
              className="bg-card/50 border-border/50 card-hover overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12 rounded-xl">
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
                        {agent.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {agent.language || 'English'} • {agent.voice_provider}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="mr-2 size-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(agent)}>
                        <Copy className="mr-2 size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(agent.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary"
                    className={
                      agent.status === 'active'
                        ? 'bg-success/10 text-success border-success/20'
                        : agent.status === 'draft'
                        ? 'bg-warning/10 text-warning border-warning/20'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {agent.status === 'active' && <span className="size-1.5 rounded-full bg-success mr-1.5 animate-pulse" />}
                    {agent.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {agent.description || agent.system_prompt?.slice(0, 100) + '...'}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-lg font-semibold">156</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Calls</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">4.2m</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Avg. Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">92%</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Satisfaction</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="mr-1.5 size-3" />
                    Test
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 gradient-primary text-white border-0"
                  >
                    Configure
                    <ChevronRight className="ml-1.5 size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
