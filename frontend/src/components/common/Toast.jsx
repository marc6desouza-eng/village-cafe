import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-red-800 text-white border-red-700',
    info: 'bg-charcoal-900 text-white border-charcoal-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-300 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-warm-xl border text-sm max-w-md animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bgColors[type] || bgColors.info}`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
