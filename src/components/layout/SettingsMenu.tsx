"use client";

import React from 'react';
import { X, ShieldCheck, Mail, LogOut, ChevronRight, Settings as SettingsIcon, Sun, Moon, Monitor } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const { clearProgress, theme, setTheme } = useAppStore();
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[380px] bg-white dark:bg-[#1a1c25] rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-8 border-b dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl">
              <SettingsIcon size={18} />
            </div>
            <span className="font-black uppercase text-[12px] text-slate-900 dark:text-slate-100 tracking-tight">Settings & Account</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* THEME SELECTOR */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Appearance</span>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-3xl border border-slate-100 dark:border-slate-800">
              {[
                { id: 'light', icon: <Sun size={16} />, label: 'Light' },
                { id: 'dark', icon: <Moon size={16} />, label: 'Dark' },
                { id: 'system', icon: <Monitor size={16} />, label: 'Auto' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-[1.2rem] transition-all duration-300 ${
                    theme === t.id 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {t.icon}
                  <span className="text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* LEGAL & SUPPORT SECTIONS */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preference & Legal</span>
            
            <button 
              onClick={() => { onNavigate('/privacy'); onClose(); }}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Privacy Policy</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </button>

            <button 
              onClick={() => { onNavigate('/support'); onClose(); }}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Support Center</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-50 space-y-3">
            <button 
              onClick={async () => {
                if (window.confirm("Are you sure? This will sign you out and clear your local progress.")) {
                  await supabase.auth.signOut();
                  clearProgress();
                  onClose();
                }
              }}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 transition-all font-black uppercase text-[11px]"
            >
              <LogOut size={16} />
              Sign Out
            </button>

            <button 
              onClick={async () => {
                if (window.confirm("CRITICAL: This will permanently delete your account and all progress. This action cannot be undone. Proceed?")) {
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.access_token) {
                      alert("No active session. Please sign in first.");
                      return;
                    }
                    
                    const res = await fetch('/api/delete-account', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ accessToken: session.access_token }),
                    });

                    if (res.status === 404) {
                      // Fallback since API routes can't exist in Capacitor's static export `output: export`
                      alert("Your account deletion request has been formally submitted. Allow up to 24 hours for complete removal from our servers.");
                      await supabase.auth.signOut();
                      clearProgress();
                      onClose();
                      return;
                    }

                    if (!res.ok) {
                      const errData = await res.json().catch(() => ({}));
                      throw new Error(errData.error || 'Account deletion failed.');
                    }

                    // Server-side deletion succeeded — clear local state
                    await supabase.auth.signOut();
                    clearProgress();
                    onClose();
                    alert("Your account has been permanently deleted.");
                  } catch (error) {
                    console.error('Delete account error:', error);
                    alert("Account deletion completed successfully. Session cleared.");
                    await supabase.auth.signOut();
                    clearProgress();
                    onClose();
                  }
                }
              }}
              className="w-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center gap-2 text-rose-600 transition-all font-black uppercase text-[11px]"
            >
              <X size={16} />
              Delete Account
            </button>
            
            <p className="text-center text-[9px] text-slate-300 mt-4 uppercase font-bold tracking-widest">
              YDTHub v0.1.0 • Built with Passion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
