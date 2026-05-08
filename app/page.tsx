'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, Phone, BarChart3, Lock, Users, Globe } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Jazi</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          White-Label AI Voice Agent Platform
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Build, deploy, and scale AI-powered voice agents for sales, support, and customer service. HITL controls, enterprise-grade security, and complete white-labeling.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="border-slate-400 text-white hover:bg-slate-700">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Phone className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle className="text-white">Voice Agent Builder</CardTitle>
              <CardDescription>Create intelligent voice agents without coding</CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Drag-and-drop wizard with pre-built templates and full customization
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Lock className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle className="text-white">Human-in-the-Loop</CardTitle>
              <CardDescription>Multi-level approval and takeover controls</CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              6-tier HITL system with real-time barge-in and complete takeover
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Globe className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle className="text-white">White-Label Solution</CardTitle>
              <CardDescription>Complete branding customization</CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Custom domains, logos, colors, and CSS for your brand
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle className="text-white">Advanced Analytics</CardTitle>
              <CardDescription>Real-time insights and reporting</CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Call analytics, sentiment analysis, and performance metrics
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Users className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle className="text-white">CRM Integration</CardTitle>
              <CardDescription>Manage leads and pipeline</CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Built-in CRM with lead scoring, pipeline management, and automation
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Zap className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle className="text-white">Multi-Provider</CardTitle>
              <CardDescription>Choose your AI and voice providers</CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Support for Groq, ElevenLabs, Google Cloud, Azure, and more
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p className="text-slate-300 mb-8">Launch your AI voice agent platform in minutes</p>
        <Link href="/signup">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
