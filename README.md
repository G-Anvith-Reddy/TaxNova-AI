<div align="center">

# TAXNOVA AI  
Personal Wealth Tax Optimization Agent (FY 2025–26)

### Production Deployment  
https://taxnova-tara.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![State Management](https://img.shields.io/badge/State-Zustand-orange)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Overview

TAXNOVA AI is a production-ready full-stack Indian tax optimization platform built for FY 2025–26 (AY 2026–27).

The system implements a **strictly deterministic, rule-based tax engine** aligned with the Indian Income Tax Act.  

No AI or external APIs are used for tax computation.

Gemini AI is used only for educational advisory explanations and never for tax math.

---

## Core Modules

| Module | Functionality |
|--------|--------------|
| Tax Calculator | Independent Old vs New regime computation with breakdown |
| 80C Planner | Interactive allocation sliders with tax impact simulation |
| 80D Planner | Age-aware health insurance deduction optimizer |
| Regime Comparison | Side-by-side regime cards with savings banner |
| Dashboard | Income breakdown, expense analytics, tax efficiency score |
| Portfolio Tracker | 3-year & 5-year growth projections with allocation donut |
| Advance Tax | Installment schedule with 234B & 234C penalty logic |
| Expense Tracker | CSV upload with heuristic income & deduction detection |
| Tax Education | Transparent explanation of slabs, rebate and cess |
| PDF Report | Structured downloadable tax summary report |

---

## Tax Rules Implemented (FY 2025–26)

| Component | Rule Implemented |
|------------|----------------|
| Standard Deduction | ₹50,000 (Old) / ₹75,000 (New) |
| Section 80C | Maximum ₹1,50,000 |
| Section 80D | ₹25,000 (< 60) / ₹50,000 (≥ 60) |
| Section 87A Rebate | Up to ₹60,000 (New Regime, taxable ≤ ₹12L) |
| Cess | 4% on tax after rebate |

### Explicitly Excluded

- No GST  
- No Capital Gains  
- No Filing Automation  
- No Auto Regime Recommendation  
- No External Tax APIs  

---

## Deterministic Tax Engine

All tax calculations are computed using explicit slab logic:

- Slab-based base tax
- Deduction capping via `Math.min`
- Rebate applied before cess
- Cess applied after rebate
- Tax floor at zero

Core implementation:
