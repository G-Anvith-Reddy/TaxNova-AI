"use client";

import { useStore } from "@/store/useStore";
import RegimeCard from "@/components/RegimeCard";
import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { Calculator as CalcIcon } from "lucide-react";

export default function CalculatorPage() {
    const { user, updateUser, oldRegime, newRegime, used80C, used80D } = useStore();

    const isOldBetter = oldRegime.totalTax < newRegime.totalTax;
    const bestRegime = isOldBetter ? oldRegime : newRegime;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <CalcIcon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Live Tax Calculator
                    </h2>
                    <p className="text-slate-400 mt-1">Play with your numbers here. Changes reflect across all your planners.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Income & Deductions</h3>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Annual Gross Income: <span className="text-white font-bold">{formatCurrency(user.grossIncome)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5000000"
                                step="50000"
                                value={user.grossIncome}
                                onChange={(e) => updateUser({ grossIncome: Number(e.target.value) })}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Standard Deduction: <span className="text-white font-bold">₹50,000 (Old) / ₹75,000 (New)</span>
                            </label>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-slate-600 w-full" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Total 80C + 80D Utilized: <span className="text-emerald-400 font-bold">{formatCurrency(used80C + used80D)}</span>
                            </label>
                            <p className="text-xs text-slate-500 mt-1">Configure limits in the respective planner tabs.</p>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Current Rule Set Applied:</h4>
                            <ul className="list-disc pl-5 text-xs text-slate-500 space-y-1">
                                <li>Budget 2025 New Slabs (Up to 24L)</li>
                                <li>Sec 87A Rebate: Old (₹12,500), New (₹60,000)</li>
                                <li>4% fixed Health & Education Cess</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Recommended Regime</h3>
                    <RegimeCard
                        title={isOldBetter ? "Old Regime" : "New Regime"}
                        details={bestRegime}
                        isSelected={true}
                        highlightRebate={!isOldBetter}
                    />
                </div>
            </div>
        </motion.div>
    );
}
