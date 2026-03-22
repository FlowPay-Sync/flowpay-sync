"use client"

import { useState, use } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, Zap } from "lucide-react"

export default function PaymentPage({
  params,
}: {
  params: Promise<{ linkId: string }>
}) {
  const { linkId } = use(params)
  const searchParams = useSearchParams()
  const product = searchParams.get("p") || "Product"
  const amount = Number(searchParams.get("a")) || 0

  const [step, setStep] = useState<"details" | "processing" | "success">("details")
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("processing")

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Send to webhook
    try {
      await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          amount,
          customer: cardName,
          email,
          linkId,
          status: "completed",
          paymentMethod: "Card Payment",
        }),
      })
    } catch {
      // Continue to success even if webhook fails
    }

    setStep("success")
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        {step === "details" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">FlowPay Checkout</CardTitle>
              <CardDescription>Complete your payment securely</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Order Summary */}
              <div className="mb-6 rounded-lg border border-border/50 bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product</span>
                  <span className="font-medium text-foreground">{decodeURIComponent(product)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-2">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${amount.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/50 bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-foreground">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="border-border/50 bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-foreground">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                      className="border-border/50 bg-muted/50 pr-10"
                    />
                    <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-foreground">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                      className="border-border/50 bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-foreground">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      required
                      className="border-border/50 bg-muted/50"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Pay ${amount.toFixed(2)}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secured by Fiserv + FlowPay</span>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step === "processing" && (
          <CardContent className="py-16 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium text-foreground">Processing Payment...</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Syncing with Clover POS
            </p>
          </CardContent>
        )}

        {step === "success" && (
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
            <p className="mt-2 text-muted-foreground">
              Thank you for your purchase of {decodeURIComponent(product)}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Your order has been synced to the Clover POS system.
            </p>
            <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-sm text-emerald-400">
                Transaction ID: {linkId}
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
