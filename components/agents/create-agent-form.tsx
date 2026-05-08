'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export function CreateAgentForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: 'You are a helpful AI voice agent.',
    voice_provider: 'elevenlabs',
    voice_speed: 1.0,
    language: 'en',
    status: 'draft'
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      const { error } = await supabase
        .from('agents')
        .insert([formData])

      if (error) throw error

      toast.success('Agent created successfully')
      setFormData({
        name: '',
        description: '',
        system_prompt: 'You are a helpful AI voice agent.',
        voice_provider: 'elevenlabs',
        voice_speed: 1.0,
        language: 'en',
        status: 'draft'
      })
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create agent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="space-y-2">
        <Label htmlFor="system_prompt">System Prompt *</Label>
        <Textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
          placeholder="Define the agent's behavior and personality..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voice_provider">Voice Provider</Label>
          <Select value={formData.voice_provider} onValueChange={(value) => setFormData({ ...formData, voice_provider: value })}>
            <SelectTrigger id="voice_provider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
              <SelectItem value="google">Google Cloud</SelectItem>
              <SelectItem value="azure">Azure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Voice Speed: {formData.voice_speed.toFixed(1)}x</Label>
        <Slider
          value={[formData.voice_speed]}
          onValueChange={(value) => setFormData({ ...formData, voice_speed: value[0] })}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Agent'}
      </Button>
    </form>
  )
}
