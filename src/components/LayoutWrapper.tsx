"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useStore } from "@/store/useStore";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated && pathname !== "/" && pathname !== "/login") {
                router.push("/login");
            } else if (isAuthenticated && user.grossIncome === 0 && pathname !== "/profile" && pathname !== "/" && pathname !== "/login") {
                router.push("/profile");
            }
        }
    }, [mounted, isAuthenticated, user.grossIncome, pathname, router]);

    if (!mounted) return <div className="min-h-screen bg-[#020617]" />; // Prevent hydration mismatch

    const noSidebarPages = ["/", "/login"];

    if (noSidebarPages.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen animated-gradient-bg text-slate-200 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-6 lg:p-10 max-h-screen overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
