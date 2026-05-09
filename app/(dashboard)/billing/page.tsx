'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  CreditCard,
  Check,
  Zap,
  Phone,
  Clock,
  TrendingUp,
  Download,
  ExternalLink,
  Sparkles,
  Crown,
  Building2,
  Users,
  ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    description: 'Perfect for small businesses getting started',
    features: [
      '500 minutes/month',
      '1 AI agent',
      'Basic analytics',
      'Email support',
      'Standard voices'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    description: 'For growing teams with advanced needs',
    features: [
      '2,000 minutes/month',
      '5 AI agents',
      'Advanced analytics',
      'Priority support',
      'Premium voices',
      'CRM integrations',
      'Custom branding'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    description: 'Unlimited power for large organizations',
    features: [
      '10,000 minutes/month',
      'Unlimited AI agents',
      'White-label solution',
      'Dedicated support',
      'Custom AI training',
      'SLA guarantee',
      'API access',
      'SSO & SAML'
    ],
    popular: false
  }
]

const invoices = [
  { id: 'INV-001', date: new Date('2024-03-01'), amount: 149, status: 'paid' },
  { id: 'INV-002', date: new Date('2024-02-01'), amount: 149, status: 'paid' },
  { id: 'INV-003', date: new Date('2024-01-01'), amount: 149, status: 'paid' },
  { id: 'INV-004', date: new Date('2023-12-01'), amount: 49, status: 'paid' },
]

export default function BillingPage() {
  const [currentPlan] = useState('pro')
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const usageStats = {
    minutesUsed: 1247,
    minutesTotal: 2000,
    callsThisMonth: 156,
    agentsActive: 3,
    agentsTotal: 5
  }

  const usagePercentage = (usageStats.minutesUsed / usageStats.minutesTotal) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Usage</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view usage analytics
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="mr-2 size-4" />
          Billing Portal
        </Button>
      </div>

      {/* Current Plan Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="pt-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/20">
                <Crown className="size-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Pro Plan</h2>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Current Plan
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  $149/month • Renews on April 1, 2024
                </p>
              </div>
            </div>
            <Button className="gradient-primary text-white border-0">
              <Sparkles className="mr-2 size-4" />
              Upgrade to Enterprise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Phone className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minutes Used</p>
                  <p className="text-2xl font-bold">{usageStats.minutesUsed.toLocaleString()}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                of {usageStats.minutesTotal.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(usagePercentage)}% of monthly limit
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Clock className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calls This Month</p>
                <p className="text-2xl font-bold">{usageStats.callsThisMonth}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-success text-sm">
              <TrendingUp className="size-4" />
              <span>+23% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-success/10">
                  <Users className="size-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold">{usageStats.agentsActive}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                of {usageStats.agentsTotal} available
              </span>
            </div>
            <Progress 
              value={(usageStats.agentsActive / usageStats.agentsTotal) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="bg-card/50">
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="invoices">Invoice History</TabsTrigger>
          <TabsTrigger value="payment">Payment Method</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm">Monthly</span>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Save 20% with yearly
            </Badge>
            <span className="text-sm text-muted-foreground">Yearly</span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`bg-card/50 border-border/50 relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                } ${plan.id === currentPlan ? 'border-primary/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.id === 'enterprise' && <Building2 className="size-5 text-primary" />}
                    {plan.id === 'pro' && <Zap className="size-5 text-primary" />}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.id === currentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.id === 'enterprise' && currentPlan === 'pro' ? (
                    <Button className="w-full gradient-primary text-white border-0">
                      Upgrade
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      {plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan) 
                        ? 'Upgrade' 
                        : 'Downgrade'
                      }
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="bg-card/30 border-border/30">
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                Download your past invoices for your records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{format(invoice.date, 'MMM d, yyyy')}</TableCell>
                      <TableCell>${invoice.amount}.00</TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success border-success/20">
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 size-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="bg-card/30 border-border/30">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Update your billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-card">
                    <CreditCard className="size-6" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>

              <div className="flex gap-4">
                <Button variant="outline">
                  Update Card
                </Button>
                <Button variant="outline">
                  Add New Card
                </Button>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="font-medium mb-2">Billing Address</h4>
                <p className="text-sm text-muted-foreground">
                  123 Business St, Suite 100<br />
                  San Francisco, CA 94102<br />
                  United States
                </p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  Update Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
