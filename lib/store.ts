// lib/store.ts
// Estado en memoria — persiste mientras corre el servidor

export interface Transaction {
  id: string
  product: string
  amount: number
  customer: string
  email?: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  paymentMethod: string
  cloverId?: string
  linkId?: string
}

export interface PaymentLink {
  id: string
  product: string
  amount: number
  url: string
  whatsappUrl: string
  upsell: string
  createdAt: string
  status: 'active' | 'paid' | 'expired'
}

export const store = {
  transactions: [] as Transaction[],
  links: [] as PaymentLink[],
  metrics: {
    totalRevenue: 45231.89,
    totalSales: 2350,
    activeLinks: 0,
    uniqueCustomers: 573,
    revenueChange: 20.1,
    salesChange: 180.1,
  },
  customers: new Set<string>(),
}

export function addTransaction(data: Omit<Transaction, "id" | "date">): Transaction {
  const tx: Transaction = {
    ...data,
    id: `TXN-${String(store.transactions.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
  }
  store.transactions.unshift(tx)
  if (tx.status === 'completed') {
    store.metrics.totalRevenue += tx.amount
    store.metrics.totalSales += 1
  }
  if (tx.email) {
    store.customers.add(tx.email)
    store.metrics.uniqueCustomers = store.customers.size + 570
  }
  return tx
}

export function addLink(link: PaymentLink): void {
  store.links.unshift(link)
  store.metrics.activeLinks = store.links.filter(l => l.status === 'active').length
}

export function markLinkPaid(linkId: string): void {
  const link = store.links.find(l => l.id === linkId)
  if (link) {
    link.status = 'paid'
    store.metrics.activeLinks = store.links.filter(l => l.status === 'active').length
  }
}
