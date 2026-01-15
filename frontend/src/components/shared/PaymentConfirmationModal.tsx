import { CreditCard, X, AlertCircle, Calendar, User, FileText } from 'lucide-react';
import { Portal } from './Portal';
import { format } from 'date-fns';

interface PaymentConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    invoice: any; // Using any for now to match the existing component's flexibility
}

export function PaymentConfirmationModal({ isOpen, onClose, onConfirm, isPending, invoice }: PaymentConfirmationModalProps) {
    if (!isOpen || !invoice) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={onClose}
                />

                <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Confirm Payment</h2>
                                <p className="text-slate-500 font-medium text-sm mt-1">Please review your invoice details</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Invoice Summary Card */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 mb-8 space-y-4 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                        <FileText size={16} className="text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</span>
                                </div>
                                <span className="text-sm font-black text-slate-900 dark:text-white">#{invoice.id.slice(0, 8)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                        <User size={16} className="text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Dr. {invoice.appointment.doctor.fullName}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                        <Calendar size={16} className="text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {format(new Date(invoice.issuedAt), 'MMM dd, yyyy')}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Total Amount</span>
                                <span className="text-2xl font-black text-primary">${parseFloat(invoice.amount).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl mb-8 border border-amber-100 dark:border-amber-900/30">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
                                You are about to proceed with a **Demo Mode** payment. No real funds will be deducted from your account.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                disabled={isPending}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={16} />
                                        Confirm & Pay Now
                                    </>
                                )}
                            </button>

                            <button
                                onClick={onClose}
                                disabled={isPending}
                                className="w-full py-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
