"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/formatters";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function ExpensesTrackerPage() {
    const { expenses, user } = useStore();

    const debits = expenses.filter(e => e.type === 'debit');
    const credits = expenses.filter(e => e.type === 'credit');

    const totalDebits = debits.reduce((sum, e) => sum + e.amount, 0) || user.monthlyFixedExpenses * 12; // Fallback to user fixed exp if no CSV
    const totalCredits = credits.reduce((sum, e) => sum + e.amount, 0) || user.grossIncome;

    const categoryMap: Record<string, number> = {};
    debits.forEach(e => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const categoryData = Object.keys(categoryMap).map(category => ({
        name: category,
        value: categoryMap[category]
    })).sort((a, b) => b.value - a.value);

    // Aggregate monthly trends
    const monthlyDataMap: Record<string, number> = {};
    debits.forEach(e => {
        let monthLabel = "Unknown";
        if (e.date.includes('-')) {
            const parts = e.date.split('-');
            if (parts.length === 3) monthLabel = `${parts[1]}/${parts[2].slice(-2)}`;
        } else {
            const d = new Date(e.date);
            if (!isNaN(d.getTime())) {
                monthLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            }
        }
        monthlyDataMap[monthLabel] = (monthlyDataMap[monthLabel] || 0) + e.amount;
    });

    const monthlyTrendData = Object.keys(monthlyDataMap).map(m => ({
        month: m,
        amount: monthlyDataMap[m]
    }));

    // If no expenses from CSV, mock some data for the Pie Chart based on user fixed expenses
    if (categoryData.length === 0 && user.monthlyFixedExpenses > 0) {
        categoryData.push(
            { name: "Rent", value: user.monthlyFixedExpenses * 12 * 0.4 },
            { name: "Food", value: user.monthlyFixedExpenses * 12 * 0.3 },
            { name: "Utilities", value: user.monthlyFixedExpenses * 12 * 0.15 },
            { name: "Shopping", value: user.monthlyFixedExpenses * 12 * 0.15 }
        );
    }

    const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#06b6d4', '#8b5cf6', '#d946ef'];

    const expenseRatio = ((totalDebits / totalCredits) * 100) || 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                        Expense Tracker
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Analyze your spending patterns automatically from the uploaded banking statements.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-6">
                    <p className="text-sm text-slate-400 mb-1">Total Expenses</p>
                    <p className="text-3xl font-bold text-rose-400">{formatCurrency(totalDebits)}</p>
                </div>
                <div className="glass-card rounded-2xl p-6">
                    <p className="text-sm text-slate-400 mb-1">Total Inflow (Income)</p>
                    <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalCredits)}</p>
                </div>
                <div className="glass-card rounded-2xl p-6">
                    <p className="text-sm text-slate-400 mb-1">Expense-to-Income Ratio</p>
                    <div className="flex items-end gap-3 mt-1">
                        <p className="text-3xl font-bold text-white">{expenseRatio.toFixed(1)}%</p>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                        <div
                            className={`h-full ${expenseRatio > 70 ? 'bg-rose-500' : expenseRatio > 40 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, expenseRatio)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Category Breakdown</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none"
                                >
                                    {categoryData.map((a, i) => (
                                        <Cell key={a.name} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold mb-6">Top Spending Categories</h3>
                    <div className="space-y-4">
                        {categoryData.slice(0, 5).map((cat, idx) => (
                            <div key={idx} className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-slate-300 font-medium">{cat.name}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-white">{formatCurrency(cat.value)}</span>
                                    <span className="text-xs text-slate-500">
                                        {((cat.value / totalDebits) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                        {categoryData.length === 0 && (
                            <div className="text-center text-slate-500 py-10">
                                No expense data found. Ensure you have uploaded a CSV in the Profile section.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-6">Monthly Trend</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
                            <RechartsTooltip
                                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                            />
                            <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {monthlyTrendData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        Upload a CSV statement to see your spending trends.
                    </div>
                )}
            </div>

            {expenses.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-6 text-white">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Date</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.slice(0, 30).map((e) => (
                                    <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{e.date}</td>
                                        <td className="px-4 py-3 font-medium text-white max-w-sm truncate" title={e.description}>{e.description}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-full text-xs">
                                                {e.category}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-bold ${e.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {e.type === 'credit' ? '+' : '-'}{formatCurrency(e.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {expenses.length > 30 && (
                            <div className="text-center py-4 text-xs text-slate-500">
                                Showing top 30 recent transactions...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
