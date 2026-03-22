"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  product: string
  amount: number
  customer: string
  email?: string
  status: "completed" | "pending" | "failed"
  date: string
  paymentMethod: string
  cloverId?: string
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await fetch("/api/transactions?limit=10")
        if (res.ok) setTransactions(await res.json())
      } catch {
        // Keep existing transactions on error
      }
    }
    fetchTx()
    const interval = setInterval(fetchTx, 3000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-300">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          <CardDescription>Your latest payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <p>No transactions yet. Create a payment link to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Transactions</CardTitle>
        <CardDescription>Your latest payment transactions synced with Clover POS</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-muted/30">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Product</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Method</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Clover ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-border/50 hover:bg-muted/30">
                <TableCell className="font-mono text-sm text-foreground">{tx.id}</TableCell>
                <TableCell className="font-medium text-foreground">{tx.product}</TableCell>
                <TableCell className="text-muted-foreground">{tx.customer}</TableCell>
                <TableCell className="font-medium text-emerald-600">
                  ${tx.amount.toFixed(2)}
                </TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
                <TableCell className="text-muted-foreground">{tx.paymentMethod}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                <TableCell>
                  {tx.cloverId ? (
                    <span className="font-mono text-xs text-emerald-600">
                      {tx.cloverId.substring(0, 15)}...
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
