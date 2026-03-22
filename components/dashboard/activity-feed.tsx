"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, XCircle, CreditCard } from "lucide-react"

interface Activity {
  id: string
  type: "payment" | "pending" | "failed"
  title: string
  description: string
  time: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/transactions?limit=5")
        if (!res.ok) return
        const txs = await res.json()
        setActivities(
          txs.map(
            (tx: {
              id: string
              status: string
              amount: number
              customer: string
              date: string
            }) => ({
              id: tx.id,
              type: tx.status === "completed" ? "payment" : tx.status === "pending" ? "pending" : "failed",
              title:
                tx.status === "completed"
                  ? "Payment received"
                  : tx.status === "pending"
                  ? "Payment pending"
                  : "Payment failed",
              description: `$${tx.amount.toFixed(2)} from ${tx.customer}`,
              time: tx.date,
            })
          )
        )
      } catch {
        // Keep existing activities on error
      }
    }
    fetchActivity()
    const interval = setInterval(fetchActivity, 3000)
    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return (
          <div className="rounded-full bg-emerald-100 p-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
        )
      case "pending":
        return (
          <div className="rounded-full bg-amber-100 p-2">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
        )
      case "failed":
        return (
          <div className="rounded-full bg-red-100 p-2">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        )
      default:
        return (
          <div className="rounded-full bg-muted p-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
        )
    }
  }

  if (activities.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Activity Feed</CardTitle>
          <CardDescription>Recent activity on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <p>No activity yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Activity Feed</CardTitle>
        <CardDescription>Recent activity on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
