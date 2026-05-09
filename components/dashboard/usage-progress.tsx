"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTenant } from "@/components/providers/tenant-provider"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import { Clock, TrendingUp, Zap, Phone, Crown } from "lucide-react"

async function fetchUsage() {
  const res = await fetch("/api/billing/usage")
  if (!res.ok) throw new Error("Failed to fetch usage")
  return res.json()
}

export function UsageProgress() {
  const { tenant } = useTenant()
  const { data } = useSWR("/api/billing/usage", fetchUsage)

  const minutesUsed = data?.minutesUsed || 0
  const minutesIncluded = tenant?.plan_minutes_included || 500
  const percentage = Math.min((minutesUsed / minutesIncluded) * 100, 100)
  const isWarning = percentage >= 80
  const isCritical = percentage >= 90
  const callsThisMonth = data?.callsThisMonth || 0

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Usage This Month
            </CardTitle>
            <CardDescription>
              Track your minutes and calls
            </CardDescription>
          </div>
          <Badge 
            variant="secondary"
            className={cn(
              isCritical ? "bg-destructive/10 text-destructive border-destructive/20" :
              isWarning ? "bg-warning/10 text-warning border-warning/20" :
              "bg-primary/10 text-primary border-primary/20"
            )}
          >
            {tenant?.plan || 'Pro'} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Minutes Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Minutes Used</span>
            <span className="font-semibold">
              {minutesUsed.toLocaleString()} / {minutesIncluded.toLocaleString()}
            </span>
          </div>
          <Progress
            value={percentage}
            className={cn(
              "h-3",
              isCritical && "[&>div]:bg-destructive",
              isWarning && !isCritical && "[&>div]:bg-warning"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(percentage)}% used</span>
            <span className={cn(
              "font-medium",
              isCritical && "text-destructive",
              isWarning && !isCritical && "text-warning"
            )}>
              {(minutesIncluded - minutesUsed).toLocaleString()} minutes remaining
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <div className="p-2 rounded-lg bg-accent/10">
              <Phone className="size-4 text-accent" />
            </div>
            <div>
              <p className="text-lg font-semibold">{callsThisMonth}</p>
              <p className="text-xs text-muted-foreground">Calls this month</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="size-4 text-success" />
            </div>
            <div>
              <p className="text-lg font-semibold">4.2m</p>
              <p className="text-xs text-muted-foreground">Avg. call length</p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {isWarning && (
          <div className={cn(
            "p-3 rounded-lg flex items-center gap-3",
            isCritical ? "bg-destructive/10" : "bg-warning/10"
          )}>
            <Zap className={cn(
              "size-5",
              isCritical ? "text-destructive" : "text-warning"
            )} />
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium",
                isCritical ? "text-destructive" : "text-warning"
              )}>
                {isCritical
                  ? "You're almost out of minutes!"
                  : "Approaching your monthly limit"}
              </p>
              <p className="text-xs text-muted-foreground">
                Consider upgrading to get more minutes
              </p>
            </div>
            <Button size="sm" className="gradient-primary text-white border-0">
              <Crown className="mr-1.5 size-3" />
              Upgrade
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
