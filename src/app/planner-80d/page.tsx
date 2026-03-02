"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/formatters";
import { ShieldCheck, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Planner80DPage() {
    const { user, used80D, oldRegime } = useStore();

    const MAX_LIMIT = user.age >= 60 ? 50000 : 25000;
    const existing80D = used80D;
    const remaining80D = Math.max(0, MAX_LIMIT - existing80D);

    const marginalRate = oldRegime.taxableIncome > 500000 ? 0.208 : 0.052; // including cess approx
    const estimatedTaxSaved = remaining80D * marginalRate;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Section 80D Planner
                </h2>
                <p className="text-slate-400 mt-1">
                    Secure your family's health and save tax. Your age-based maximum limit is {formatCurrency(MAX_LIMIT)}.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-sm text-slate-400">Current 80D Claimed</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatCurrency(existing80D)}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-center border border-indigo-500/30">
                    <p className="text-sm text-slate-400">Remaining 80D Gap</p>
                    <p className="text-3xl font-bold text-indigo-400 mt-1">{formatCurrency(remaining80D)}</p>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/20 p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-sm text-slate-400">Potential Tax Savings</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">{formatCurrency(estimatedTaxSaved)}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                        <ShieldCheck className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-white">Suggested Action</h3>
                    </div>

                    {remaining80D > 0 ? (
                        <>
                            <p className="text-slate-300">
                                You have <span className="text-white font-bold">{formatCurrency(remaining80D)}</span> of unused 80D limit.
                                We recommend purchasing a comprehensive health insurance policy covering yourself and your family.
                            </p>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <p className="text-sm text-slate-400 mb-2">Recommended Policy Types</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                                    <li>Base Family Floater (₹5L - ₹10L cover)</li>
                                    <li>Super Top-up Plan (₹10L - ₹50L cover)</li>
                                    <li>Preventive Health Checkup (up to ₹5,000 allowance)</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="text-emerald-400 bg-emerald-400/10 p-4 rounded-lg">
                            You have fully utilized your Section 80D limit! No further tax-saving health insurance premiums can be claimed.
                        </p>
                    )}
                </div>

                <div className="bg-blue-950/30 border border-blue-900 focus-within:ring-1 focus-within:ring-blue-500 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                        <Info className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-white">80D Education</h3>
                    </div>

                    <div className="space-y-4 text-sm text-slate-300">
                        <p>
                            <strong>What is 80D?</strong><br />
                            Section 80D allows a tax deduction for the payment of medical insurance premiums and preventive health check-ups.
                        </p>
                        <p>
                            <strong>Limits:</strong><br />
                            - Individuals below 60 years: Up to ₹25,000<br />
                            - Senior Citizens (60+ years): Up to ₹50,000
                        </p>
                        <p>
                            <strong>Parents:</strong><br />
                            You can claim an additional ₹25,000 (or ₹50,000 if they are senior citizens) for insurance bought for your parents, separate from your own limit.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
