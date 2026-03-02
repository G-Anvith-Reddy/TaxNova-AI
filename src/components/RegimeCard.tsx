import { useState } from "react";
import { TaxDetails } from "@/utils/taxCalculator";
import { cn } from "@/lib/utils";
import { CheckCircle2, Calculator, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RegimeCardProps {
    title: string;
    details: TaxDetails;
    isSelected?: boolean;
    onSelect?: () => void;
    highlightRebate?: boolean;
}

const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
};

export default function RegimeCard({ title, details, isSelected, onSelect, highlightRebate }: RegimeCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div
            onClick={onSelect}
            className={cn(
                "glass-card p-6 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col h-full",
                isSelected ? "ring-2 ring-emerald-500/50 bg-emerald-900/10 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02]" : "hover:bg-white/5",
                !onSelect && "cursor-default"
            )}
        >
            {isSelected && (
                <div className="absolute top-4 right-4 text-emerald-400 flex items-center gap-1 text-sm font-semibold bg-emerald-500/10 px-3 py-1 rounded-full animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Recommended
                </div>
            )}

            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{title}</h3>

            <div className="space-y-4 text-sm flex-1">
                <div className="flex justify-between items-center text-slate-300">
                    <span>Gross Income</span>
                    <span className="font-medium text-white">{formatCurrency(details.grossIncome)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                    <span>Total Deductions (- Standard + 80C/D)</span>
                    <span className="font-medium text-emerald-400">-{formatCurrency(details.totalDeductions)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300 border-t border-white/5 pt-3">
                    <span>Taxable Income</span>
                    <span className="font-semibold text-white">{formatCurrency(details.taxableIncome)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400 pt-2">
                    <span>Computed Base Tax</span>
                    <span>{formatCurrency(details.baseTax)}</span>
                </div>

                <div className={cn("flex justify-between items-center", highlightRebate ? "text-cyan-400 font-medium bg-cyan-500/10 p-2 rounded -mx-2" : "text-emerald-400")}>
                    <span>Sec 87A Rebate</span>
                    <span>-{formatCurrency(details.rebate)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300 border-t border-white/5 pt-2">
                    <span>Tax After Rebate</span>
                    <span className="font-semibold">{formatCurrency(details.taxAfterRebate)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                    <span>Cess @ 4%</span>
                    <span>+{formatCurrency(details.cess)}</span>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-slate-200 font-medium tracking-wide">Final Tax Payable</span>
                    <span className="text-2xl font-bold space-x-2">
                        <span className={details.totalTax === 0 ? "text-emerald-400" : "text-rose-400"}>
                            {formatCurrency(details.totalTax)}
                        </span>
                    </span>
                </div>

                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-300 text-sm font-semibold">Net In-Hand</span>
                    <span className="text-lg font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-md">
                        {formatCurrency(details.netInHand)}
                    </span>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors py-2 border border-slate-700/50 rounded-lg hover:bg-slate-800"
                >
                    <Calculator className="w-3.5 h-3.5" />
                    {showDetails ? "Hide Detailed Calculation" : "View Detailed Calculation"}
                </button>

                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-slate-950 p-4 rounded-xl text-xs text-slate-400 border border-slate-800 mt-2 space-y-2 font-mono">
                                <div className="flex items-start gap-2 mb-2 pb-2 border-b border-slate-800">
                                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Deterministic Engine Breakdown</span>
                                </div>
                                <p>1. Taxable = {formatCurrency(details.grossIncome)} - {formatCurrency(details.totalDeductions)}</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {formatCurrency(details.taxableIncome)}</p>
                                <p>2. Base Tax = Slab computation on {formatCurrency(details.taxableIncome)}</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {formatCurrency(details.baseTax)}</p>
                                <p>3. Rebate 87A = Check if Taxable {'<='} limit; Cap logic</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -{formatCurrency(details.rebate)}</p>
                                <p>4. Pre-cess Tax = Max(0, Base Tax - Rebate)</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {formatCurrency(details.taxAfterRebate)}</p>
                                <p>5. Cess = Pre-cess Tax × 4%</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {formatCurrency(details.cess)}</p>
                                <p className="text-white pt-2 font-bold tracking-wider">TOTAL = {formatCurrency(details.totalTax)}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
