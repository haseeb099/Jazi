'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Play,
  Pause,
  Volume2,
  Sparkles,
  MessageSquare,
  Clock,
  Zap,
  Save,
  Loader2,
  CheckCircle,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'
import type { Agent } from '@/types/database'
import { cn } from '@/lib/utils'

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Chat hook for testing the agent
  const { messages, sendMessage, status, input, setInput } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/ai/chat',
      body: { agentId }
    }),
  })

  useEffect(() => {
    fetchAgent()
  }, [agentId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchAgent = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single()

      if (error) throw error
      setAgent(data)
      setEditedPrompt(data.system_prompt || '')
    } catch (error) {
      console.error('Error fetching agent:', error)
      toast.error('Failed to load agent')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrompt = async () => {
    if (!agent) return
    setIsSaving(true)
    
    try {
      const { error } = await supabase
        .from('agents')
        .update({ system_prompt: editedPrompt, updated_at: new Date().toISOString() })
        .eq('id', agentId)

      if (error) throw error
      setAgent({ ...agent, system_prompt: editedPrompt })
      toast.success('Agent prompt saved successfully')
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast.error('Failed to save prompt')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendMessage = () => {
    if (!input.trim() || status === 'streaming') return
    sendMessage({ text: input })
    setInput('')
  }

  const handleStartCall = () => {
    setIsCallActive(true)
    toast.success('Browser call started', { description: 'Speak into your microphone' })
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    toast.info('Call ended')
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/agents')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Bot className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-muted-foreground">{agent.description || 'AI Voice Agent'}</p>
            </div>
          </div>
        </div>
        <Badge 
          variant="secondary"
          className={cn(
            agent.status === 'active' && 'bg-success/10 text-success border-success/20',
            agent.status === 'draft' && 'bg-warning/10 text-warning border-warning/20',
            agent.status === 'archived' && 'bg-muted text-muted-foreground'
          )}
        >
          {agent.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chat Testing Panel */}
        <Card className="bg-card/50 border-border/50 flex flex-col h-[700px]">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-5 text-primary" />
                  Test Conversation
                </CardTitle>
                <CardDescription>
                  Chat with your agent to test responses
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isCallActive ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEndCall}
                    className="gap-2"
                  >
                    <PhoneOff className="size-4" />
                    End Call
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartCall}
                    className="gap-2"
                  >
                    <Phone className="size-4" />
                    Start Call
                  </Button>
                )}
              </div>
            </div>
            
            {/* Call Status Bar */}
            {isCallActive && (
              <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">Call Active</span>
                  <span className="text-xs text-muted-foreground">00:42</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="size-4 text-destructive" /> : <Mic className="size-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Volume2 className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="size-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Type a message to test how your agent responds, or start a voice call to test the full experience.
                  </p>
                </div>
              )}
              
              {messages.map((message) => {
                const isUser = message.role === 'user'
                const text = message.parts
                  ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                  .map((p) => p.text)
                  .join('') || ''
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      isUser && 'flex-row-reverse'
                    )}
                  >
                    <Avatar className={cn(
                      'size-8',
                      isUser ? 'bg-primary' : 'bg-accent'
                    )}>
                      <AvatarFallback className="text-white">
                        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2.5',
                        isUser 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{text}</p>
                    </div>
                  </div>
                )
              })}
              
              {status === 'streaming' && (
                <div className="flex gap-3">
                  <Avatar className="size-8 bg-accent">
                    <AvatarFallback className="text-white">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <div className="flex gap-1">
                      <span className="size-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="size-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="size-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={status === 'streaming'}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || status === 'streaming'}
                className="gradient-primary text-white border-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Configuration Panel */}
        <Card className="bg-card/50 border-border/50 h-[700px] flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5 text-primary" />
              Agent Configuration
            </CardTitle>
            <CardDescription>
              Customize your agent{"'"}s behavior and responses
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 w-fit">
              <TabsTrigger value="prompt">System Prompt</TabsTrigger>
              <TabsTrigger value="voice">Voice Settings</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="flex-1 flex flex-col p-4 pt-2">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt" className="text-sm font-medium">
                    System Prompt
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {editedPrompt.length} characters
                  </span>
                </div>
                <Textarea
                  id="prompt"
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  placeholder="Enter the system prompt that defines your agent's behavior..."
                  className="flex-1 min-h-[400px] resize-none font-mono text-sm"
                />
                <Button
                  onClick={handleSavePrompt}
                  disabled={isSaving || editedPrompt === agent.system_prompt}
                  className="w-full gradient-primary text-white border-0"
                >
                  {isSaving ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Voice Provider</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Select the text-to-speech provider
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['ElevenLabs', 'OpenAI', 'Deepgram', 'PlayHT'].map((provider) => (
                      <Button
                        key={provider}
                        variant={agent.voice_provider === provider.toLowerCase() ? 'default' : 'outline'}
                        className={cn(
                          'justify-start',
                          agent.voice_provider === provider.toLowerCase() && 'gradient-primary text-white border-0'
                        )}
                      >
                        <Volume2 className="size-4 mr-2" />
                        {provider}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Voice Speed</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Adjust how fast the agent speaks
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs">Slow</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue={agent.voice_speed || 1}
                      className="flex-1"
                    />
                    <span className="text-xs">Fast</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <Label className="text-sm font-medium">Enable Voice Activity Detection</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically detect when caller stops speaking
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Enable tools your agent can use during conversations
              </p>
              
              {[
                { id: 'create_lead', name: 'Create Lead', desc: 'Add new leads to CRM', icon: User },
                { id: 'book_appointment', name: 'Book Appointment', desc: 'Schedule meetings', icon: Clock },
                { id: 'send_sms', name: 'Send SMS', desc: 'Send text messages', icon: MessageSquare },
                { id: 'lookup_customer', name: 'Lookup Customer', desc: 'Search CRM database', icon: Activity },
                { id: 'create_task', name: 'Create Task', desc: 'Add follow-up tasks', icon: CheckCircle },
              ].map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <tool.icon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={agent.tools_enabled?.includes(tool.id)} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="stats" className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-muted-foreground">Total Calls</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">4.2m</p>
                  <p className="text-xs text-muted-foreground">Avg Duration</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-muted-foreground">Resolution Rate</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
