# InsightIQ — AI Analytics Dashboard

> Upload any CSV → get instant charts, KPIs, and an AI analyst powered by Claude.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06b6d4?logo=tailwindcss)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange)

---

## Features

- 📁 **CSV Upload** — drag & drop any CSV file
- 📊 **Auto Charts** — line, bar, and pie charts generated instantly
- 🔢 **KPI Cards** — sum, avg, min, max for all numeric columns
- 🤖 **AI Chat** — ask questions about your data in plain English (Claude API)
- 📋 **Paginated Data Table** — browse raw rows with pagination
- 🌙 **Dark mode** — fully dark, production-grade UI

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| CSV Parsing | PapaParse |
| AI | Claude (Anthropic SDK) |
| Icons | Lucide React |
| Deploy | Vercel |

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/insightiq.git
cd insightiq
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key at: https://console.anthropic.com

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npx vercel
```

Add `ANTHROPIC_API_KEY` in your Vercel project environment variables.

---

## Usage

1. Open the app and drag & drop any `.csv` file
2. Charts and KPI cards render automatically
3. Use the AI Chat panel to ask questions like:
   - *"What are the key trends in this data?"*
   - *"Which category has the highest values?"*
   - *"Summarize this dataset for me"*

---

## Project Structure

```
insightiq/
├── app/
│   ├── api/insights/route.ts   # Claude AI endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main dashboard
├── components/
│   ├── AIChat.tsx              # AI chat interface
│   ├── Charts.tsx              # Line, Bar, Pie charts
│   ├── DataTable.tsx           # Paginated table
│   ├── FileUpload.tsx          # CSV drag & drop
│   └── KPICard.tsx             # Metric cards
├── lib/
│   └── dataUtils.ts            # Data parsing & analysis
├── .env.example
└── README.md
```

---

Built by [Pushpendra Singh](https://github.com/Pushpendra33)
