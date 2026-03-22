"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Zap,
  MessageSquare,
  CreditCard,
  BarChart3,
  Shield,
  Globe,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  ChevronRight,
  Smartphone,
  Server,
  RefreshCw,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const { t, locale, setLocale } = useI18n()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    { icon: MessageSquare, title: t("feat_1_title"), description: t("feat_1_desc") },
    { icon: CreditCard,    title: t("feat_2_title"), description: t("feat_2_desc") },
    { icon: Zap,           title: t("feat_3_title"), description: t("feat_3_desc") },
    { icon: BarChart3,     title: t("feat_4_title"), description: t("feat_4_desc") },
    { icon: Shield,        title: t("feat_5_title"), description: t("feat_5_desc") },
    { icon: Globe,         title: t("feat_6_title"), description: t("feat_6_desc") },
  ]

  const steps = [
    { number: "01", title: t("step_1_title"), description: t("step_1_desc") },
    { number: "02", title: t("step_2_title"), description: t("step_2_desc") },
    { number: "03", title: t("step_3_title"), description: t("step_3_desc") },
    { number: "04", title: t("step_4_title"), description: t("step_4_desc") },
  ]

  const testimonials = [
    { name: t("test_1_name"), role: t("test_1_role"), location: t("test_1_loc"), content: t("test_1_content"), rating: 5 },
    { name: t("test_2_name"), role: t("test_2_role"), location: t("test_2_loc"), content: t("test_2_content"), rating: 5 },
    { name: t("test_3_name"), role: t("test_3_role"), location: t("test_3_loc"), content: t("test_3_content"), rating: 5 },
  ]

  const stats = [
    { value: "50K+",  label: t("stat_transactions") },
    { value: "98%",   label: t("stat_conversion") },
    { value: "< 3s",  label: t("stat_response") },
    { value: "24/7",  label: t("stat_uptime") },
  ]

  const slides = [
    { src: "/images/hero-dashboard.jpg",    title: t("slide_1_title"), desc: t("slide_1_desc") },
    { src: "/images/whatsapp-chat.jpg",     title: t("slide_2_title"), desc: t("slide_2_desc") },
    { src: "/images/clover-pos.jpg",        title: t("slide_3_title"), desc: t("slide_3_desc") },
    { src: "/images/analytics-dashboard.jpg", title: t("slide_4_title"), desc: t("slide_4_desc") },
  ]

  const starterFeatures = locale === "es"
    ? ["500 transacciones/mes", "1 número de WhatsApp", "Sincronización Clover básica", "Dashboard de métricas", "Soporte por email"]
    : ["500 transactions/mo", "1 WhatsApp number", "Basic Clover sync", "Metrics dashboard", "Email support"]

  const proFeatures = locale === "es"
    ? ["Transacciones ilimitadas", "Múltiples números WhatsApp", "Sincronización Clover avanzada", "Analytics completo", "Upsells con IA", "Soporte prioritario 24/7"]
    : ["Unlimited transactions", "Multiple WhatsApp numbers", "Advanced Clover sync", "Full analytics", "AI upsells", "Priority 24/7 support"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "border-b border-border/50 bg-background/80 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FlowPay Sync</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_features")}</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_how")}</a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_testimonials")}</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_pricing")}</a>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
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
            <Link href="/demo">
              <Button variant="ghost" className="hidden sm:flex">{t("nav_login")}</Button>
            </Link>
            <Link href="/demo">
              <Button className="gap-2">
                {t("nav_demo")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-sm font-medium text-primary">{t("hero_badge")}</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {t("hero_title_1")}{" "}
                <span className="text-primary">{t("hero_title_2")}</span>
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
                {t("hero_desc")}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/demo">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    <Play className="h-5 w-5" />
                    {t("hero_cta")}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  {t("hero_docs")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
                <Image src="/images/hero-dashboard.jpg" alt="FlowPay Dashboard" width={800} height={500} className="w-full" priority />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-border/50 bg-card p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("hero_badge_paid")}</p>
                    <p className="text-xs text-muted-foreground">{t("hero_badge_synced")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="border-y border-border/50 bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-sm text-muted-foreground">{t("tech_title")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["Fiserv", "Clover", "Twilio", "Claude AI", "Stripe"].map((partner) => (
              <div key={partner} className="text-xl font-bold text-muted-foreground/50 transition-colors hover:text-muted-foreground">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t("feat_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("feat_desc")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-y border-border/50 bg-muted/30 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t("how_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("how_desc")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-full hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
                )}
                <div className="mb-4 text-4xl font-bold text-primary/30">{step.number}</div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t("carousel_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("carousel_desc")}</p>
          </div>
          <div className="mx-auto max-w-4xl">
            <Carousel className="w-full">
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-2">
                        <div className="overflow-hidden rounded-lg">
                          <Image src={slide.src} alt={slide.title} width={800} height={450} className="aspect-video w-full object-cover" />
                        </div>
                        <div className="mt-4 px-4 pb-4 text-center">
                          <h3 className="text-lg font-semibold">{slide.title}</h3>
                          <p className="text-sm text-muted-foreground">{slide.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y border-border/50 bg-muted/30 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t("arch_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("arch_desc")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border/50 bg-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <Smartphone className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("arch_1_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("arch_1_desc")}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Server className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("arch_2_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("arch_2_desc")}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
                  <RefreshCw className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("arch_3_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("arch_3_desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t("test_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("test_desc")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} — {testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-border/50 bg-muted/30 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t("price_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("price_desc")}</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card className="border-border/50 bg-card">
              <CardContent className="p-8">
                <h3 className="mb-2 text-lg font-semibold">{t("price_starter")}</h3>
                <p className="mb-6 text-sm text-muted-foreground">{t("price_starter_desc")}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{t("price_starter_price")}</span>
                  <span className="text-muted-foreground">{t("price_starter_period")}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {starterFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">{t("price_cta")}</Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary bg-card">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                {t("price_popular")}
              </div>
              <CardContent className="p-8">
                <h3 className="mb-2 text-lg font-semibold">{t("price_pro")}</h3>
                <p className="mb-6 text-sm text-muted-foreground">{t("price_pro_desc")}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{t("price_pro_price")}</span>
                  <span className="text-muted-foreground">{t("price_pro_period")}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full">{t("price_cta")}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-16 lg:py-24">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">{t("cta_title")}</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">{t("cta_desc")}</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="gap-2 bg-background text-foreground hover:bg-background/90">
                  <Play className="h-5 w-5" />
                  {t("cta_demo")}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10">
                {t("cta_contact")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FlowPay Sync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hackathon Fiserv/Clover 2026 — Powered by Claude AI + Twilio + Clover API v3
            </p>
            <div className="flex gap-4">
              <Link href="/demo"><Button variant="ghost" size="sm">Demo</Button></Link>
              <Link href="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
