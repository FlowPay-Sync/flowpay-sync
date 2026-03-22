# FlowPay Sync

**FlowPay Sync** is an innovative payment management and link generation platform built for the **Aleph Hackathon**. It is designed to boost payment conversions and provide smart upselling directly through WhatsApp integrations, leveraging **Fiserv** and **Clover** ecosystems.

## 🚀 Features

- **Smart Payment Links:** Generate instant payment links customized for each product or service.
- **Dynamic Upselling Engine:** Automatically suggests complementary products (e.g., drinks for meals, yearly subs for plans) based on the transaction content, maximizing the perceived value and conversion rates.
- **WhatsApp Integration:** Easily share one-click payment links with customers via WhatsApp, complete with pre-filled smart text.
- **Merchant Dashboard:** Comprehensive and responsive analytics dashboard to track revenue, total sales, active links, and transaction history.
- **Clover Integration Ready:** Built with `cloverId` references to easily integrate into the Clover Point of Sale system.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server API Routes)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- **Charts:** Recharts
- **State Management & Mocked Storage:** Custom in-memory store configured for fast hackathon demoing.
- **Validation:** Zod & React Hook Form

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (Pages & API routes)
│   ├── api/              # RESTful endpoints (create-link, transactions, metrics, webhooks)
│   ├── dashboard/        # Merchant analytics dashboard
│   ├── pay/[linkId]/     # Public payment checkout pages
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── dashboard/        # Dashboard-specific blocks (charts, tables, cards)
│   └── ui/               # Base shadcn/ui components (buttons, dialogs, etc.)
├── lib/                  # Utilities, mock store, and internationalization config
└── public/               # Static assets
```

## 🛠️ Getting Started

First, install the dependencies using `pnpm` (or `npm`, `yarn`, `bun`):

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Or navigate directly to `http://localhost:3000/dashboard` to view the merchant dashboard.

---

*Built with ❤️ for the Aleph Hackathon 2026.*