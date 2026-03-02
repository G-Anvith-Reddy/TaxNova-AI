<div align="center">

# 🧾 TAXNOVA

### Intelligent, Deterministic Tax Planning for the Modern Indian Taxpayer

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## ✨ Overview

**TAXNOVA** is a production-ready, full-stack Indian tax planning application built with Next.js and TypeScript. It uses a **strictly deterministic, rule-based tax engine** — no LLMs, no guesswork, just accurate calculations based on the Indian Income Tax Act.

> 🔒 **Strict Rule**: All tax calculations are deterministic. Gemini AI is used **only** for educational investment advisory text — never for any tax math.

---

## 🚀 Features

| Module | Description |
|---|---|
| **Tax Calculator** | Side-by-side Old vs New regime comparison with step-by-step breakdown |
| **80C Planner** | Interactive slider-based planner with donut chart and 5-year growth projections |
| **80D Planner** | Health insurance deduction optimizer with age-aware limits |
| **Advance Tax** | Quarterly installment calculator with 234B/234C interest penalties |
| **Expense Tracker** | CSV bank statement upload with auto-categorization and monthly trend charts |
| **AI Advisory** | Personalized tax guidance — rule-based by default, Gemini-enhanced when available |
| **Tax Education** | Explanations of tax concepts, slabs, and deduction rules |
| **PDF Report** | Downloadable comprehensive tax report |

---

## 🧱 Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + TailwindCSS
- **State Management**: Zustand with `persist` middleware (localStorage)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **CSV Parsing**: PapaParse (robust, heuristic column detection)
- **PDF**: jsPDF + html2canvas
- **AI Advisory**: Google Gemini 2.0 Flash (optional enhancement only)

---

## 📐 Tax Rules Implemented

| Rule | Details |
|---|---|
| Standard Deduction | ₹50,000 (Old Regime) / ₹75,000 (New Regime) |
| Section 80C | Max ₹1,50,000 — ELSS, PPF, EPF, NPS, Tax-Saver FD, NSC |
| Section 80D | ₹25,000 (age < 60) / ₹50,000 (age ≥ 60) |
| Section 87A Rebate | Up to ₹60,000 on tax payable (New Regime ≤ ₹12L) |
| Cess | 4% Health & Education Cess on tax after rebate |

> ❌ No GST · No Capital Gains · No Filing Automation · No External Tax APIs

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/taxnova.git
cd taxnova

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add your Gemini API key (optional)
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional — AI Advisory is fully functional without this
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

Get a free API key at [Google AI Studio](https://aistudio.google.com/). The app works completely without it — the advisory module falls back to a rich rule-based engine automatically.

> ⚠️ **Never commit `.env.local` to GitHub.** It is already in `.gitignore`.

---

## 📁 Project Structure

```
taxnova/
├── src/
│   ├── app/
│   │   ├── dashboard/        # Main dashboard with animated metrics
│   │   ├── calculator/       # Tax calculator with breakdown toggle
│   │   ├── planner-80c/      # 80C investment planner
│   │   ├── planner-80d/      # 80D health insurance planner
│   │   ├── compare/          # Old vs New regime comparison
│   │   ├── advance-tax/      # Quarterly installment calculator
│   │   ├── expenses/         # CSV expense tracker
│   │   ├── advisory/         # AI + rule-based advisory
│   │   ├── education/        # Tax education module
│   │   ├── report/           # PDF report generator
│   │   ├── profile/          # User profile + CSV upload
│   │   ├── login/            # Authentication page
│   │   └── api/advisory/     # Gemini API route (server-side only)
│   ├── components/
│   │   ├── Sidebar.tsx        # Navigation sidebar with sign-out
│   │   └── LayoutWrapper.tsx  # Route protection + layout
│   ├── store/
│   │   └── useStore.ts        # Zustand global state with persistence
│   └── utils/
│       ├── taxCalculator.ts   # Deterministic tax engine
│       └── csvParser.ts       # Heuristic bank statement parser
```

---

## 🎨 Design System

- **Animated gradient background** with `gradientShift` keyframe animation
- **Glassmorphism cards** — `backdrop-blur-lg`, `bg-white/5`, `border-white/10`
- **Framer Motion** page transitions and micro-interactions
- Dark mode by default — Indian number formatting (`en-IN` locale)

---

## 🔐 Authentication & Persistence

- Session stored in browser `localStorage` via Zustand `persist`
- Profile data, expenses, and allocations survive page refreshes
- Sign out button in sidebar clears all state securely
- Route protection — unauthenticated users redirected to `/login`

---

## 🧪 CSV Format Support

Upload any bank statement CSV. The parser auto-detects columns using heuristics:

```csv
Date,Description,Amount,Transaction_Type
01-04-2024,Monthly Salary Credit,100000,Credit
01-04-2024,Electricity Bill,-2715,Debit
03-04-2024,Swiggy/Zomato Food Expense,-686,Debit
```

Supports: column name variations, negative amounts for debits, separate Debit/Credit columns, and many bank statement formats.

---

## 📄 License

MIT © 2025 TAXNOVA

---

<div align="center">
  Built with ❤️ for Indian taxpayers · <strong>Strictly Deterministic · No Tax Guesswork</strong>
</div>
