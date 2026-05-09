"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  formatDuration,
  formatPhoneNumber,
  getSentimentColor,
} from "@/lib/utils"
import {
  PhoneIncoming,
  PhoneOutgoing,
  Monitor,
  ArrowRight,
} from "lucide-react"
import type { Call } from "@/types/database"

interface RecentCallsTableProps {
  calls: Array<
    Call & {
      leads?: { first_name: string | null; last_name: string | null } | null
      agents?: { name: string } | null
    }
  >
}

export function RecentCallsTable({ calls }: RecentCallsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Latest activity from your agents</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/calls">
            View All
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No calls yet. Your call history will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {calls.map((call) => (
              <Link
                key={call.id}
                href={`/calls/${call.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    {call.direction === "inbound" ? (
                      <PhoneIncoming className="size-4 text-muted-foreground" />
                    ) : call.direction === "browser" ? (
                      <Monitor className="size-4 text-muted-foreground" />
                    ) : (
                      <PhoneOutgoing className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {call.leads
                        ? `${call.leads.first_name || ""} ${call.leads.last_name || ""}`.trim() ||
                          "Unknown"
                        : call.from_number
                          ? formatPhoneNumber(call.from_number)
                          : "Unknown Caller"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {call.agents?.name || "No agent"} -{" "}
                      {formatDuration(call.duration_seconds)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {call.sentiment_label && (
                    <Badge
                      variant="secondary"
                      className={getSentimentColor(call.sentiment_label)}
                    >
                      {call.sentiment_label}
                    </Badge>
                  )}
                  <Badge
                    variant={call.status === "completed" ? "default" : "outline"}
                  >
                    {call.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(call.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
