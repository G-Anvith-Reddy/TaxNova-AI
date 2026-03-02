"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    UserCircle,
    Calculator,
    PiggyBank,
    HeartPulse,
    Scale,
    PieChart,
    CalendarClock,
    Receipt,
    BookOpen,
    Bot,
    FileText,
    LogOut
} from "lucide-react";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Tax Calculator", href: "/calculator", icon: Calculator },
    { name: "80C Planner", href: "/planner-80c", icon: PiggyBank },
    { name: "80D Planner", href: "/planner-80d", icon: HeartPulse },
    { name: "Compare Regimes", href: "/compare", icon: Scale },
    { name: "Advance Tax", href: "/advance-tax", icon: CalendarClock },
    { name: "Expense Tracker", href: "/expenses", icon: Receipt },
    { name: "Tax Education", href: "/education", icon: BookOpen },
    { name: "AI Advisory", href: "/advisory", icon: Bot },
    { name: "Report", href: "/report", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useStore();

    return (
        <div className="w-64 h-screen border-r border-white/10 bg-[#0f172a]/80 backdrop-blur-xl fixed left-0 top-0 hidden md:flex flex-col">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    TAXNOVA
                </h1>
                <p className="text-xs text-slate-400 mt-1">Intelligent Tax Planning</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 flex flex-col gap-2">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 py-2 rounded-lg transition-colors font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Secure Sign Out
                </button>
                <div className="text-xs text-center text-slate-500 mt-2">
                    Strictly Deterministic Calculations
                </div>
            </div>
        </div>
    );
}
