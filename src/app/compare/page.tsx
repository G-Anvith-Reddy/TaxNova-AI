"use client";

import { useStore } from "@/store/useStore";
import RegimeCard from "@/components/RegimeCard";
import { motion } from "framer-motion";

const formatCurrency = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);

export default function CompareRegimesPage() {
    const { oldRegime, newRegime, user } = useStore();

    const isOldBetter = oldRegime.totalTax < newRegime.totalTax;
    const isNewBetter = newRegime.totalTax < oldRegime.totalTax;
    const taxDifference = Math.abs(oldRegime.totalTax - newRegime.totalTax);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Regime Comparison
                </h2>
                <p className="text-slate-400 mt-1">
                    Detailed breakdown of Old versus New Tax Regime based on your profile inputs.
                </p>
            </div>

            {user.grossIncome > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-400">Recommendation</h3>
                        <p className="text-slate-300">
                            Based on your details, the <span className="font-bold text-white">{isOldBetter ? "Old Regime" : "New Regime"}</span> is better.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400">Potential Savings</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            {formatCurrency(taxDifference)}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                <RegimeCard
                    title="Old Regime (With Exemptions)"
                    details={oldRegime}
                    isSelected={isOldBetter}
                    highlightRebate={false}
                />

                <RegimeCard
                    title="New Regime (Default)"
                    details={newRegime}
                    isSelected={isNewBetter}
                    highlightRebate={true}
                />
            </div>

            <div className="text-center text-sm text-slate-500 pt-4">
                Note: The 87A rebate is available up to ₹12L in the new regime and ₹5L in the old regime.
                Tax calculators are deterministic and use latest budgetary rules.
            </div>
        </motion.div>
    );
}
