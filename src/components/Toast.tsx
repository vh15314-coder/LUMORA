import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl text-slate-100 text-xs font-medium">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
