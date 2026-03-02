# TAXNOVA AI  
Personal Wealth Tax Optimization Agent (FY 2025–26)

**Production Deployment**  
https://taxnova-tara.vercel.app

---

## Overview

TAXNOVA AI is a production-ready full-stack Indian tax optimization platform built for FY 2025–26 (AY 2026–27).

The system implements a strictly deterministic, rule-based tax engine aligned with the Indian Income Tax Act. No AI models or external APIs are used for tax computation.

Gemini AI is used only for educational advisory explanations and never for tax math.

---

## Core Modules

| Module | Functionality |
|--------|--------------|
| Tax Calculator | Independent Old vs New regime computation with detailed breakdown |
| 80C Planner | Interactive allocation sliders with real-time tax impact simulation |
| 80D Planner | Age-aware health insurance deduction optimizer |
| Regime Comparison | Side-by-side regime cards with savings comparison |
| Dashboard | Income analytics, expense trends, tax efficiency metrics |
| Portfolio Tracker | 3-year and 5-year compounding projections with allocation visualization |
| Advance Tax | Installment schedule with Sections 234B and 234C penalty logic |
| Expense Tracker | CSV upload with heuristic income and deduction detection |
| Tax Education | Transparent explanation of slabs, rebate, and cess |
| PDF Report | Structured downloadable tax summary report |

---

## Tax Rules Implemented (FY 2025–26)

| Component | Rule Implemented |
|------------|----------------|
| Standard Deduction | ₹50,000 (Old) / ₹75,000 (New) |
| Section 80C | Maximum ₹1,50,000 |
| Section 80D | ₹25,000 (Age < 60) / ₹50,000 (Age ≥ 60) |
| Section 87A Rebate | Up to ₹60,000 (New Regime, taxable income ≤ ₹12L) |
| Cess | 4% on tax after rebate |

### Explicitly Excluded

- No GST  
- No Capital Gains  
- No Filing Automation  
- No Automatic Regime Recommendation  
- No External Tax APIs  

---

## Deterministic Tax Engine

All tax calculations are computed using explicit slab logic:

- Slab-based base tax  
- Deduction capping using `Math.min()`  
- Rebate applied before cess  
- Cess applied after rebate  
- Tax never allowed below zero  

Core logic modules:

`src/utils/taxCalculator.ts`  
`src/utils/csvParser.ts`

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Charts | Recharts |
| State Management | Zustand (persistent storage) |
| PDF Generation | jsPDF + html2canvas |
| AI Advisory | Google Gemini (server-side only) |

---

## Security & Integrity

- Fully deterministic tax engine  
- No external tax computation APIs  
- Transparent slab and deduction logic  
- Environment variables secured via `.env.local`  
- No financial data transmitted externally  

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/G-Anvith-Reddy/TaxNova-AI.git
cd TaxNova-AI
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Optional AI advisory configuration:

Create `.env.local` and add:

```env
GEMINI_API_KEY=your_key_here
```

---

## License

MIT License
