"use client";

import { useStore } from "@/store/useStore";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import RegimeCard from "@/components/RegimeCard";

const formatCurrency = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);

export default function DashboardPage() {
    const { user, oldRegime, newRegime, expenses, used80C, used80D } = useStore();

    const isOldRegimeBetter = oldRegime.totalTax < newRegime.totalTax;
    const bestRegime = isOldRegimeBetter ? oldRegime : newRegime;

    const totalExpenses = expenses.reduce((sum, e) => e.type === 'debit' ? sum + e.amount : sum, user.monthlyFixedExpenses * 12);
    const savingsAmount = user.grossIncome - totalExpenses - bestRegime.totalTax;
    const savingsRatio = user.grossIncome > 0 ? (savingsAmount / user.grossIncome) * 100 : 0;

    const taxEfficiencyScore = Math.min(100, Math.max(0, 100 - (bestRegime.totalTax / (user.grossIncome || 1)) * 100));

    const incomeData = [
        { name: "Expenses", value: totalExpenses, color: "#f43f5e" },
        { name: "Taxes Paid", value: bestRegime.totalTax, color: "#3b82f6" },
        { name: "Savings", value: Math.max(0, savingsAmount), color: "#10b981" },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">

            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        Financial Dashboard
                    </h2>
                    <p className="text-slate-400 mt-1">Overview of your tax efficiency and income allocation.</p>
                </div>
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-5 py-3 shadow-lg"
                >
                    <p className="text-sm font-medium text-slate-400">Net Take Home</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(bestRegime.netInHand)}</p>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-slate-400 text-sm font-medium mb-2 relative z-10">Tax Efficiency</h3>
                    <p className="text-4xl font-extrabold text-blue-400 relative z-10">{taxEfficiencyScore.toFixed(1)}<span className="text-2xl">%</span></p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-slate-400 text-sm font-medium mb-2 relative z-10">Savings Ratio</h3>
                    <p className="text-4xl font-extrabold text-emerald-400 relative z-10">{savingsRatio.toFixed(1)}<span className="text-2xl">%</span></p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="text-slate-400 text-sm font-medium">80C / 80D Utilization</h3>
                    <div className="space-y-2">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-white">80C: {formatCurrency(used80C)}</span>
                                <span className="text-slate-400">Limit: ₹1.5L</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (used80C / 150000) * 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-white">80D: {formatCurrency(used80D)}</span>
                                <span className="text-slate-400">Limit: {formatCurrency(user.age >= 60 ? 50000 : 25000)}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (used80D / (user.age >= 60 ? 50000 : 25000)) * 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Income Allocation</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incomeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                    <h3 className="text-lg font-semibold">Taxes at a Glance</h3>
                    <RegimeCard
                        title="Optimized Regime Snapshot"
                        details={bestRegime}
                        isSelected={true}
                        highlightRebate={true}
                    />
                </div>
            </div>
        </motion.div>
    );
}
