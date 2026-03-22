"use client"

import Link from "next/link"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { CreatePaymentDialog } from "@/components/dashboard/create-payment-dialog"
import { Button } from "@/components/ui/button"
import { Zap, ArrowLeft, MessageSquare, CreditCard } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FlowPay Sync</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Landing
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="sm">
                Demo
              </Button>
            </Link>
            <CreatePaymentDialog />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-8 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-card to-card p-8">
          <div className="max-w-2xl">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              WhatsApp to Checkout
            </h2>
            <p className="mb-6 text-muted-foreground">
              Connect informal WhatsApp sales with Fiserv/Clover POS. AI-powered order parsing,
              instant payment links, and automatic sync to your physical terminal.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Zero-Click AI Bot</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Clover Sync</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Instant Upsells</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-8">
          <StatsCards />
        </section>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionsTable />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            FlowPay Sync - Hackathon Fiserv/Clover - Powered by Claude AI + Twilio + Clover API v3
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Try the webhook: POST /api/webhook with {"{"} product, amount, customer {"}"}
          </p>
        </footer>
      </main>
    </div>
  )
}
