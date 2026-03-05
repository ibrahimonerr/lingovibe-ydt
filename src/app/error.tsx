"use client";

import { useEffect } from "react";
import MobileShell from "@/components/layout/MobileShell";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error("Global UI Error Caught:", error);
    }, [error]);

    return (
        <MobileShell>
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 py-16 text-center animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-rose-50">
                    <AlertTriangle size={36} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Oops! Something went wrong</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    The application encountered an unexpected error. Please try refreshing the page or navigating back.
                </p>

                <div className="flex flex-col w-full max-w-xs gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={16} /> Try Again
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-slate-100 text-slate-600 hover:text-slate-900 py-4 rounded-[1.5rem] font-bold uppercase text-[12px] active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-slate-200"
                    >
                        <Home size={16} /> Return to Dashboard
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-12 p-4 bg-rose-50 rounded-xl text-left w-full border border-rose-200 overflow-auto max-h-48 text-xs text-rose-900 font-mono shadow-inner">
                        <p className="font-bold mb-1">Developer Details:</p>
                        {error.message}
                    </div>
                )}
            </div>
        </MobileShell>
    );
}
