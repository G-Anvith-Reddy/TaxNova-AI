"use client";

import { motion } from "framer-motion";
import { BookOpen, HelpCircle, ShieldAlert, BadgeInfo, TrendingUp } from "lucide-react";

const articles = [
    {
        icon: <BadgeInfo className="w-5 h-5" />,
        title: "Old vs New Regime",
        content: "The Old Tax Regime offers over 70 exemptions and deductions, including Section 80C, 80D, HRA, and LTA. The New Tax Regime offers concessional tax rates but removes most exemptions, except the standard deduction of ₹75,000. Under the new regime (from Budget 2025 onwards), there is zero tax for income up to ₹12 lakhs due to the Section 87A rebate."
    },
    {
        icon: <ShieldAlert className="w-5 h-5" />,
        title: "What is Section 80C?",
        content: "Section 80C of the Income Tax Act allows a maximum deduction of ₹1.5 lakhs from your total gross income. Popular investment instruments include PPF (Public Provident Fund), EPF (Employee Provident Fund), ELSS Mutual Funds, Life Insurance Premiums, and 5-year Tax Saving FDs. Note: 80C is NOT available in the New Tax Regime."
    },
    {
        icon: <ShieldAlert className="w-5 h-5" />,
        title: "What is Section 80D?",
        content: "Section 80D provides a deduction on health insurance premiums paid for self, family, and parents. The maximum deduction is ₹25,000 for non-senior citizens and up to ₹50,000 for senior citizens. Like 80C, this deduction is NOT available under the New Tax Regime."
    },
    {
        icon: <HelpCircle className="w-5 h-5" />,
        title: "What is Section 87A?",
        content: "Section 87A offers a rebate that essentially makes zero tax payable for taxpayers in lower income brackets. In the Old Regime, a rebate of up to ₹12,500 is available for taxable income up to ₹5 lakhs. In the New Regime, a rebate of up to ₹60,000 is available for taxable income up to ₹12 lakhs, effectively making tax zero for income up to ₹12 lakhs."
    },
    {
        icon: <HelpCircle className="w-5 h-5" />,
        title: "What is Cess?",
        content: "Health and Education Cess is an additional tax levied on the basic tax liability to fund government health and education initiatives. It is fixed at 4% and is calculated on the tax amount AFTER deducting any Section 87A rebate."
    },
    {
        icon: <ShieldAlert className="w-5 h-5" />,
        title: "What is Advance Tax?",
        content: "If your estimated tax liability for the year exceeds ₹10,000, you are required to pay tax in installments rather than a lump sum at the end of the year. Due dates are June 15 (15%), Sept 15 (45%), Dec 15 (75%), and March 15 (100%). Failure to pay incurs penal interest under Sections 234B and 234C at 1% per month."
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "How Marginal Tax Works",
        content: "India follows a progressive marginal tax system. This means that you only pay the higher slab rate on the income that falls into that specific slab, not on your entire income. For example, if you earn ₹6 Lakhs in the old regime, the first ₹2.5L is tax-free, the next ₹2.5L is taxed at 5%, and only the remaining ₹1L is taxed at 20%."
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Generating Wealth with Tax Saving",
        content: "Tax saving isn't just about reducing outflows; it's about compounding wealth. By investing ₹1.5L yearly in high-growth instruments like ELSS mutual funds (historically 12-15% return), you save ₹45,000 in immediate tax (at the 30% slab) AND your investment compounds. Over 15 years, this continuous discipline can generate a corpus upwards of ₹60 Lakhs, while simultaneously providing tax relief."
    }
];

export default function EducationPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Tax Education Hub
                    </h2>
                    <p className="text-slate-400 mt-1">Learn the basics of Indian taxation to make informed financial decisions.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4">
                {articles.map((article, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-indigo-400">{article.icon}</div>
                            <h3 className="text-xl font-bold text-white">{article.title}</h3>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            {article.content}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-900/20 border border-blue-500/20 p-6 rounded-2xl text-center">
                <p className="text-sm text-slate-400">
                    Disclaimer: This section provides simplified educational concepts based on general income tax rules.
                    It should not be considered as professional legal or financial advice.
                </p>
            </div>
        </motion.div>
    );
}
