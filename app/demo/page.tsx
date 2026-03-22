"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Zap, MessageSquare, CreditCard, CheckCircle2, ArrowRight, ArrowLeft,
  Send, Copy, Bot, ShoppingCart, Wifi, Battery, Signal, ChevronLeft,
  Phone, Video, MoreVertical, Check, Clock, Database, Server,
  RefreshCw, ArrowDown, Plus, Sparkles,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface Message {
  role: "user" | "bot"
  content: string
  time: string
  status?: "sending" | "sent" | "delivered" | "read"
  options?: string[]
}

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface PaymentLink {
  url: string
  amount: number
  items: OrderItem[]
}

interface SystemEvent {
  id: string
  time: string
  type: "message" | "ai" | "payment" | "sync" | "success" | "info" | "pos"
  title: string
  description: string
  status: "pending" | "processing" | "completed"
}

function getTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
}

export default function DemoPage() {
  const { t, locale, setLocale } = useI18n()

  const steps = [
    { id: 1, title: t("demo_step_1"), icon: MessageSquare },
    { id: 2, title: t("demo_step_2"), icon: Bot },
    { id: 3, title: t("demo_step_3"), icon: ShoppingCart },
    { id: 4, title: t("demo_step_4"), icon: CreditCard },
  ]

  const [mounted, setMounted] = useState(false)
  const [clockTime, setClockTime] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null)
  const [orderComplete, setOrderComplete] = useState(false)
  const [cloverSynced, setCloverSynced] = useState(false)
  const [showPOS, setShowPOS] = useState(false)
  const [posState, setPosState] = useState<"idle" | "reading" | "processing" | "approved">("idle")
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventsEndRef = useRef<HTMLDivElement>(null)
  const posRef = useRef<HTMLDivElement>(null)

  // Quick reply options — stable reference via useMemo so it doesn't cause re-renders
  const quickReplies = locale === "es"
    ? ["Quiero 2 pizzas grandes", "Una hamburguesa con papas", "3 jugos naturales", "Menu del dia"]
    : ["I want 2 large pizzas", "A burger with fries", "3 natural juices", "Daily menu"]

  // initMessages inlines quickReplies to avoid array reference as a dep
  const initMessages = useCallback(() => {
    const isEs = locale === "es"
    const opts = isEs
      ? ["Quiero 2 pizzas grandes", "Una hamburguesa con papas", "3 jugos naturales", "Menu del dia"]
      : ["I want 2 large pizzas", "A burger with fries", "3 natural juices", "Daily menu"]
    const greeting = isEs
      ? "Hola! Bienvenido a FlowPay. Soy tu asistente virtual. ¿Que te gustaria ordenar hoy?"
      : "Hello! Welcome to FlowPay. I'm your virtual assistant. What would you like to order today?"
    setMessages([{ role: "bot", content: greeting, time: getTime(), options: opts }])
    setSystemEvents([{
      id: "1", time: getTime(), type: "info",
      title: isEs ? "Sistema Inicializado" : "System Initialized",
      description: isEs ? "Bot conectado y listo" : "Bot connected and ready",
      status: "completed",
    }])
  }, [locale]) // only locale — no array reference

  // Run once on mount, and again if locale changes
  useEffect(() => {
    setMounted(true)
    setClockTime(getTime())
    initMessages()
    const tick = setInterval(() => setClockTime(getTime()), 30000)
    return () => clearInterval(tick)
  }, [initMessages]) // safe: initMessages only changes when locale changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, systemEvents])

  const addEvent = (event: Omit<SystemEvent, "id" | "time">) => {
    setSystemEvents((prev) => [...prev, { ...event, id: Math.random().toString(), time: getTime() }])
  }

  const updateLastEvent = (status: "completed") => {
    setSystemEvents((prev) => {
      const copy = [...prev]
      if (copy.length > 0) copy[copy.length - 1].status = status
      return copy
    })
  }

  const addBotMessage = async (content: string, options?: string[], delay = 800) => {
    setIsTyping(true)
    await new Promise((r) => setTimeout(r, delay))
    setIsTyping(false)
    setMessages((prev) => [...prev, { role: "bot", content, time: getTime(), options }])
  }

  const processOrder = async (message: string) => {
    setIsProcessing(true)
    setMessages((prev) => [...prev, { role: "user", content: message, time: getTime(), status: "read" }])
    
    addEvent({ 
      type: "message", 
      title: locale === "es" ? "Mensaje Recibido" : "Message Received", 
      description: `"${message.substring(0, 40)}${message.length > 40 ? "..." : ""}"`, 
      status: "completed" 
    })
    setCurrentStep(2)

    // AI processing response
    await addBotMessage(
      locale === "es" 
        ? "Perfecto, dejame procesar tu pedido..." 
        : "Perfect, let me process your order...",
      undefined,
      600
    )

    addEvent({ 
      type: "ai", 
      title: locale === "es" ? "Claude AI Procesando" : "Claude AI Processing", 
      description: locale === "es" ? "Analizando productos y cantidades..." : "Analyzing products and quantities...", 
      status: "processing" 
    })

    await new Promise((r) => setTimeout(r, 2000))

    // Parse items
    const items: OrderItem[] = []
    const lc = message.toLowerCase()
    if (lc.includes("pizza"))              { const q = parseInt(lc.match(/(\d+)\s*pizza/)?.[1] || "1"); items.push({ name: locale === "es" ? "Pizza Grande Pepperoni" : "Large Pepperoni Pizza", quantity: q, price: 18.99 }) }
    if (lc.includes("hamburguesa") || lc.includes("burger")) { items.push({ name: locale === "es" ? "Hamburguesa Clasica" : "Classic Burger", quantity: 1, price: 12.99 }) }
    if (lc.includes("papa") || lc.includes("fries"))         { items.push({ name: locale === "es" ? "Papas Fritas" : "French Fries", quantity: 1, price: 4.99 }) }
    if (lc.includes("jugo") || lc.includes("juice"))         { const q = parseInt(lc.match(/(\d+)\s*(jugo|juice)/)?.[1] || "1"); items.push({ name: locale === "es" ? "Jugo Natural" : "Natural Juice", quantity: q, price: 3.99 }) }
    if (lc.includes("menu") || lc.includes("combo"))         { items.push({ name: locale === "es" ? "Menu del Dia" : "Daily Menu", quantity: 1, price: 15.99 }) }
    if (items.length === 0) items.push({ name: locale === "es" ? "Combo Especial" : "Special Combo", quantity: 1, price: 15.99 })

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

    updateLastEvent("completed")
    addEvent({ 
      type: "ai", 
      title: locale === "es" ? "Orden Parseada" : "Order Parsed", 
      description: `${items.length} ${locale === "es" ? "productos" : "products"} — $${total.toFixed(2)}`, 
      status: "completed" 
    })

    // Show order summary
    const summary = items.map((i) => `• ${i.quantity}x ${i.name} — $${(i.price * i.quantity).toFixed(2)}`).join("\n")
    const confirmOptions = locale === "es" 
      ? ["Si, generar link de pago", "Agregar algo mas", "Cancelar pedido"]
      : ["Yes, generate payment link", "Add something else", "Cancel order"]

    await addBotMessage(
      `${locale === "es" ? "Excelente! Tu pedido:" : "Great! Your order:"}\n\n${summary}\n\n💰 Total: $${total.toFixed(2)} USD\n\n${locale === "es" ? "¿Confirmas tu pedido?" : "Confirm your order?"}`,
      confirmOptions,
      1000
    )
    setCurrentStep(3)
    setIsProcessing(false)

    // Store items for later
    sessionStorage.setItem("flowpay_items", JSON.stringify(items))
    sessionStorage.setItem("flowpay_total", total.toString())
  }

  const generatePaymentLink = async () => {
    setIsProcessing(true)
    setMessages((prev) => [...prev, { 
      role: "user", 
      content: locale === "es" ? "Si, generar link de pago" : "Yes, generate payment link", 
      time: getTime(), 
      status: "read" 
    }])

    addEvent({ 
      type: "payment", 
      title: locale === "es" ? "Generando Link" : "Generating Link", 
      description: locale === "es" ? "Conectando con Fiserv Gateway..." : "Connecting to Fiserv Gateway...", 
      status: "processing" 
    })

    await new Promise((r) => setTimeout(r, 1500))

    const items = JSON.parse(sessionStorage.getItem("flowpay_items") || "[]")
    const total = parseFloat(sessionStorage.getItem("flowpay_total") || "0")
    const linkId = Math.random().toString(36).substring(2, 10)
    
    setPaymentLink({ url: `${window.location.origin}/pay/${linkId}`, amount: total, items })
    updateLastEvent("completed")
    addEvent({ 
      type: "payment", 
      title: locale === "es" ? "Link Generado" : "Link Generated", 
      description: `flowpay.app/pay/${linkId}`, 
      status: "completed" 
    })

    await addBotMessage(
      locale === "es" 
        ? "¡Tu link de pago esta listo! Haz clic en el boton para pagar de forma segura con tu tarjeta." 
        : "Your payment link is ready! Click the button to pay securely with your card.",
      undefined,
      800
    )
    setIsProcessing(false)
  }

  const simulatePayment = async () => {
    setCurrentStep(4)
    setIsProcessing(true)
    setShowPOS(true)
    
    addEvent({ 
      type: "pos", 
      title: locale === "es" ? "Terminal POS Activado" : "POS Terminal Activated", 
      description: locale === "es" ? "Esperando tarjeta..." : "Waiting for card...", 
      status: "processing" 
    })

    // POS animation sequence
    await new Promise((r) => setTimeout(r, 1000))
    setPosState("reading")
    
    await new Promise((r) => setTimeout(r, 1500))
    updateLastEvent("completed")
    addEvent({ 
      type: "payment", 
      title: locale === "es" ? "Tarjeta Leida" : "Card Read", 
      description: "**** **** **** 4242", 
      status: "completed" 
    })
    
    setPosState("processing")
    addEvent({ 
      type: "payment", 
      title: locale === "es" ? "Procesando Pago" : "Processing Payment", 
      description: `$${paymentLink?.amount.toFixed(2)} USD`, 
      status: "processing" 
    })
    
    await new Promise((r) => setTimeout(r, 2000))
    setPosState("approved")
    updateLastEvent("completed")
    
    addEvent({ 
      type: "success", 
      title: locale === "es" ? "PAGO APROBADO" : "PAYMENT APPROVED", 
      description: `Auth: ${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 
      status: "completed" 
    })

    setOrderComplete(true)

    addEvent({ 
      type: "sync", 
      title: locale === "es" ? "Sincronizando Clover" : "Syncing Clover", 
      description: locale === "es" ? "Enviando orden al sistema..." : "Sending order to system...", 
      status: "processing" 
    })
    
    await new Promise((r) => setTimeout(r, 1500))
    updateLastEvent("completed")
    setCloverSynced(true)
    
    const cloverId = `CLV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    addEvent({ 
      type: "sync", 
      title: locale === "es" ? "Sync Completado" : "Sync Complete", 
      description: `Clover ID: ${cloverId}`, 
      status: "completed" 
    })

    await addBotMessage(
      locale === "es" 
        ? `¡Pago completado con exito! Tu orden #${cloverId} ya esta en preparacion. ¡Gracias por tu compra!` 
        : `Payment successful! Your order #${cloverId} is being prepared. Thank you for your purchase!`,
      undefined,
      1000
    )

    setIsProcessing(false)
  }

  const handleQuickReply = (reply: string) => {
    if (isProcessing || orderComplete) return

    if (reply.toLowerCase().includes("generar link") || reply.toLowerCase().includes("generate payment")) {
      generatePaymentLink()
    } else if (reply.toLowerCase().includes("cancelar") || reply.toLowerCase().includes("cancel")) {
      resetDemo()
    } else if (reply.toLowerCase().includes("agregar") || reply.toLowerCase().includes("add")) {
      setMessages((prev) => [...prev, { role: "user", content: reply, time: getTime(), status: "read" }])
      addBotMessage(
        locale === "es" ? "¿Que mas te gustaria agregar?" : "What else would you like to add?",
        quickReplies,
        600
      )
    } else {
      processOrder(reply)
    }
  }

  const resetDemo = () => {
    setCurrentStep(1)
    initMessages()
    setPaymentLink(null)
    setOrderComplete(false)
    setCloverSynced(false)
    setShowPOS(false)
    setPosState("idle")
    setIsProcessing(false)
    setIsTyping(false)
    sessionStorage.removeItem("flowpay_items")
    sessionStorage.removeItem("flowpay_total")
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageSquare className="h-3.5 w-3.5" />
      case "ai":      return <Sparkles className="h-3.5 w-3.5" />
      case "payment": return <CreditCard className="h-3.5 w-3.5" />
      case "sync":    return <Database className="h-3.5 w-3.5" />
      case "success": return <CheckCircle2 className="h-3.5 w-3.5" />
      case "pos":     return <CreditCard className="h-3.5 w-3.5" />
      default:        return <Server className="h-3.5 w-3.5" />
    }
  }

  const getEventColor = (type: string, status: string) => {
    if (status === "processing") return "bg-amber-100 text-amber-600 border-amber-200"
    switch (type) {
      case "success": return "bg-emerald-100 text-emerald-600 border-emerald-200"
      case "sync":    return "bg-blue-100 text-blue-600 border-blue-200"
      case "ai":      return "bg-violet-100 text-violet-600 border-violet-200"
      case "payment": return "bg-cyan-100 text-cyan-600 border-cyan-200"
      case "pos":     return "bg-orange-100 text-orange-600 border-orange-200"
      default:        return "bg-muted text-muted-foreground border-border"
    }
  }

  const guideContent = [
    { title: t("demo_guide_1_title"), desc: t("demo_guide_1_desc") },
    { title: t("demo_guide_2_title"), desc: t("demo_guide_2_desc") },
    { title: t("demo_guide_3_title"), desc: t("demo_guide_3_desc") },
    { title: t("demo_guide_4_title"), desc: t("demo_guide_4_desc") },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-bold leading-tight text-foreground">FlowPay Sync</p>
              <p className="text-xs text-muted-foreground">{t("demo_subtitle")}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border overflow-hidden text-sm font-medium">
              <button
                onClick={() => setLocale("es")}
                className={`px-3 py-1.5 transition-colors ${locale === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                ES
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`px-3 py-1.5 transition-colors ${locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={resetDemo} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("demo_restart")}</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("demo_back")}</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90">
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Progress steps */}
        <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                currentStep > step.id ? "bg-emerald-100 text-emerald-700"
                : currentStep === step.id ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300"
                : "bg-muted text-muted-foreground"
              }`}>
                {currentStep > step.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <step.icon className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className={`mx-1.5 h-3.5 w-3.5 ${currentStep > step.id ? "text-emerald-500" : "text-muted-foreground/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:h-[calc(100vh-10rem)]">

          {/* Left: Phone mockup — static, never scrolls */}
          <div className="flex-shrink-0 self-start lg:sticky lg:top-24">
            <div className="relative w-[280px] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl mx-auto lg:mx-0">
              <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-900" />

              <div className="relative h-[580px] overflow-hidden rounded-[1.8rem] bg-white">
                {/* Status bar */}
                <div className="flex items-center justify-between bg-[#075e54] px-4 py-1 text-white">
                  <span className="text-[10px] font-medium" suppressHydrationWarning>{clockTime || "00:00"}</span>
                  <div className="flex items-center gap-1">
                    <Signal className="h-2.5 w-2.5" />
                    <Wifi className="h-2.5 w-2.5" />
                    <Battery className="h-2.5 w-2.5" />
                  </div>
                </div>

                {/* WhatsApp header */}
                <div className="flex items-center gap-2 bg-[#075e54] px-2 pb-2">
                  <ChevronLeft className="h-5 w-5 text-white" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">FlowPay Bot</p>
                    <p className="text-[9px] text-green-200">{t("demo_online")}</p>
                  </div>
                  <Video className="h-4 w-4 text-white/80" />
                  <Phone className="h-4 w-4 text-white/80" />
                  <MoreVertical className="h-4 w-4 text-white/80" />
                </div>

                {/* Chat area with WhatsApp background */}
                <div 
                  className="flex h-[calc(100%-105px)] flex-col"
                  style={{ 
                    backgroundColor: "#e5ddd5",
                    backgroundImage: `url("/images/whatsapp-bg.png")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  <div className="flex-1 space-y-1 overflow-y-auto p-2">
                    {messages.map((msg, i) => (
                      <div key={i}>
                        <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`relative max-w-[85%] rounded-lg px-2 py-1 shadow-sm text-[11px] ${
                            msg.role === "user" 
                              ? "rounded-tr-none bg-[#dcf8c6]" 
                              : "rounded-tl-none bg-white"
                          }`}>
                            <p className="whitespace-pre-line text-gray-800 leading-relaxed">{msg.content}</p>
                            <div className="mt-0.5 flex items-center justify-end gap-0.5">
                              <span className="text-[8px] text-gray-500" suppressHydrationWarning>{msg.time}</span>
                              {msg.role === "user" && msg.status === "read" && (
                                <div className="flex -space-x-0.5">
                                  <Check className="h-2 w-2 text-blue-500" />
                                  <Check className="h-2 w-2 text-blue-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick reply options */}
                        {msg.options && i === messages.length - 1 && !isProcessing && !orderComplete && (
                          <div className="mt-1.5 flex flex-wrap gap-1 justify-start pl-1">
                            {msg.options.map((opt, j) => (
                              <button
                                key={j}
                                onClick={() => handleQuickReply(opt)}
                                className="rounded-full border border-[#075e54] bg-white px-2 py-0.5 text-[9px] text-[#075e54] transition-colors hover:bg-[#075e54] hover:text-white"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment link card */}
                    {paymentLink && !orderComplete && (
                      <div className="flex justify-start">
                        <div className="w-[85%] overflow-hidden rounded-lg bg-white shadow-sm">
                          <div className="bg-gradient-to-r from-violet-600 to-cyan-600 px-2 py-1">
                            <p className="text-[9px] font-medium text-white">{t("demo_pay_title")}</p>
                          </div>
                          <div className="p-2">
                            <p className="text-sm font-bold text-gray-800">${paymentLink.amount.toFixed(2)} USD</p>
                            <p className="text-[9px] text-gray-500 mb-1.5">{paymentLink.items.length} {t("demo_products")}</p>
                            <button
                              onClick={simulatePayment}
                              disabled={isProcessing}
                              className="w-full rounded bg-gradient-to-r from-violet-600 to-cyan-600 py-1 text-[9px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                            >
                              {t("demo_pay_btn")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order complete card */}
                    {orderComplete && cloverSynced && (
                      <div className="flex justify-start">
                        <div className="w-[85%] overflow-hidden rounded-lg bg-white shadow-sm">
                          <div className="bg-emerald-500 px-2 py-1">
                            <p className="text-[9px] font-medium text-white">{t("demo_complete_title")}</p>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              <span className="text-[9px] font-medium">{t("demo_synced")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className="flex items-center gap-1.5 bg-[#f0f0f0] px-2 py-1.5">
                    {orderComplete ? (
                      <button
                        onClick={resetDemo}
                        className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 py-1.5 text-[10px] font-semibold text-white"
                      >
                        {t("demo_reset")}
                      </button>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 text-gray-500" />
                        <div className="flex-1 rounded-full bg-white px-3 py-1 text-[10px] text-gray-500 border border-gray-200">
                          {inputValue || t("demo_placeholder")}
                        </div>
                        <button
                          onClick={() => { if (!isProcessing && inputValue.trim()) { processOrder(inputValue); setInputValue("") } }}
                          disabled={isProcessing || !inputValue.trim()}
                          className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                            inputValue.trim() && !isProcessing ? "bg-[#075e54] text-white" : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-1.5 h-1 w-14 rounded-full bg-gray-700" />
            </div>

            {/* Input below phone */}
            {!orderComplete && (
              <div className="mt-4 w-[280px] mx-auto lg:mx-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !isProcessing && inputValue.trim()) { processOrder(inputValue); setInputValue("") } }}
                    placeholder={t("demo_placeholder")}
                    disabled={isProcessing || orderComplete}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => { if (!isProcessing && inputValue.trim()) { processOrder(inputValue); setInputValue("") } }}
                    disabled={isProcessing || !inputValue.trim()}
                    className="shrink-0 bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel — has its own scroll */}
          <div className="flex flex-1 flex-col gap-4 min-w-0 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] lg:pr-1">

            {/* POS Simulation */}
            {showPOS && (
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-orange-800">
                    <CreditCard className="h-4 w-4" />
                    {locale === "es" ? "Terminal Fiserv POS" : "Fiserv POS Terminal"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/images/fiserv-pos.png"
                        alt="Fiserv POS Terminal"
                        fill
                        className="object-cover"
                      />
                      {/* POS screen overlay */}
                      <div 
                        ref={posRef}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-300"
                        style={{ opacity: posState === "idle" ? 0 : 1 }}
                      >
                        <div className="text-center">
                          {posState === "reading" && (
                            <div className="animate-pulse">
                              <CreditCard className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                              <p className="text-[8px] text-yellow-400 font-mono">LEYENDO...</p>
                            </div>
                          )}
                          {posState === "processing" && (
                            <div className="animate-pulse">
                              <RefreshCw className="h-5 w-5 text-cyan-400 mx-auto mb-1 animate-spin" />
                              <p className="text-[8px] text-cyan-400 font-mono">PROCESANDO</p>
                            </div>
                          )}
                          {posState === "approved" && (
                            <div className="animate-bounce">
                              <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1" />
                              <p className="text-[8px] text-emerald-400 font-mono font-bold">APROBADO</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-1.5">
                        <div className={`flex items-center gap-2 text-xs ${posState === "reading" || posState === "processing" || posState === "approved" ? "text-emerald-600" : "text-muted-foreground"}`}>
                          <div className={`h-2 w-2 rounded-full ${posState !== "idle" ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                          {locale === "es" ? "Terminal conectado" : "Terminal connected"}
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${posState === "reading" || posState === "processing" || posState === "approved" ? "text-emerald-600" : "text-muted-foreground"}`}>
                          <div className={`h-2 w-2 rounded-full ${posState === "reading" || posState === "processing" || posState === "approved" ? "bg-emerald-500" : "bg-gray-300"}`} />
                          {locale === "es" ? "Tarjeta detectada" : "Card detected"}
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${posState === "approved" ? "text-emerald-600" : "text-muted-foreground"}`}>
                          <div className={`h-2 w-2 rounded-full ${posState === "approved" ? "bg-emerald-500" : "bg-gray-300"}`} />
                          {locale === "es" ? "Transaccion completada" : "Transaction complete"}
                        </div>
                      </div>
                      {paymentLink && (
                        <div className="mt-2 rounded bg-gray-900 px-2 py-1.5 font-mono text-[10px] text-emerald-400">
                          <span className="text-gray-500">MONTO:</span> ${paymentLink.amount.toFixed(2)} USD
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Examples */}
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquare className="h-4 w-4 text-violet-600" />
                  {t("demo_examples_title")}
                  <span className="ml-auto text-[10px] font-normal text-muted-foreground">{t("demo_examples_desc")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(ex)}
                      disabled={isProcessing || orderComplete}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2 text-left text-xs transition-all hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 group-hover:bg-violet-200">
                        {i + 1}
                      </div>
                      <span className="text-foreground/80 leading-tight truncate">{ex}</span>
                    </button>
                  ))}
                </div>

                {/* Guide */}
                <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-2.5">
                  <p className="text-[10px] font-semibold text-violet-700">{t("demo_guide_label")} — {guideContent[currentStep - 1].title}</p>
                  <p className="text-[10px] text-violet-600 leading-relaxed mt-0.5">{guideContent[currentStep - 1].desc}</p>
                </div>

                {paymentLink && !orderComplete && (
                  <button
                    onClick={() => navigator.clipboard.writeText(paymentLink.url)}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-[10px] font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
                  >
                    <Copy className="h-3 w-3" />
                    {t("demo_pay_copy")}
                  </button>
                )}
              </CardContent>
            </Card>

            {/* System Activity */}
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Server className="h-4 w-4 text-cyan-600" />
                  {t("demo_activity_title")}
                  <span className="ml-auto flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-normal text-muted-foreground">{t("demo_activity_desc")}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="max-h-[180px] space-y-1.5 overflow-y-auto pr-1">
                  {systemEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-2">
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${getEventColor(event.type, event.status)}`}>
                        {event.status === "processing"
                          ? <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                          : getEventIcon(event.type)
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-semibold text-foreground truncate">{event.title}</p>
                          <span className="shrink-0 text-[9px] text-muted-foreground" suppressHydrationWarning>{event.time}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-snug truncate">{event.description}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={eventsEndRef} />
                </div>
              </CardContent>
            </Card>

            {/* Architecture */}
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Zap className="h-4 w-4 text-amber-500" />
                  {t("demo_arch_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center justify-between gap-1.5">
                  <div className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all flex-1 ${
                    currentStep >= 1 ? "border-green-300 bg-green-50" : "border-border bg-muted/30"
                  }`}>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${currentStep >= 1 ? "bg-green-500" : "bg-muted"}`}>
                      <MessageSquare className={`h-3 w-3 ${currentStep >= 1 ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-[9px] font-semibold ${currentStep >= 1 ? "text-green-700" : "text-muted-foreground"}`}>
                      WhatsApp
                    </span>
                  </div>

                  <ArrowDown className={`h-3 w-3 shrink-0 rotate-[-90deg] ${currentStep >= 2 ? "text-violet-500" : "text-muted-foreground/30"}`} />

                  <div className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all flex-1 ${
                    currentStep >= 2 ? "border-violet-300 bg-violet-50" : "border-border bg-muted/30"
                  }`}>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${currentStep >= 2 ? "bg-gradient-to-br from-violet-600 to-cyan-600" : "bg-muted"}`}>
                      <Sparkles className={`h-3 w-3 ${currentStep >= 2 ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-[9px] font-semibold ${currentStep >= 2 ? "text-violet-700" : "text-muted-foreground"}`}>
                      FlowPay AI
                    </span>
                  </div>

                  <ArrowDown className={`h-3 w-3 shrink-0 rotate-[-90deg] ${currentStep >= 4 ? "text-orange-500" : "text-muted-foreground/30"}`} />

                  <div className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all flex-1 ${
                    currentStep >= 4 ? "border-orange-300 bg-orange-50" : "border-border bg-muted/30"
                  }`}>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${currentStep >= 4 ? "bg-orange-500" : "bg-muted"}`}>
                      <CreditCard className={`h-3 w-3 ${currentStep >= 4 ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-[9px] font-semibold ${currentStep >= 4 ? "text-orange-700" : "text-muted-foreground"}`}>
                      Fiserv POS
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}
