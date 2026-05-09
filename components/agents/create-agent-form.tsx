'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Bot, 
  Volume2, 
  Settings2, 
  Sparkles,
  Play,
  Loader2,
  Check
} from 'lucide-react'

interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  features: string[]
  prompt: string
}

interface CreateAgentFormProps {
  template?: AgentTemplate
  onSuccess: () => void
  onBack?: () => void
}

const VOICE_OPTIONS = [
  { id: 'rachel', name: 'Rachel', gender: 'Female', accent: 'American', preview: true },
  { id: 'drew', name: 'Drew', gender: 'Male', accent: 'American', preview: true },
  { id: 'clyde', name: 'Clyde', gender: 'Male', accent: 'American', preview: true },
  { id: 'paul', name: 'Paul', gender: 'Male', accent: 'American', preview: true },
  { id: 'domi', name: 'Domi', gender: 'Female', accent: 'American', preview: true },
  { id: 'dave', name: 'Dave', gender: 'Male', accent: 'British', preview: true },
  { id: 'fin', name: 'Fin', gender: 'Male', accent: 'Irish', preview: true },
  { id: 'sarah', name: 'Sarah', gender: 'Female', accent: 'American', preview: true },
]

export function CreateAgentForm({ template, onSuccess, onBack }: CreateAgentFormProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basics')
  const [selectedVoice, setSelectedVoice] = useState('rachel')
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    system_prompt: template?.prompt || 'You are a helpful AI voice agent.',
    voice_provider: 'elevenlabs',
    voice_id: 'rachel',
    voice_speed: 1.0,
    language: 'en',
    status: 'draft'
  })

  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        system_prompt: template.prompt,
      }))
    }
  }, [template])

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter an agent name')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase
        .from('agents')
        .insert([{
          ...formData,
          voice_id: selectedVoice,
        }])

      if (error) throw error

      toast.success('Agent created successfully!')
      onSuccess()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create agent'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {onBack && (
        <Button type="button" variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back to templates
        </Button>
      )}

      {template && (
        <Card className={`bg-gradient-to-br ${template.color} text-white border-0`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <template.icon className="size-8" />
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm opacity-90">{template.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="basics" className="gap-2">
            <Bot className="size-4" />
            Basics
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Volume2 className="size-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="behavior" className="gap-2">
            <Settings2 className="size-4" />
            Behavior
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Sales Qualification Agent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this agent does..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (Testing)</SelectItem>
                  <SelectItem value="active">Active (Live)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Voice Provider</Label>
            <Select 
              value={formData.voice_provider} 
              onValueChange={(value) => setFormData({ ...formData, voice_provider: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    ElevenLabs (Recommended)
                  </div>
                </SelectItem>
                <SelectItem value="google">Google Cloud TTS</SelectItem>
                <SelectItem value="azure">Azure Speech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Select Voice</Label>
            <div className="grid grid-cols-2 gap-3">
              {VOICE_OPTIONS.map((voice) => (
                <Card 
                  key={voice.id}
                  className={`cursor-pointer transition-all ${
                    selectedVoice === voice.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'bg-card/50 hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedVoice(voice.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center ${
                          selectedVoice === voice.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {selectedVoice === voice.id ? (
                            <Check className="size-5" />
                          ) : (
                            <Volume2 className="size-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{voice.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {voice.gender} • {voice.accent}
                          </p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="size-8">
                        <Play className="size-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Voice Speed</Label>
              <Badge variant="secondary">{formData.voice_speed.toFixed(1)}x</Badge>
            </div>
            <Slider
              value={[formData.voice_speed]}
              onValueChange={(value) => setFormData({ ...formData, voice_speed: value[0] })}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower (0.5x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (2.0x)</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="system_prompt">System Prompt *</Label>
              <Badge variant="secondary" className="text-xs">
                {formData.system_prompt.length} chars
              </Badge>
            </div>
            <Textarea
              id="system_prompt"
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              placeholder="Define the agent's behavior, personality, and instructions..."
              rows={12}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              This prompt defines how your agent behaves. Be specific about tone, style, and capabilities.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4 border-t border-border/50">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 gradient-primary text-white border-0"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 size-4" />
              Create Agent
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
