import { NextResponse } from 'next/server';

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ── Conservative Gemini usage controls ───────────────────────────────────────
const responseCache = new Map<string, { advice: string; timestamp: number; isAI: boolean }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const COOLDOWN_MS = 90 * 1000;      // 90 seconds between live Gemini calls
let lastApiCallTime = 0;

function profileKey(income: number, age: number, risk: string, r80C: number, r80D: number) {
    const round = (n: number) => Math.round(n / 10000) * 10000;
    return `${round(income)}_${age}_${risk}_${round(r80C)}_${round(r80D)}`;
}

// ── Rich Rule-Based Advisory Engine ──────────────────────────────────────────
// This always produces meaningful advice — no API call needed.
function generateRuleBasedAdvice(
    income: number, age: number, risk: string,
    remaining80C: number, remaining80D: number
): string {
    const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
    const incomeLakh = income / 100000;
    const isNewBetter = income <= 1500000; // Rough heuristic: new regime better ≤₹15L without full deductions

    // Instrument suggestions by risk
    const instruments80C: Record<string, string[]> = {
        low: ['Public Provident Fund (PPF) — 7.1% p.a., sovereign guarantee, 15-year lock-in', 'Tax-Saving FD (Bank) — 6.0–7.0% p.a., 5-year lock-in', 'National Savings Certificate (NSC) — 7.7% p.a., 5-year'],
        moderate: ['PPF — 7.1% p.a., safest long-term option', 'ELSS Mutual Funds — 10–14% historical CAGR, only 3-year lock-in (shortest among 80C)', 'NPS Tier 1 — market-linked, additional ₹50k deduction under 80CCD(1B)'],
        high: ['ELSS Mutual Funds — highest growth potential, 3-year lock-in', 'NPS with aggressive equity allocation (75% E choice) — best for long-term', 'Unit Linked Insurance Plan (ULIP) — market-linked with insurance cover'],
    };

    const suggestions = instruments80C[risk] || instruments80C['moderate'];

    let lines: string[] = [];

    lines.push(`## 📊 Personalised Tax Advisory`);
    lines.push(`**Income:** ${fmt(income)} | **Age:** ${age} | **Risk:** ${risk.charAt(0).toUpperCase() + risk.slice(1)}`);
    lines.push('');

    // ── Section 1: Regime Recommendation ─────────────────────────────────────
    lines.push(`### 🏛️ Regime Recommendation`);
    if (income <= 1200000) {
        lines.push(`At ${fmt(income)}, the **New Tax Regime** is likely best. Income up to ₹12L attracts zero tax after the ₹75,000 standard deduction and full 87A rebate — you pay **₹0 in tax**.`);
    } else if (income <= 1500000 && remaining80C < 50000) {
        lines.push(`At ${fmt(income)} with limited remaining 80C/80D deductions, the **New Regime** is generally better (lower slab rates, no deduction complexities).`);
    } else if (income <= 1500000) {
        lines.push(`At ${fmt(income)}, both regimes are competitive. If you can fully utilize your remaining ${fmt(remaining80C + remaining80D)} in deductions, the **Old Regime** saves more tax.`);
    } else {
        lines.push(`At ${fmt(income)}, the **Old Regime** with maximum deductions (80C + 80D + Standard Deduction) typically saves ₹40,000–₹80,000 more annually than the New Regime.`);
    }
    lines.push('');

    // ── Section 2: 80C Utilization ────────────────────────────────────────────
    if (remaining80C > 0) {
        lines.push(`### 💰 Section 80C — Invest ${fmt(remaining80C)} More`);
        lines.push(`You have **${fmt(remaining80C)}** unused out of the ₹1.5L cap. Best options for your **${risk} risk** profile:`);
        suggestions.forEach(s => lines.push(`- ${s}`));
        const taxSaved = Math.min(remaining80C, 150000) * (incomeLakh > 10 ? 0.312 : incomeLakh > 5 ? 0.208 : 0.052);
        lines.push(`> Fully utilising 80C could save you approximately **${fmt(taxSaved)}** in tax (including cess).`);
    } else {
        lines.push(`### 💰 Section 80C — Fully Utilized ✓`);
        lines.push(`You have maximized the ₹1.5L 80C deduction. Well done!`);
    }
    lines.push('');

    // ── Section 3: 80D ────────────────────────────────────────────────────────
    const max80D = age >= 60 ? 50000 : 25000;
    if (remaining80D > 0) {
        lines.push(`### 🏥 Section 80D — Add ${fmt(remaining80D)} in Health Coverage`);
        lines.push(`Your 80D limit is ${fmt(max80D)} (${age >= 60 ? 'senior citizen rate' : 'standard rate'}). You can add more health insurance to save:`);
        if (age < 45) lines.push(`- **Family floater plan** (₹5L–₹10L cover): ~₹8,000–₹15,000/year premium`);
        else lines.push(`- **Critical illness rider** or top-up plan recommended at age ${age}`);
        lines.push(`- **Parents' health insurance** — if parents are 60+, an additional ₹50,000 deduction is available under 80D`);
    } else {
        lines.push(`### 🏥 Section 80D — Fully Utilized ✓`);
        lines.push(`Health insurance deductions for this year are maximized.`);
    }
    lines.push('');

    // ── Section 4: Tips ───────────────────────────────────────────────────────
    lines.push(`### 💡 Tax Planning Tips`);
    if (age < 35) lines.push(`- **Start SIPs in ELSS early** — 3-year lock-in is short, and compounding over 20+ years is powerful`);
    if (income > 1000000) lines.push(`- **Consider NPS** — Extra ₹50,000 deduction under 80CCD(1B) is available *over and above* the ₹1.5L 80C limit`);
    lines.push(`- **Advance Tax** — If total tax liability >₹10,000, pay in 4 installments to avoid 234B/234C interest`);
    lines.push(`- **Keep all receipts** — Premium receipts, rent receipts, and investment proofs are required for Old Regime claims`);
    lines.push('');
    lines.push(`> *This is educational guidance based on Indian tax rules. Consult a CA for personalised filing advice.*`);

    return lines.join('\n');
}

