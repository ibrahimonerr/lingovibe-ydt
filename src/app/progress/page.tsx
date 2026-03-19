"use client";

import React, { useEffect, useState } from 'react';
import MobileShell from '@/components/layout/MobileShell';
import { useAppStore } from '@/store/useAppStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Lightbulb, XCircle, Trophy, BookOpen, Languages, Zap, RefreshCw, PieChart as PieChartIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProgressDashboard() {
    const { userProgress, labStats, clearProgress } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <MobileShell>
                <div className="flex justify-center items-center h-full">
                    <RefreshCw className="animate-spin text-slate-300" size={32} />
                </div>
            </MobileShell>
        );
    }

    const totalAttempted = labStats.totalCorrect + labStats.totalWrong;
    const successRate = totalAttempted > 0 ? Math.round((labStats.totalCorrect / totalAttempted) * 100) : 0;

    const pieData = [
        { name: 'Correct', value: labStats.totalCorrect, color: '#10b981' }, // emerald-500
        { name: 'Wrong', value: labStats.totalWrong, color: '#f43f5e' } // rose-500
    ];

    const barData = [
        { name: 'Reading', completed: userProgress.readingLabsCompleted, fill: '#f59e0b' }, // amber-500
        { name: 'Vocab', completed: userProgress.vocabLabsCompleted, fill: '#4f46e5' }, // indigo-600
        { name: 'Grammar', completed: userProgress.grammarLabsCompleted, fill: '#10b981' }, // emerald-500
        { name: 'Skills', completed: userProgress.skillsLabsCompleted, fill: '#8b5cf6' } // violet-500
    ];

    const handleClear = () => {
        if (confirm("Tüm veri ve gelişim geçmişiniz silinecek. Emin misiniz?")) {
            clearProgress();
        }
    };

    return (
        <MobileShell>
            <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-8">

                {/* HEADER */}
                <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-10">
                        <Trophy size={140} />
                    </div>
                    <h1 className="text-2xl font-black italic tracking-tighter mb-1">Performance Hub</h1>
                    <p className="text-slate-400 font-medium text-sm">YDT sınav yolculuğunuz ve zayıf/güçlü yön analiziniz.</p>
                </div>

                {/* TOP STATS */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                            <Target size={24} />
                        </div>
                        <div className="text-3xl font-black text-slate-800">{successRate}%</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Accuracy</div>
                    </div>

                    <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                            <Lightbulb size={24} />
                        </div>
                        <div className="text-3xl font-black text-slate-800">{labStats.totalHintsUsed}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Hints Used</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-[2rem] border-2 border-emerald-50 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <div className="text-xl font-black text-slate-800">{labStats.totalCorrect}</div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Correct</div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-[2rem] border-2 border-rose-50 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                            <XCircle size={20} />
                        </div>
                        <div>
                            <div className="text-xl font-black text-slate-800">{labStats.totalWrong}</div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Mistakes</div>
                        </div>
                    </div>
                </div>

                {/* SUCCESS RATE PIE CHART */}
                {totalAttempted > 0 ? (
                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-800 mb-6 text-center uppercase tracking-wider text-sm">Doğruluk Analizi</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-600">Correct</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-xs font-bold text-slate-600">Wrong</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center opacity-70">
                        <PieChartIcon size={48} className="text-slate-200 mb-3" />
                        <h3 className="font-black text-slate-800 mb-2 uppercase tracking-wider text-sm">Doğruluk Analizi</h3>
                        <p className="text-slate-400 text-xs font-medium px-4">Pasta grafiğini (Pie Chart) görebilmek için önce birkaç soru çözmelisiniz.</p>
                    </div>
                )}

                {/* LAB MODULE COMPLETION BAR CHART */}
                <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6 text-center uppercase tracking-wider text-sm">Modül Tamamlama Sayısı</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#cbd5e1' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="completed" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                    {
                                        barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ACTION CARDS */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <Link href="/reading-lab" className="bg-amber-50 p-4 rounded-2xl border border-amber-100 active:scale-95 transition-all text-center">
                        <BookOpen size={20} className="mx-auto text-amber-500 mb-2" />
                        <div className="text-xs font-black text-amber-900 uppercase">Read More</div>
                    </Link>
                    <button onClick={handleClear} className="bg-rose-50 p-4 rounded-2xl border border-rose-100 active:scale-95 transition-all text-center">
                        <RefreshCw size={20} className="mx-auto text-rose-500 mb-2" />
                        <div className="text-xs font-black text-rose-900 uppercase">Reset Data</div>
                    </button>
                </div>

            </div>
        </MobileShell>
    );
}
