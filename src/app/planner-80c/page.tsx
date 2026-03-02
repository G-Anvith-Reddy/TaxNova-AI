"use client";

import { useStore, InvestmentAllocation } from "@/store/useStore";
import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/formatters";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const MAX_80C = 150000;

export default function Planner80CPage() {
    const { used80C, allocations, setAllocations, user, oldRegime } = useStore();

    // Calculate marginal tax rate for tax saved
    // A rough estimate: 30% if slab > 10L, 20% if > 5L, etc. + 4% cess
    const marginalRate = useMemo(() => {
        let rate = 0;
        const ti = oldRegime.taxableIncome;
        if (ti > 1000000) rate = 0.30;
        else if (ti > 500000) rate = 0.20;
        else if (ti > 250000) rate = 0.05;
        return rate * 1.04;
    }, [oldRegime.taxableIncome]);

    const [localAllocations, setLocalAllocations] = useState<{ id: string, name: string, amount: number, lockIn: number, risk: string, rate: number }[]>([
        { id: "elss", name: "ELSS Mutual Funds", amount: allocations.find(a => a.id === "elss")?.amount || 0, lockIn: 3, risk: "High", rate: 0.12 },
        { id: "ppf", name: "Public Provident Fund", amount: allocations.find(a => a.id === "ppf")?.amount || 0, lockIn: 15, risk: "Low", rate: 0.071 },
        { id: "fd", name: "Tax Saving FD", amount: allocations.find(a => a.id === "fd")?.amount || 0, lockIn: 5, risk: "Low", rate: 0.065 },
        { id: "nsc", name: "National Savings Cert", amount: allocations.find(a => a.id === "nsc")?.amount || 0, lockIn: 5, risk: "Low", rate: 0.077 }
    ]);

    const existing80C = used80C;
    const currentTotal = localAllocations.reduce((sum, a) => sum + a.amount, 0);
    const remaining80C = Math.max(0, MAX_80C - existing80C);

    const handleSliderChange = (id: string, value: number) => {
        const otherAllocationsSum = localAllocations.filter(a => a.id !== id).reduce((s, a) => s + a.amount, 0);
        const maxAllowed = Math.max(0, remaining80C - otherAllocationsSum);
        const clampedValue = Math.min(value, maxAllowed);

        const newAllo = localAllocations.map(a => a.id === id ? { ...a, amount: clampedValue } : a);
        setLocalAllocations(newAllo);
    };

    const applyAllocations = () => {
        setAllocations(localAllocations as any);
    };

    // Projection Data for 5 years
    const projectionData = Array.from({ length: 6 }).map((_, year) => {
        const dataRef: any = { year: `Year ${year}` };
        localAllocations.forEach(a => {
            // Compound interest A = P(1+r)^t
            dataRef[a.name] = Math.round(a.amount * Math.pow(1 + a.rate, year));
        });
        return dataRef;
    });

    const COLORS = [
        "#3B82F6", // ELSS
        "#10B981", // PPF
        "#6366F1", // EPF
        "#F59E0B", // NPS
        "#EF4444", // TaxSaverFD
        "#8B5CF6"  // NSC
    ];

    const chartData = allocations.filter(a => a.amount > 0).map(a => ({
        name: a.name,
        value: a.amount
    }));

    const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Section 80C Planner
                </h2>
                <p className="text-slate-400 mt-1">Optimize your investments to max out the ₹1.5L limit and build wealth.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-medium text-slate-400">Existing 80C</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(existing80C)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-indigo-400">
                    <p className="text-sm font-medium opacity-80">Planned Allocation</p>
                    <p className="text-2xl font-bold">{formatCurrency(currentTotal)}</p>
                </div>
                <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <p className="text-sm font-medium opacity-80">Estimated Tax Saved</p>
                    <p className="text-2xl font-bold">{formatCurrency(currentTotal * marginalRate)}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Allocations Sliders */}
                <div className="glass-card rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Distribute Funds</h3>
                        <span className="text-sm text-slate-400">Remaining Gap: {formatCurrency(remaining80C - currentTotal)}</span>
                    </div>

                    {localAllocations.map(allo => (
                        <div key={allo.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-200">{allo.name}</span>
                                <span className="text-white font-bold">{formatCurrency(allo.amount)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={remaining80C}
                                    step="1000"
                                    value={allo.amount}
                                    onChange={(e) => handleSliderChange(allo.id, Number(e.target.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                                <span>Lock: {allo.lockIn}y | Risk: {allo.risk}</span>
                                <span>ROI: {(allo.rate * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={applyAllocations}
                        className="w-full mt-4 bg-white text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Apply to Global Plan (Updates Live Portfolio)
                    </button>
                </div>

                {/* Donut Chart with White Theme */}
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-4 w-full">Allocation Breakdown</h3>
                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={localAllocations.filter(a => a.amount > 0)}
                                    cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="amount" stroke="none"
                                >
                                    {localAllocations.filter(a => a.amount > 0).map((a, i) => (
                                        <Cell key={a.id} fill={COLORS[localAllocations.findIndex(loc => loc.id === a.id) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-6">Growth Projection (5 Years)</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
                            <RechartsTooltip
                                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                            {localAllocations.map((a, i) => (
                                <Line
                                    key={a.id}
                                    type="monotone"
                                    dataKey={a.name}
                                    stroke={COLORS[i % COLORS.length]}
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: COLORS[i % COLORS.length] }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
