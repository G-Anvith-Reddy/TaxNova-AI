"use client";

import { useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/formatters";
import { Download, FileText, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import RegimeCard from "@/components/RegimeCard";

export default function ReportPage() {
    const { user, oldRegime, newRegime, used80C, used80D, allocations } = useStore();
    const reportRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const generatePDF = async () => {
        if (!reportRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("Taxnova_Report.pdf");
        } catch (error) {
            console.error("PDF Generation failed:", error);
        }
        setDownloading(false);
    };

    const isOldBetter = oldRegime.totalTax < newRegime.totalTax;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-400" />
                        Comprehensive Tax Report
                    </h2>
                    <p className="text-slate-400 mt-1">Download your structured PDF report containing all computations.</p>
                </div>
                <button
                    onClick={generatePDF}
                    disabled={downloading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
                >
                    {downloading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating PDF...</>
                    ) : (
                        <><Download className="w-5 h-5" /> Download Report</>
                    )}
                </button>
            </div>

            {/* Report Container to capture */}
            <div
                ref={reportRef}
                className="bg-[#020617] text-slate-200 p-8 pt-12 space-y-10 border border-slate-800 mx-auto"
                style={{ width: "210mm", minHeight: "297mm", maxWidth: "100%" }} // A4 dimensions approximation for web rendering
            >
                <div className="text-center border-b border-slate-700 pb-6">
                    <h1 className="text-4xl font-black text-white tracking-widest">TAXNOVA</h1>
                    <p className="text-slate-400 mt-2 uppercase tracking-widest text-sm">Official Tax Computation Report</p>
                </div>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-3">Profile Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <div><span className="text-slate-500 block">Gross Income</span><span className="font-bold">{formatCurrency(user.grossIncome)}</span></div>
                        <div><span className="text-slate-500 block">Age</span><span className="font-bold">{user.age} Years</span></div>
                        <div><span className="text-slate-500 block">Risk Profile</span><span className="font-bold capitalize">{user.riskAppetite}</span></div>
                        <div><span className="text-slate-500 block">Fixed Expenses</span><span className="font-bold">{formatCurrency(user.monthlyFixedExpenses)} / mo</span></div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-3">Regime Comparison</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden">
                            <RegimeCard title="Old Regime" details={oldRegime} isSelected={isOldBetter} />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden">
                            <RegimeCard title="New Regime" details={newRegime} isSelected={!isOldBetter} highlightRebate />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-l-4 border-emerald-500 pl-3">Deduction Utilization (Old Regime)</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <div>
                            <span className="text-slate-500 block mb-1">Section 80C Utilization</span>
                            <span className="font-bold text-lg text-emerald-400">{formatCurrency(used80C)} <span className="text-xs text-slate-500 font-normal">out of ₹1.5L cap</span></span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1">Section 80D Utilization</span>
                            <span className="font-bold text-lg text-emerald-400">{formatCurrency(used80D)} <span className="text-xs text-slate-500 font-normal">out of {formatCurrency(user.age >= 60 ? 50000 : 25000)} cap</span></span>
                            {user.age >= 60 && <p className="text-xs text-slate-400 mt-1">Age 60+ detected (Senior Citizen cap applied).</p>}
                        </div>
                    </div>
                </section>

                <section className="space-y-4 pb-10">
                    <h3 className="text-xl font-bold text-white border-l-4 border-indigo-500 pl-3">Investment Allocations</h3>
                    {allocations.length > 0 ? (
                        <div className="flex gap-8 items-center bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="w-[150px] h-[150px] shrink-0">
                                <PieChart width={150} height={150}>
                                    <Pie
                                        data={allocations.filter(a => a.amount > 0)}
                                        cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="amount" stroke="none"
                                    >
                                        {allocations.filter(a => a.amount > 0).map((a, i) => (
                                            <Cell key={a.id} fill={['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'][i % 6]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </div>
                            <table className="w-full text-sm text-left border border-slate-800 rounded-lg overflow-hidden">
                                <thead className="bg-slate-950 text-slate-400">
                                    <tr>
                                        <th className="px-4 py-2 border-b border-slate-800">Instrument</th>
                                        <th className="px-4 py-2 border-b border-slate-800">Growth Rate</th>
                                        <th className="px-4 py-2 border-b border-slate-800 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocations.map(a => (
                                        <tr key={a.id} className="border-b border-slate-800/50">
                                            <td className="px-4 py-2">{a.name}</td>
                                            <td className="px-4 py-2">{(a.projectedReturnRate * 100).toFixed(1)}%</td>
                                            <td className="px-4 py-2 text-right font-bold text-white">{formatCurrency(a.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No investment allocations planned.</p>
                    )}
                </section>

            </div>
        </div>
    );
}
