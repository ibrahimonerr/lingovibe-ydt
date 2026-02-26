import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Toast({ msg, type }: { msg: string, type: 'error' | 'info' }) {
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10">
      <div className={`px-6 py-3 rounded-full shadow-2xl border flex items-center gap-3 backdrop-blur-md ${type === 'error' ? 'bg-rose-500/90' : 'bg-indigo-900/90'} text-white border-white/10 uppercase text-[10px] font-black tracking-widest`}>
        {type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
        <span>{msg}</span>
      </div>
    </div>
  );
}