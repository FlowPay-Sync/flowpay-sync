"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "es" | "en"

const translations = {
  es: {
    // Nav
    nav_features: "Características",
    nav_how: "Cómo Funciona",
    nav_testimonials: "Testimonios",
    nav_pricing: "Precios",
    nav_login: "Iniciar Sesión",
    nav_demo: "Probar Demo",
    // Hero
    hero_badge: "Hackathon Fiserv/Clover 2026",
    hero_title_1: "Pagos Omnicanal para",
    hero_title_2: "Latinoamérica",
    hero_desc: "Conecta tus ventas de WhatsApp con tu terminal Clover POS. IA que parsea pedidos, genera links de pago y sincroniza todo automáticamente.",
    hero_cta: "Probar Demo Interactivo",
    hero_docs: "Ver Documentación",
    hero_badge_paid: "Pago Completado",
    hero_badge_synced: "Sincronizado con Clover",
    // Stats
    stat_transactions: "Transacciones Procesadas",
    stat_conversion: "Tasa de Conversión",
    stat_response: "Tiempo de Respuesta",
    stat_uptime: "Disponibilidad",
    // Tech
    tech_title: "Tecnologías que potencian FlowPay Sync",
    // Features
    feat_title: "Todo lo que necesitas para vender más",
    feat_desc: "Una plataforma completa que unifica tus canales de venta y automatiza el proceso de pago.",
    feat_1_title: "WhatsApp Zero-Click Bot",
    feat_1_desc: "IA que parsea pedidos automáticamente desde mensajes de WhatsApp. Sin formularios, sin fricción.",
    feat_2_title: "Clover POS Sync",
    feat_2_desc: "Sincronización automática con tu terminal Fiserv/Clover. Cada venta online aparece en tu POS.",
    feat_3_title: "Links de Pago Instantáneos",
    feat_3_desc: "Genera y comparte links de pago en segundos. El cliente paga sin descargar apps.",
    feat_4_title: "Analytics en Tiempo Real",
    feat_4_desc: "Dashboard con métricas de ventas, conversiones y actividad. Toma decisiones con datos.",
    feat_5_title: "Pagos Seguros",
    feat_5_desc: "Procesamiento de pagos con encriptación de nivel bancario. PCI DSS compliant.",
    feat_6_title: "Diseñado para LATAM",
    feat_6_desc: "Soporte para múltiples monedas y métodos de pago populares en Latinoamérica.",
    // How it works
    how_title: "Cómo Funciona",
    how_desc: "De mensaje de WhatsApp a venta registrada en tu POS en 4 simples pasos.",
    step_1_title: "Cliente envía pedido por WhatsApp",
    step_1_desc: "El cliente escribe su pedido de forma natural: 'Quiero 2 pizzas grandes y una coca'",
    step_2_title: "IA procesa el mensaje",
    step_2_desc: "Nuestro bot con Claude AI extrae productos, cantidades y calcula el total automáticamente",
    step_3_title: "Se genera link de pago",
    step_3_desc: "El sistema genera un link único con upsells inteligentes y lo envía al cliente",
    step_4_title: "Sincronización con Clover",
    step_4_desc: "Al completar el pago, la orden se registra automáticamente en tu terminal POS",
    // Carousel
    carousel_title: "Conoce la Plataforma",
    carousel_desc: "Explora las diferentes vistas y funcionalidades de FlowPay Sync.",
    slide_1_title: "Dashboard Principal",
    slide_1_desc: "Vista completa de tus métricas y transacciones",
    slide_2_title: "Bot de WhatsApp",
    slide_2_desc: "Conversación automática con clientes",
    slide_3_title: "Integración Clover",
    slide_3_desc: "Sincronización con tu terminal POS",
    slide_4_title: "Analytics Avanzado",
    slide_4_desc: "Reportes y métricas detalladas",
    // Architecture
    arch_title: "Arquitectura del Sistema",
    arch_desc: "Diseñado para escalar y manejar miles de transacciones simultáneas.",
    arch_1_title: "WhatsApp + Twilio",
    arch_1_desc: "Webhook que recibe mensajes y los procesa con Claude AI para extraer pedidos",
    arch_2_title: "FlowPay Backend",
    arch_2_desc: "API serverless en Next.js que orquesta todo el flujo de pagos y sincronización",
    arch_3_title: "Clover API v3",
    arch_3_desc: "Integración bidireccional con Fiserv/Clover para órdenes y pagos",
    // Testimonials
    test_title: "Lo que dicen nuestros usuarios",
    test_desc: "Negocios en toda Latinoamérica confían en FlowPay Sync.",
    test_1_name: "María García",
    test_1_role: "Dueña de Restaurante",
    test_1_loc: "Ciudad de México",
    test_1_content: "FlowPay transformó mi negocio. Antes perdía ventas por no poder procesar pedidos de WhatsApp rápido. Ahora todo es automático.",
    test_2_name: "Carlos Rodríguez",
    test_2_role: "Gerente de Tienda",
    test_2_loc: "Buenos Aires",
    test_2_content: "La sincronización con Clover es perfecta. Mi inventario siempre está actualizado sin importar si la venta es online o en tienda.",
    test_3_name: "Ana Martínez",
    test_3_role: "Emprendedora",
    test_3_loc: "Lima",
    test_3_content: "Los upsells inteligentes aumentaron mi ticket promedio en un 23%. El ROI fue inmediato.",
    // Pricing
    price_title: "Precios Simples y Transparentes",
    price_desc: "Sin costos ocultos. Cancela cuando quieras.",
    price_starter: "Starter",
    price_starter_desc: "Para negocios que comienzan",
    price_starter_price: "$49",
    price_starter_period: "/mes",
    price_pro: "Pro",
    price_pro_desc: "Para negocios en crecimiento",
    price_pro_price: "$149",
    price_pro_period: "/mes",
    price_cta: "Comenzar Ahora",
    price_popular: "Mas Popular",
    // CTA
    cta_title: "Listo para transformar tus ventas?",
    cta_desc: "Únete a cientos de negocios en LATAM que ya procesan pagos con FlowPay Sync.",
    cta_demo: "Probar Demo Gratis",
    cta_contact: "Hablar con Ventas",
    // Footer
    footer_rights: "Todos los derechos reservados.",
    footer_product: "Producto",
    footer_company: "Empresa",
    footer_legal: "Legal",
    // Demo page
    demo_subtitle: "Demo Interactivo",
    demo_restart: "Reiniciar",
    demo_back: "Volver",
    demo_step_1: "Mensaje",
    demo_step_2: "IA Procesa",
    demo_step_3: "Link Pago",
    demo_step_4: "Sync Clover",
    demo_examples_title: "Ejemplos de Pedidos",
    demo_examples_desc: "Haz clic en un ejemplo para probarlo",
    demo_activity_title: "Actividad del Sistema",
    demo_activity_desc: "Eventos en tiempo real",
    demo_arch_title: "Arquitectura del Flujo",
    demo_whatsapp: "WhatsApp",
    demo_flowpay: "FlowPay AI",
    demo_clover: "Clover POS",
    demo_online: "en linea",
    demo_placeholder: "Escribe tu pedido...",
    demo_pay_title: "Link de Pago Seguro",
    demo_pay_btn: "Pagar",
    demo_pay_copy: "Copiar Link",
    demo_products: "productos",
    demo_complete_title: "Pago Completado",
    demo_complete_desc: "Tu orden ya esta en preparacion",
    demo_synced: "Sincronizado con Clover POS",
    demo_reset: "Probar Otro Pedido",
    demo_init: "Sistema Inicializado",
    demo_init_desc: "WhatsApp Bot conectado y listo para recibir pedidos",
    demo_greeting: "Hola! Soy el asistente de FlowPay. Escribe tu pedido como lo harias por WhatsApp.",
    demo_ex_1: "Quiero 2 pizzas grandes de pepperoni y una coca cola",
    demo_ex_2: "Me das 3 hamburguesas con papas y 2 malteadas",
    demo_ex_3: "1 ensalada cesar, 2 jugos de naranja y postre",
    demo_guide_1_title: "Escribe tu pedido",
    demo_guide_1_desc: "Escribe cualquier pedido como lo harias a un amigo por WhatsApp. Usa los ejemplos de arriba o escribe el tuyo.",
    demo_guide_2_title: "Observa la IA en accion",
    demo_guide_2_desc: "Claude AI parsea tu mensaje, extrae productos y calcula el total automaticamente.",
    demo_guide_3_title: "Recibe tu link de pago",
    demo_guide_3_desc: "El sistema genera un link unico. En produccion, este link se enviaria al cliente por WhatsApp.",
    demo_guide_4_title: "Sync con Clover completado",
    demo_guide_4_desc: "El pago quedo registrado en el terminal POS. El negocio ve la venta en tiempo real.",
    demo_guide_label: "Guia",
    // Dashboard
    dash_title: "Dashboard",
    dash_create: "Crear Link de Pago",
    dash_recent: "Transacciones Recientes",
    dash_activity: "Actividad Reciente",
    dash_new_tx: "Nueva Transaccion",
  },
  en: {
    // Nav
    nav_features: "Features",
    nav_how: "How It Works",
    nav_testimonials: "Testimonials",
    nav_pricing: "Pricing",
    nav_login: "Sign In",
    nav_demo: "Try Demo",
    // Hero
    hero_badge: "Fiserv/Clover Hackathon 2026",
    hero_title_1: "Omnichannel Payments for",
    hero_title_2: "Latin America",
    hero_desc: "Connect your WhatsApp sales with your Clover POS terminal. AI that parses orders, generates payment links, and syncs everything automatically.",
    hero_cta: "Try Interactive Demo",
    hero_docs: "View Documentation",
    hero_badge_paid: "Payment Completed",
    hero_badge_synced: "Synced with Clover",
    // Stats
    stat_transactions: "Processed Transactions",
    stat_conversion: "Conversion Rate",
    stat_response: "Response Time",
    stat_uptime: "Uptime",
    // Tech
    tech_title: "Technologies powering FlowPay Sync",
    // Features
    feat_title: "Everything you need to sell more",
    feat_desc: "A complete platform that unifies your sales channels and automates the payment process.",
    feat_1_title: "WhatsApp Zero-Click Bot",
    feat_1_desc: "AI that automatically parses orders from WhatsApp messages. No forms, no friction.",
    feat_2_title: "Clover POS Sync",
    feat_2_desc: "Automatic sync with your Fiserv/Clover terminal. Every online sale appears in your POS.",
    feat_3_title: "Instant Payment Links",
    feat_3_desc: "Generate and share payment links in seconds. Customers pay without downloading apps.",
    feat_4_title: "Real-Time Analytics",
    feat_4_desc: "Dashboard with sales metrics, conversions, and activity. Make data-driven decisions.",
    feat_5_title: "Secure Payments",
    feat_5_desc: "Payment processing with bank-level encryption. PCI DSS compliant.",
    feat_6_title: "Built for LATAM",
    feat_6_desc: "Support for multiple currencies and popular payment methods across Latin America.",
    // How it works
    how_title: "How It Works",
    how_desc: "From WhatsApp message to POS registered sale in 4 simple steps.",
    step_1_title: "Customer sends order via WhatsApp",
    step_1_desc: "The customer writes their order naturally: 'I want 2 large pizzas and a coke'",
    step_2_title: "AI processes the message",
    step_2_desc: "Our Claude AI bot extracts products, quantities and calculates the total automatically",
    step_3_title: "Payment link is generated",
    step_3_desc: "The system generates a unique link with smart upsells and sends it to the customer",
    step_4_title: "Sync with Clover",
    step_4_desc: "When payment is complete, the order is automatically registered in your POS terminal",
    // Carousel
    carousel_title: "Explore the Platform",
    carousel_desc: "Discover the different views and features of FlowPay Sync.",
    slide_1_title: "Main Dashboard",
    slide_1_desc: "Full view of your metrics and transactions",
    slide_2_title: "WhatsApp Bot",
    slide_2_desc: "Automatic customer conversation",
    slide_3_title: "Clover Integration",
    slide_3_desc: "Sync with your POS terminal",
    slide_4_title: "Advanced Analytics",
    slide_4_desc: "Detailed reports and metrics",
    // Architecture
    arch_title: "System Architecture",
    arch_desc: "Designed to scale and handle thousands of simultaneous transactions.",
    arch_1_title: "WhatsApp + Twilio",
    arch_1_desc: "Webhook that receives messages and processes them with Claude AI to extract orders",
    arch_2_title: "FlowPay Backend",
    arch_2_desc: "Serverless API in Next.js that orchestrates the entire payment and sync flow",
    arch_3_title: "Clover API v3",
    arch_3_desc: "Bidirectional integration with Fiserv/Clover for orders and payments",
    // Testimonials
    test_title: "What our users say",
    test_desc: "Businesses across Latin America trust FlowPay Sync.",
    test_1_name: "Maria Garcia",
    test_1_role: "Restaurant Owner",
    test_1_loc: "Mexico City",
    test_1_content: "FlowPay transformed my business. I used to lose sales because I couldn't process WhatsApp orders fast. Now everything is automatic.",
    test_2_name: "Carlos Rodriguez",
    test_2_role: "Store Manager",
    test_2_loc: "Buenos Aires",
    test_2_content: "The sync with Clover is perfect. My inventory is always up to date regardless of whether the sale is online or in-store.",
    test_3_name: "Ana Martinez",
    test_3_role: "Entrepreneur",
    test_3_loc: "Lima",
    test_3_content: "Smart upsells increased my average ticket by 23%. The ROI was immediate.",
    // Pricing
    price_title: "Simple and Transparent Pricing",
    price_desc: "No hidden fees. Cancel anytime.",
    price_starter: "Starter",
    price_starter_desc: "For businesses just starting out",
    price_starter_price: "$49",
    price_starter_period: "/mo",
    price_pro: "Pro",
    price_pro_desc: "For growing businesses",
    price_pro_price: "$149",
    price_pro_period: "/mo",
    price_cta: "Get Started",
    price_popular: "Most Popular",
    // CTA
    cta_title: "Ready to transform your sales?",
    cta_desc: "Join hundreds of businesses in LATAM already processing payments with FlowPay Sync.",
    cta_demo: "Try Free Demo",
    cta_contact: "Talk to Sales",
    // Footer
    footer_rights: "All rights reserved.",
    footer_product: "Product",
    footer_company: "Company",
    footer_legal: "Legal",
    // Demo page
    demo_subtitle: "Interactive Demo",
    demo_restart: "Restart",
    demo_back: "Back",
    demo_step_1: "Message",
    demo_step_2: "AI Processes",
    demo_step_3: "Pay Link",
    demo_step_4: "Sync Clover",
    demo_examples_title: "Order Examples",
    demo_examples_desc: "Click an example to try it",
    demo_activity_title: "System Activity",
    demo_activity_desc: "Real-time events",
    demo_arch_title: "Flow Architecture",
    demo_whatsapp: "WhatsApp",
    demo_flowpay: "FlowPay AI",
    demo_clover: "Clover POS",
    demo_online: "online",
    demo_placeholder: "Write your order...",
    demo_pay_title: "Secure Payment Link",
    demo_pay_btn: "Pay",
    demo_pay_copy: "Copy Link",
    demo_products: "products",
    demo_complete_title: "Payment Completed",
    demo_complete_desc: "Your order is already being prepared",
    demo_synced: "Synced with Clover POS",
    demo_reset: "Try Another Order",
    demo_init: "System Initialized",
    demo_init_desc: "WhatsApp Bot connected and ready to receive orders",
    demo_greeting: "Hi! I'm the FlowPay assistant. Write your order as you would on WhatsApp.",
    demo_ex_1: "I want 2 large pepperoni pizzas and a coke",
    demo_ex_2: "Give me 3 burgers with fries and 2 milkshakes",
    demo_ex_3: "1 caesar salad, 2 orange juices and dessert",
    demo_guide_1_title: "Write your order",
    demo_guide_1_desc: "Write any order as you would to a friend on WhatsApp. Use the examples above or write your own.",
    demo_guide_2_title: "Watch the AI in action",
    demo_guide_2_desc: "Claude AI parses your message, extracts products and calculates the total automatically.",
    demo_guide_3_title: "Receive your payment link",
    demo_guide_3_desc: "The system generates a unique link. In production, this link would be sent to the customer via WhatsApp.",
    demo_guide_4_title: "Clover sync completed",
    demo_guide_4_desc: "The payment has been registered in the POS terminal. The business sees the sale in real time.",
    demo_guide_label: "Guide",
    // Dashboard
    dash_title: "Dashboard",
    dash_create: "Create Payment Link",
    dash_recent: "Recent Transactions",
    dash_activity: "Recent Activity",
    dash_new_tx: "New Transaction",
  },
} as const

export type TranslationKey = keyof typeof translations.es

interface I18nContextType {
  locale: Locale
  t: (key: TranslationKey) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextType>({
  locale: "es",
  t: (key) => translations.es[key],
  setLocale: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
  }, [])

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? translations.es[key],
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