async function tryGemini(apiKey: string, income: number, age: number, risk: string, remaining80C: number, remaining80D: number): Promise<string | null> {
    const timeSinceLast = Date.now() - lastApiCallTime;
    if (timeSinceLast < COOLDOWN_MS) return null; // Cooldown active — skip

    const payload = {
        contents: [{
            parts: [{
                text: `You are an Indian tax & investment advisor. Educational advice only — no actual tax calculations.

Profile: Income ₹${Number(income).toLocaleString('en-IN')}, Age ${age}, Risk ${risk}, Unused 80C ₹${Number(remaining80C).toLocaleString('en-IN')}, Unused 80D ₹${Number(remaining80D).toLocaleString('en-IN')}.

In under 300 words with markdown headings, give actionable advice on:
1. Best instruments for remaining 80C/80D based on risk profile
2. Old vs New regime recommendation
3. Top 2 tax-saving tips`
            }]
        }],
        generationConfig: { maxOutputTokens: 450, temperature: 0.3 }
    };

    try {
        lastApiCallTime = Date.now();
        const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (response.status === 429 || data?.error?.status === 'RESOURCE_EXHAUSTED') {
            console.log('[Gemini] Rate limited — using rule-based fallback');
            return null;
        }
        if (response.status !== 200 || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.warn('[Gemini] Unexpected response, using rule-based fallback');
            return null;
        }

        return data.candidates[0].content.parts[0].text;
    } catch {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const { income, age, risk, remaining80C, remaining80D } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        // ── 1. Cache lookup ──────────────────────────────────────────────────
        const key = profileKey(income, age, risk, remaining80C, remaining80D);
        const cached = responseCache.get(key);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
            return NextResponse.json({ advice: cached.advice, cached: true, isAI: cached.isAI });
        }

        // ── 2. Always generate rule-based advice first ───────────────────────
        const ruleBasedAdvice = generateRuleBasedAdvice(income, age, risk, remaining80C, remaining80D);

        // ── 3. Optionally enhance with Gemini (silent fallback to rules) ─────
        let finalAdvice = ruleBasedAdvice;
        let isAI = false;

        if (apiKey) {
            const geminiAdvice = await tryGemini(apiKey, income, age, risk, remaining80C, remaining80D);
            if (geminiAdvice) {
                finalAdvice = geminiAdvice;
                isAI = true;
            }
        }

        // ── 4. Cache and return ──────────────────────────────────────────────
        responseCache.set(key, { advice: finalAdvice, timestamp: Date.now(), isAI });
        return NextResponse.json({ advice: finalAdvice, isAI });

    } catch (error) {
        console.error('[Advisory] Error:', error);
        return NextResponse.json({ advice: 'An error occurred. Please try again.' });
    }
}
