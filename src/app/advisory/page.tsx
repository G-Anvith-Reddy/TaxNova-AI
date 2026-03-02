"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Bot, Sparkles, Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";

function renderMarkdown(text: string) {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-blue-300 mt-4 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-slate-600 pl-4 text-slate-400 text-sm italic my-2">{line.slice(2)}</blockquote>;
        if (line.startsWith('- ')) {
            const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return <li key={i} className="ml-4 text-slate-300 text-sm mb-1 list-disc" dangerouslySetInnerHTML={{ __html: content }} />;
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
        return <p key={i} className="text-slate-300 text-sm mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
}

export default function AdvisoryPage() {
    const { user, used80C, used80D, allocations } = useStore();
    const [advice, setAdvice] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAI, setIsAI] = useState(false);
    const [cached, setCached] = useState(false);

    const remaining80C = Math.max(0, 150000 - used80C);
    const max80D = user.age >= 60 ? 50000 : 25000;
    const remaining80D = Math.max(0, max80D - used80D);

    const fetchAdvisory = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/advisory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ income: user.grossIncome, age: user.age, risk: user.riskAppetite, remaining80C, remaining80D, allocations })
            });
            const data = await res.json();
            setAdvice(data.advice || "No advice received.");
            setIsAI(data.isAI ?? false);
            setCached(data.cached ?? false);
        } catch {
            setAdvice("Error connecting to advisory service. Please try again.");
        }
        setLoading(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Bot className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Tax &amp; Wealth Advisory
                    </h2>
                    <p className="text-slate-400 mt-1">Personalised guidance based on your financial profile.</p>
                </div>
            </div>

            {!advice && !loading && (
                <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <Sparkles className="w-12 h-12 text-indigo-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Analyse your Profile</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                        {user.grossIncome > 0
                            ? `Profile ready — ₹${user.grossIncome.toLocaleString('en-IN')} income, age ${user.age}.`
                            : 'Please fill your profile details first.'}
                        {' '}Click below for instant personalised advice.
                    </p>
                    <button
                        onClick={fetchAdvisory}
                        disabled={user.grossIncome === 0}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Zap className="w-4 h-4" />
                        Generate Advisory Report
                    </button>
                </div>
            )}

            {loading && (
                <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-indigo-400 min-h-[300px]">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-medium animate-pulse">Generating your personalised advisory...</p>
                </div>
            )}

            {advice && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold text-white">Advisory Report</h3>
                            {isAI ? (
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                                    ✦ AI Enhanced
                                </span>
                            ) : (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                                    ✓ Smart Advisory
                                </span>
                            )}
                            {cached && <span className="text-[10px] text-slate-500">(cached)</span>}
                        </div>
                        <button
                            onClick={fetchAdvisory}
                            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1 bg-indigo-500/10 rounded-full transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="space-y-1">
                        {renderMarkdown(advice)}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
