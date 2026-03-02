"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function PortfolioPage() {
    const { allocations } = useStore();

    const totalValue = allocations.reduce((sum, a) => sum + a.amount, 0);

    const COLORS = [
        "#3B82F6", // ELSS
        "#10B981", // PPF
        "#6366F1", // EPF
        "#F59E0B", // NPS
        "#EF4444", // TaxSaverFD
        "#8B5CF6"  // NSC
    ];

    const projectionData = Array.from({ length: 6 }).map((_, year) => {
        const dataRef: any = { year: `Year ${year}` };
        let total = 0;
        allocations.forEach(a => {
            const val = Math.round(a.amount * Math.pow(1 + a.projectedReturnRate, year));
            dataRef[a.name] = val;
            total += val;
        });
        dataRef.Total = total;
        return dataRef;
    });

    if (allocations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="text-slate-500">
                    <PieChart className="w-16 h-16 mx-auto opacity-50" />
                </div>
                <h2 className="text-2xl font-bold">No Active Portfolio</h2>
                <p className="text-slate-400">Head over to the 80C Planner to allocate investments first.</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Investment Portfolio
                </h2>
                <p className="text-slate-400 mt-1">Review your current allocations and projected growth over 5 years.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Asset Allocation Breakdown</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={allocations}
                                    cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="amount" stroke="none"
                                >
                                    {allocations.map((a, i) => (
                                        <Cell key={a.id} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold mb-6">Holdings Table</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Instrument</th>
                                    <th className="px-4 py-3">Risk</th>
                                    <th className="px-4 py-3">Lock-In</th>
                                    <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allocations.map((a) => (
                                    <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 font-medium text-white">{a.name}</td>
                                        <td className="px-4 py-3">{a.risk}</td>
                                        <td className="px-4 py-3">{a.lockIn} Yrs</td>
                                        <td className="px-4 py-3 text-right font-bold">{formatCurrency(a.amount)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-900/50 font-bold text-white border-t border-white/10">
                                    <td colSpan={3} className="px-4 py-3">Total Investment</td>
                                    <td className="px-4 py-3 text-right text-emerald-400">{formatCurrency(totalValue)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-6">Total Portfolio Growth (5 Years)</h3>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
                            <Tooltip
                                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Total"
                                name="Total Portfolio Value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#3b82f6' }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    Disclaimer: Projections are estimates based on historical average returns and are for illustrative purposes only.
                </div>
            </div>
        </motion.div>
    );
}
