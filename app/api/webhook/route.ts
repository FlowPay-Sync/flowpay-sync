import { NextResponse } from 'next/server'
import { addTransaction, markLinkPaid } from '@/lib/store'

async function syncToClover(product: string, amount: number, customer?: string) {
  const mId = process.env.CLOVER_MERCHANT_ID
  const token = process.env.CLOVER_API_TOKEN
  if (!mId || !token) return { id: `SIM_${Date.now()}` } // modo simulado
  try {
    const res = await fetch(
      `https://apisandbox.dev.clover.com/v3/merchants/${mId}/orders`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product,
          total: Math.round(Number(amount) * 100),
          note: `FlowPay${customer ? ` — ${customer}` : ""}`,
        })
      }
    )
    return res.ok ? res.json() : { id: `ERR_${Date.now()}` }
  } catch { return { id: `ERR_${Date.now()}` } }
}

export async function POST(req: Request) {
  try {
    const {
      product,
      amount,
      customer = 'Cliente',
      email,
      linkId,
      status = 'completed',
      paymentMethod = 'Clover POS'
    } = await req.json()

    if (!product || !amount) {
      return NextResponse.json({ error: 'product y amount requeridos' }, { status: 400 })
    }

    const clover = await syncToClover(product, amount, customer)
    const tx = addTransaction({
      product,
      amount: Number(amount),
      customer,
      email,
      status,
      paymentMethod,
      cloverId: clover.id,
      linkId
    })
    if (linkId) markLinkPaid(linkId)

    return NextResponse.json({
      success: true,
      transactionId: tx.id,
      cloverId: clover.id
    })
  } catch { return NextResponse.json({ error: 'Error' }, { status: 500 }) }
}

// Verificar que el webhook está activo:
export async function GET() {
  return NextResponse.json({ status: 'FlowPay webhook activo ✓' })
}
