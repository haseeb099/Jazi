'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Search,
  ExternalLink,
  Check,
  Zap,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  CreditCard,
  Database,
  Bot,
  Mic,
  Volume2,
  Webhook,
  Settings2,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'voice' | 'crm' | 'communication' | 'payment' | 'ai' | 'automation'
  status: 'connected' | 'available' | 'coming_soon'
  features: string[]
  color: string
}

const integrations: Integration[] = [
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Phone calls, SMS, and voice capabilities for your AI agents',
    icon: <Phone className="size-6" />,
    category: 'voice',
    status: 'available',
    features: ['Inbound/outbound calls', 'SMS messaging', 'Phone number provisioning'],
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Ultra-realistic AI voices for natural conversations',
    icon: <Volume2 className="size-6" />,
    category: 'voice',
    status: 'available',
    features: ['30+ voice options', 'Voice cloning', 'Multilingual support'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    description: 'Best-in-class speech recognition for real-time transcription',
    icon: <Mic className="size-6" />,
    category: 'voice',
    status: 'available',
    features: ['Real-time transcription', '100+ languages', 'Speaker diarization'],
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Lightning-fast LLM inference for instant AI responses',
    icon: <Zap className="size-6" />,
    category: 'ai',
    status: 'available',
    features: ['Llama 3.1 70B', 'Sub-100ms latency', 'Unlimited tokens'],
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and advanced AI models for complex reasoning',
    icon: <Bot className="size-6" />,
    category: 'ai',
    status: 'available',
    features: ['GPT-4 Turbo', 'Function calling', 'Vision capabilities'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync leads and contacts with your Salesforce CRM',
    icon: <Database className="size-6" />,
    category: 'crm',
    status: 'available',
    features: ['Lead sync', 'Contact management', 'Opportunity tracking'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Connect your HubSpot CRM for seamless lead management',
    icon: <Database className="size-6" />,
    category: 'crm',
    status: 'available',
    features: ['Contact sync', 'Deal pipeline', 'Email tracking'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get real-time notifications and updates in Slack',
    icon: <MessageSquare className="size-6" />,
    category: 'communication',
    status: 'available',
    features: ['Call notifications', 'Lead alerts', 'Team updates'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Let your AI agent schedule appointments automatically',
    icon: <Calendar className="size-6" />,
    category: 'automation',
    status: 'available',
    features: ['Auto-scheduling', 'Availability checks', 'Meeting links'],
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments and manage subscriptions',
    icon: <CreditCard className="size-6" />,
    category: 'payment',
    status: 'available',
    features: ['Payment processing', 'Subscription billing', 'Usage metering'],
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps with automated workflows',
    icon: <Webhook className="size-6" />,
    category: 'automation',
    status: 'available',
    features: ['5000+ apps', 'Custom triggers', 'Multi-step zaps'],
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: 'resend',
    name: 'Resend',
    description: 'Send beautiful transactional emails to your leads',
    icon: <Mail className="size-6" />,
    category: 'communication',
    status: 'connected',
    features: ['Email delivery', 'Templates', 'Analytics'],
    color: 'from-slate-500 to-zinc-500'
  },
]

export default function IntegrationsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [configuring, setConfiguring] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'voice', label: 'Voice & Speech' },
    { id: 'ai', label: 'AI Models' },
    { id: 'crm', label: 'CRM' },
    { id: 'communication', label: 'Communication' },
    { id: 'payment', label: 'Payments' },
    { id: 'automation', label: 'Automation' },
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(search.toLowerCase()) ||
                         integration.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || integration.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const connectedCount = integrations.filter(i => i.status === 'connected').length

  const handleConnect = (integrationId: string) => {
    setConfiguring(integrationId)
    setTimeout(() => {
      toast.success('Integration connected successfully!')
      setConfiguring(null)
    }, 2000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your favorite tools to supercharge your AI agents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <Check className="mr-1 size-3" />
            {connectedCount} Connected
          </Badge>
        </div>
      </div>

      {/* Stats Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Sparkles className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Power up your AI agents</h3>
                <p className="text-sm text-muted-foreground">
                  Connect integrations to enable appointment booking, CRM sync, and more
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
              View Documentation
              <ExternalLink className="ml-2 size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search & Categories */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search integrations..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="bg-card/50">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <Card 
            key={integration.id}
            className="bg-card/50 border-border/50 card-hover overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${integration.color} text-white`}>
                  {integration.icon}
                </div>
                {integration.status === 'connected' ? (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <Check className="mr-1 size-3" />
                    Connected
                  </Badge>
                ) : integration.status === 'coming_soon' ? (
                  <Badge variant="secondary">Coming Soon</Badge>
                ) : null}
              </div>
              <CardTitle className="text-lg mt-4">{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {integration.features.map((feature, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="text-xs bg-muted/50"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                {integration.status === 'connected' ? (
                  <>
                    <Button variant="outline" className="flex-1">
                      <Settings2 className="mr-2 size-4" />
                      Configure
                    </Button>
                    <Button variant="ghost" className="text-destructive">
                      Disconnect
                    </Button>
                  </>
                ) : integration.status === 'coming_soon' ? (
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-primary text-white border-0">
                        Connect
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect {integration.name}</DialogTitle>
                        <DialogDescription>
                          Enter your API credentials to connect {integration.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">API Key</label>
                          <Input type="password" placeholder="Enter your API key..." />
                        </div>
                        {integration.id === 'twilio' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Account SID</label>
                              <Input placeholder="Your Twilio Account SID" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Auth Token</label>
                              <Input type="password" placeholder="Your Twilio Auth Token" />
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium">Enable for all agents</p>
                            <p className="text-xs text-muted-foreground">
                              Automatically use this integration for new agents
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <Button 
                          className="w-full gradient-primary text-white border-0"
                          onClick={() => handleConnect(integration.id)}
                          disabled={configuring === integration.id}
                        >
                          {configuring === integration.id ? (
                            'Connecting...'
                          ) : (
                            <>
                              Connect {integration.name}
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Webhook Section */}
      <Card className="bg-card/30 border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="size-5 text-primary" />
            Custom Webhooks
          </CardTitle>
          <CardDescription>
            Send call events and data to your own endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="https://your-server.com/webhook" className="flex-1" />
            <Button className="gradient-primary text-white border-0">
              Add Webhook
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Webhooks will receive POST requests for: call.started, call.ended, lead.created, lead.updated
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
