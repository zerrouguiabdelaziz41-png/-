import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'info':
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'info':
        return 'border-cyan-500/50 shadow-cyan-500/20';
      case 'warning':
        return 'border-amber-500/50 shadow-amber-500/20';
      case 'success':
      default:
        return 'border-emerald-500/50 shadow-emerald-500/20';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#06192e]/95 backdrop-blur-xl border ${getBorderColor()} shadow-2xl text-white text-xs sm:text-sm animate-bounce-in`}
    >
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <div>
          {toast.title && <div className="font-bold text-white text-xs">{toast.title}</div>}
          <div className="text-slate-200 font-medium">{toast.message}</div>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors p-1"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
