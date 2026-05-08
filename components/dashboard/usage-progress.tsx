"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTenant } from "@/components/providers/tenant-provider"
import { cn } from "@/lib/utils"
import useSWR from "swr"

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage This Month</CardTitle>
        <CardDescription>
          {minutesUsed} of {minutesIncluded} minutes used
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress
          value={percentage}
          className={cn(
            "h-3",
            isCritical && "[&>div]:bg-destructive",
            isWarning && !isCritical && "[&>div]:bg-amber-500"
          )}
        />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {Math.round(percentage)}% used
          </span>
          <span
            className={cn(
              "font-medium",
              isCritical && "text-destructive",
              isWarning && !isCritical && "text-amber-500"
            )}
          >
            {minutesIncluded - minutesUsed} minutes remaining
          </span>
        </div>
        {isWarning && (
          <p
            className={cn(
              "text-sm",
              isCritical ? "text-destructive" : "text-amber-500"
            )}
          >
            {isCritical
              ? "You're almost out of minutes! Consider upgrading your plan."
              : "You're approaching your monthly limit."}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
