"use client";

import { useStore, RiskAppetite } from "@/store/useStore";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { parseBankStatementCSV } from "@/utils/csvParser";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { user, updateUser, addExpenses } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus("Parsing CSV...");
        try {
            const result = await parseBankStatementCSV(file);
            if (result.expenses.length > 0) {
                addExpenses(result.expenses);
                const errNote = result.errors.length > 0 ? ` (${result.errors.length} rows skipped)` : '';
                setUploadStatus(`✓ Loaded ${result.expenses.length} transactions${errNote}`);
            } else {
                const errDetail = result.errors.slice(0, 2).join(' | ');
                setUploadStatus(`No valid transactions found. ${errDetail || 'Check CSV format.'}`);
            }
        } catch (error) {
            setUploadStatus("Error parsing CSV. Please check the file format.");
            console.error(error);
        }
        setIsUploading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-10"
        >
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    User Profile
                </h2>
                <p className="text-slate-400 mt-1">
                    Configure your financial details. All calculations update instantly.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <div className="glass-card rounded-2xl p-6 space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Financial Details</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Annual Gross Income (₹)
                            </label>
                            <input
                                type="number"
                                value={user.grossIncome}
                                onChange={(e) => updateUser({ grossIncome: Number(e.target.value) })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={user.age}
                                    onChange={(e) => updateUser({ age: Number(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    Monthly Fixed Expenses
                                </label>
                                <input
                                    type="number"
                                    value={user.monthlyFixedExpenses}
                                    onChange={(e) => updateUser({ monthlyFixedExpenses: Number(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Risk Appetite
                            </label>
                            <select
                                value={user.riskAppetite}
                                onChange={(e) => updateUser({ riskAppetite: e.target.value as RiskAppetite })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="low">Low Risk (FDs, Bonds)</option>
                                <option value="moderate">Moderate Risk (Balanced PFs)</option>
                                <option value="high">High Risk (Full Equity, ELSS)</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={user.isTdsOn}
                                    onChange={(e) => updateUser({ isTdsOn: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="text-sm font-medium text-slate-300">Enable Monthly TDS Deductions</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: CSV Uploader */}
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center border-dashed border-2 hover:bg-slate-800/50 transition-colors relative group">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />
                    <div className="text-center space-y-4 pointer-events-none">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors">
                            <UploadCloud className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white mb-1">Auto-fill via Bank Statement</h3>
                            <p className="text-sm text-slate-400">Upload CSV to extract Income, 80C & 80D automatically.</p>
                        </div>
                        {uploadStatus && (
                            <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                {uploadStatus}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
