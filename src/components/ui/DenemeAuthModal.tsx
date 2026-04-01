import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, LogIn, Lock, ArrowRight } from 'lucide-react';

interface DenemeAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DenemeAuthModal: React.FC<DenemeAuthModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-[#070812] rounded-[3rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-500">
                
                {/* Decorative background */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl" />

                <div className="w-20 h-20 rounded-[2.2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/40 rotate-12 relative z-10">
                    <Lock size={36} className="text-white" />
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tighter uppercase text-center relative z-10">
                    Mini Deneme Master
                </h2>

                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl p-6 mb-8 text-center relative z-10">
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-[13px] leading-relaxed">
                        Mini Deneme özelliği sadece kayıtlı kullanıcılarımıza özeldir. İlerlemeni kaydetmek ve günlük deneme hakkını kullanmak için hemen giriş yap!
                    </p>
                </div>

                <div className="space-y-3 relative z-10">
                    <button 
                        onClick={() => router.push('/auth/login')}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <LogIn size={18} />
                        Giriş Yap / Üye Ol
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                        onClick={onClose}
                        className="w-full py-4 text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                    >
                        Belki Daha Sonra
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DenemeAuthModal;
