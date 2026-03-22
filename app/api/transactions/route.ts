import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit')) || 10
  const status = searchParams.get('status')
  let txs = [...store.transactions]
  if (status) txs = txs.filter(t => t.status === status)
  return NextResponse.json(txs.slice(0, limit))
}
