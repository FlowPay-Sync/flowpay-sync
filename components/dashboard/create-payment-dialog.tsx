"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Copy, Check, ExternalLink, Loader2 } from "lucide-react"

export function CreatePaymentDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"form" | "loading" | "success">("form")
  const [product, setProduct] = useState("")
  const [amount, setAmount] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [whatsappLink, setWhatsappLink] = useState("")
  const [upsell, setUpsell] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("loading")
    setError("")

    try {
      const res = await fetch("/api/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, amount: Number(amount) }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Error creating link")
      setGeneratedLink(data.link.url)
      setWhatsappLink(data.link.whatsappUrl)
      setUpsell(data.link.upsell)
      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating link")
      setStep("form")
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    setStep("form")
    setProduct("")
    setAmount("")
    setGeneratedLink("")
    setWhatsappLink("")
    setUpsell("")
    setCopied(false)
    setError("")
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Payment Link
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/50 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === "success" ? "Payment Link Created!" : "Create Payment Link"}
          </DialogTitle>
          <DialogDescription>
            {step === "success"
              ? "Share this link with your customer via WhatsApp"
              : "Generate a new payment link for your customer"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product" className="text-foreground">Product / Service</Label>
              <Input
                id="product"
                placeholder="e.g., Pizza Margherita"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
                className="border-border/50 bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="15.99"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border-border/50 bg-muted/50"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Generate Link
            </Button>
          </form>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Generating payment link...</p>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Payment Link</p>
              <p className="break-all text-sm text-muted-foreground">{generatedLink}</p>
            </div>

            {upsell && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-sm text-primary">{upsell}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="gap-2 border-border/50">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>

              {whatsappLink && (
                <Button
                  variant="outline"
                  className="gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => window.open(whatsappLink, "_blank")}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share via WhatsApp
                </Button>
              )}

              <Button
                variant="outline"
                className="gap-2 border-border/50"
                onClick={() => window.open(generatedLink, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Open Payment Page
              </Button>

              <Button onClick={resetForm} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Create Another Link
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
