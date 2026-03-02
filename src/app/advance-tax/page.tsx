"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";

export default function AdvanceTaxPage() {
    const { user, oldRegime, newRegime } = useStore();

    const isOldBetter = oldRegime.totalTax < newRegime.totalTax;
    const bestRegime = isOldBetter ? oldRegime : newRegime;
    const taxLiability = bestRegime.totalTax;

    if (taxLiability < 10000) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">No Advance Tax Required</h2>
                <p className="text-slate-400">Your total tax liability is below ₹10,000 ({formatCurrency(taxLiability)}).<br /> You are not required to pay advance tax.</p>
            </div>
        );
    }

    if (user.isTdsOn) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Monthly TDS Deduction
                    </h2>
                    <p className="text-slate-400 mt-1">Since your TDS toggle is ON, taxes are automatically deducted monthly. No advance tax schedule needed.</p>
                </div>

                <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <FileCheck className="w-16 h-16 text-blue-400 opacity-80" />
                    <div>
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total Estimated TDS</p>
                        <p className="text-4xl font-extrabold text-white mt-2">{formatCurrency(taxLiability)}</p>
                    </div>
                    <div className="w-full bg-slate-900/50 p-6 rounded-xl border border-white/5 mt-4 flex justify-between items-center text-left">
                        <div>
                            <p className="text-slate-400 mb-1">Estimated Monthly Deduction</p>
                            <p className="text-2xl font-bold text-blue-400">{formatCurrency(taxLiability / 12)} / month</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Advance Tax Installments (Mocking status to show UI rules)
    const installments = [
        { date: "15th Jun", percent: 15, amount: taxLiability * 0.15, status: 'Paid' },
        { date: "15th Sep", percent: 30, amount: taxLiability * 0.30, status: 'Paid' },
        { date: "15th Dec", percent: 30, amount: taxLiability * 0.30, status: 'Upcoming' },
        { date: "15th Mar", percent: 25, amount: taxLiability * 0.25, status: 'Upcoming' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Advance Tax Schedule
                </h2>
                <p className="text-slate-400 mt-1">Your tax liability exceeds ₹10,000. You must pay tax in 4 installments to avoid penalties.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                {installments.map((inst, idx) => (
                    <motion.div whileHover={{ y: -5 }} key={idx} className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${inst.status === 'Paid' ? 'bg-emerald-500' : inst.status === 'Upcoming' ? 'bg-yellow-500' : 'bg-rose-500'}`} />
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{inst.date}</p>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${inst.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : inst.status === 'Upcoming' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'}`}>
                                {inst.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                                {inst.status}
                            </span>
                        </div>
                        <p className="text-2xl font-extrabold text-white mb-1">{formatCurrency(inst.amount)}</p>
                        <p className="text-sm text-blue-400 font-medium">{inst.percent}% of Liability</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-rose-950/30 border border-rose-900 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-rose-500/10 p-4 rounded-full">
                    <AlertCircle className="w-8 h-8 text-rose-400" />
                </div>
                <div className="space-y-4 text-slate-300 flex-1">
                    <h3 className="text-xl font-semibold text-rose-400">Penalty Explanations (234B & 234C)</h3>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-rose-900/50">
                        <h4 className="font-bold text-white mb-2">Section 234C (Underpayment of Installments)</h4>
                        <p className="text-sm">
                            If you fail to pay the exact percentage of your liability by the due dates (15%, 45%, 75%, 100%),
                            interest under 234C is charged at <strong className="text-white">1% per month</strong> for 3 months on the shortfall amount.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-rose-900/50">
                        <h4 className="font-bold text-white mb-2">Section 234B (Default in Payment)</h4>
                        <p className="text-sm">
                            If your advance tax paid by March 31st is less than <strong className="text-white">90% of your total liability</strong>,
                            interest under 234B is levied at <strong className="text-white">1% per month</strong> from April 1st until the tax is fully paid.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
