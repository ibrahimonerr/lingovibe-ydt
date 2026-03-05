"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error("Critical Global Error Caught:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className="antialiased bg-slate-50 text-slate-800">
                <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
                    <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner ring-4 ring-rose-50 transform rotate-3">
                        <AlertTriangle size={48} />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">System Failure</h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-sm">
                        A critical error prevented the application from loading. Please try restarting your session.
                    </p>

                    <div className="flex flex-col w-full max-w-xs gap-4 shadow-xl rounded-full">
                        <button
                            onClick={() => reset()}
                            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-full font-black uppercase text-[12px] active:scale-95 transition-all flex items-center justify-center gap-3 tracking-widest"
                        >
                            <RefreshCw size={18} /> Recover Session
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-white text-slate-600 hover:text-slate-900 py-5 rounded-full font-bold uppercase text-[12px] active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-slate-200"
                        >
                            <Home size={18} /> Hard Reset App
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
