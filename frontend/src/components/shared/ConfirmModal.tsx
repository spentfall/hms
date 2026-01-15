import { X, AlertCircle } from 'lucide-react';
import { Portal } from '../shared/Portal';

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onStatusChange: (confirmed: boolean) => void;
    variant?: 'danger' | 'warning' | 'primary';
}

export function ConfirmModal({
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onStatusChange,
    variant = 'primary'
}: ConfirmModalProps) {
    const variantStyles = {
        primary: {
            icon: 'bg-primary/10 text-primary',
            button: 'bg-primary hover:bg-primary/90 text-white shadow-primary/20',
        },
        warning: {
            icon: 'bg-amber-100 text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
        },
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20',
        }
    };

    const style = variantStyles[variant];

    return (
        <Portal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="p-8 text-center">
                        <div className={`mx-auto w-16 h-16 rounded-2xl ${style.icon} flex items-center justify-center mb-6 animate-bounce-subtle`}>
                            <AlertCircle size={32} />
                        </div>

                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                            {message}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => onStatusChange(true)}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 ${style.button}`}
                            >
                                {confirmLabel}
                            </button>
                            <button
                                onClick={() => onStatusChange(false)}
                                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-95 italic"
                            >
                                {cancelLabel}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => onStatusChange(false)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </Portal>
    );
}
