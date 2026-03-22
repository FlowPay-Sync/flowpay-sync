import { NextResponse } from 'next/server'
import { addLink } from '@/lib/store'

async function parseOrderWithAI(text: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Modo simulado sin API key
    return {
      items: [{ name: text.substring(0, 50), qty: 1, note: '' }],
      address: 'Sin dirección',
      total: 25.00
    }
  }
  
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: `Eres un parser de pedidos para restaurantes LATAM.
                 Extrae del texto: items (con qty y notas), total estimado, dirección.
                 Responde SOLO JSON:
                 {"items":[{"name":"","qty":1,"note":""}],"address":"","total":0}`,
        messages: [{ role: 'user', content: text }]
      })
    })
    const data = await res.json()
    return JSON.parse(data.content[0].text)
  } catch {
    return {
      items: [{ name: text.substring(0, 50), qty: 1, note: '' }],
      address: 'Sin dirección',
      total: 25.00
    }
  }
}

async function replyWhatsApp(to: string, body: string) {
  const { TWILIO_SID: sid, TWILIO_TOKEN: tok, TWILIO_WA: from } = process.env
  if (!sid || !tok || !from) return
  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${tok}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ From: from, To: to, Body: body })
    }
  )
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const body = form.get('Body') as string
    const from = form.get('From') as string

    const order = await parseOrderWithAI(body)

    const linkId = `fp_${Date.now()}`
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const payUrl = `${base}/pay/${linkId}`

    const itemList = order.items
      .map((i: { name: string; qty: number; note?: string }) => 
        `x${i.qty} ${i.name}${i.note ? ` (${i.note})` : ""}`)
      .join('\n')

    const reply = [
      `Pedido recibido!\n${itemList}`,
      `Total: $${order.total}`,
      `Paga aquí: ${payUrl}`
    ].join('\n\n')

    await replyWhatsApp(from, reply)

    // Guardar el link
    addLink({
      id: linkId,
      product: order.items.map((i: { name: string }) => i.name).join(', '),
      amount: order.total,
      url: payUrl,
      whatsappUrl: '',
      upsell: '',
      createdAt: new Date().toISOString(),
      status: 'active'
    })

    // TwiML vacío — evita respuesta duplicada de Twilio
    return new Response('<Response/>', { headers: { 'Content-Type': 'text/xml' } })
  } catch {
    return NextResponse.json({ error: 'Error procesando mensaje' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'WhatsApp webhook activo ✓' })
}
