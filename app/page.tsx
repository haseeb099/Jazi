'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Zap, 
  Phone, 
  BarChart3, 
  Lock, 
  Users, 
  Globe,
  Bot,
  Sparkles,
  Play,
  Check,
  ChevronRight,
  Star,
  MessageSquare,
  Calendar,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const features = [
  {
    icon: Bot,
    title: 'AI Voice Agents',
    description: 'Create intelligent voice agents that handle calls 24/7 with natural conversations',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Lock,
    title: 'Human-in-the-Loop',
    description: 'Multi-level approval system with real-time barge-in and complete takeover controls',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Globe,
    title: 'White-Label Ready',
    description: 'Complete branding customization with custom domains, logos, and styles',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights, sentiment analysis, and detailed performance metrics',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Built-in CRM',
    description: 'Lead scoring, pipeline management, and automated follow-ups',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Zap,
    title: 'Multi-Provider',
    description: 'Connect Groq, ElevenLabs, Twilio, and more voice/AI providers',
    color: 'from-violet-500 to-purple-500'
  }
]

const stats = [
  { value: '10M+', label: 'Calls Handled' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
  { value: '<100ms', label: 'Response Time' }
]

const testimonials = [
  {
    quote: "Jazi transformed our customer service. We handle 3x more calls with the same team.",
    author: "Sarah Chen",
    role: "VP of Operations, TechCorp"
  },
  {
    quote: "The white-label feature let us launch our own AI calling product in just 2 weeks.",
    author: "Michael Rodriguez",
    role: "CEO, CallFlow Agency"
  },
  {
    quote: "Best voice AI platform we've used. The HITL controls give us complete confidence.",
    author: "Emily Thompson",
    role: "Director of Sales, GrowthCo"
  }
]

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold">Jazi</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="gradient-primary text-white border-0">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Sparkles className="size-3 mr-1.5" />
              Trusted by 500+ businesses worldwide
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                Ship AI Voice Agents
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                that actually work.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Build, deploy, and scale AI-powered voice agents for sales, support, and customer service. 
              Complete with HITL controls, enterprise security, and white-label capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gradient-primary text-white border-0 h-14 px-8 text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base group">
                <Play className="mr-2 size-4 group-hover:text-primary transition-colors" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl glow-primary">
              <div className="p-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs text-muted-foreground">dashboard.jazi.ai</span>
                </div>
                <div className="aspect-[16/9] bg-gradient-to-br from-card via-card to-muted/20 flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="size-16 text-primary mb-4 mx-auto" />
                    <p className="text-lg font-medium">AI Dashboard Preview</p>
                    <p className="text-sm text-muted-foreground">Sign up to see your dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From intelligent voice agents to complete CRM, Jazi gives you all the tools 
              to automate customer conversations at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="bg-card/50 border-border/50 card-hover overflow-hidden group">
                <CardContent className="pt-8 pb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white w-fit mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Go live in minutes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Agent', desc: 'Choose a template or build from scratch with our AI-powered wizard', icon: Bot },
              { step: '02', title: 'Configure & Train', desc: 'Add your business context, connect integrations, and set up HITL rules', icon: Settings2 },
              { step: '03', title: 'Deploy & Scale', desc: 'Go live instantly and handle thousands of calls automatically', icon: Zap }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-muted/20 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-12">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <item.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/10 text-success border-success/20">
              <Star className="size-3 mr-1.5 fill-success" />
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Loved by teams everywhere</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="size-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-lg mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(70%_0.25_280_/_0.1),transparent_50%)]" />
            <CardContent className="py-16 text-center relative">
              <h2 className="text-4xl font-bold mb-4">Ready to transform your business?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join 500+ companies using Jazi to automate customer conversations and scale their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="gradient-primary text-white border-0 h-14 px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-14 px-8">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <Check className="size-4 text-success" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-1">
                  <Check className="size-4 text-success" />
                  No credit card required
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Zap className="size-4 text-white" />
              </div>
              <span className="font-bold">Jazi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Jazi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const Settings2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
  </svg>
)
