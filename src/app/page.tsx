"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { loadDemoData } = useStore();

  const handleDemo = () => {
    loadDemoData();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-3xl px-6"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">TAXNOVA</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-12">
          Intelligent, deterministic tax planning for the modern Indian taxpayer.
          Upload your data, optimize your savings, and build wealth with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleDemo}
            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-200 px-8 py-4 rounded-full font-semibold transition-all"
          >
            <PlayCircle className="w-5 h-5" />
            Try Demo Mode
          </button>
        </div>
      </motion.div>
    </div>
  );
}
