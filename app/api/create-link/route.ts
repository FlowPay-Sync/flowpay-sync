import { NextResponse } from 'next/server'
import { addLink, type PaymentLink } from '@/lib/store'

function getUpsell(product: string, amount: number): string {
  const p = product.toLowerCase()
  const extra = (amount * 0.2).toFixed(2)
  if (p.includes('pizza') || p.includes('lomo') || p.includes('comida'))
    return `Agrega bebida por solo +$${extra} — 3x valor percibido`
  if (p.includes('café') || p.includes('cafe') || p.includes('coffee'))
    return `Combo desayuno +$${extra} — el 68% lo elige`
  if (p.includes('plan') || p.includes('subscription'))
    return `Plan anual: ahorra 30% — $${(amount * 10 * 0.7).toFixed(0)}/año`
  if (amount > 100)
    return `Cuotas sin interés disponibles — aumenta conversión 40%`
  return `Paga en segundos desde tu celular`
}

export async function POST(req: Request) {
  try {
    const { product, amount } = await req.json()
    if (!product?.trim() || !amount) {
      return NextResponse.json({ error: 'product y amount requeridos' }, { status: 400 })
    }
    const linkId = `fp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const paymentUrl = `${base}/pay/${linkId}?p=${encodeURIComponent(product)}&a=${amount}`
    const upsell = getUpsell(product, Number(amount))
    const waMessage = [
      `Hola! Tu pago de *${product}* por *$${Number(amount).toFixed(2)}*`,
      `Paga aquí: ${paymentUrl}`,
      `${upsell}`,
      `_Powered by FlowPay Sync + Fiserv_`
    ].join('\n\n')
    const link: PaymentLink = {
      id: linkId,
      product: product.trim(),
      amount: Number(amount),
      url: paymentUrl,
      whatsappUrl: `https://wa.me/?text=${encodeURIComponent(waMessage)}`,
      upsell,
      createdAt: new Date().toISOString(),
      status: 'active',
    }
    addLink(link)
    return NextResponse.json({ success: true, link })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
