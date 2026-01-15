import { CheckCircle2, X, FileText, Calendar, CreditCard, ExternalLink } from 'lucide-react';
import { Portal } from './Portal';
import { format } from 'date-fns';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentData: {
        txRef: string;
        amount: string;
        paidAt: Date;
        invoiceId: string;
    } | null;
}

export function PaymentSuccessModal({ isOpen, onClose, paymentData }: PaymentSuccessModalProps) {
    if (!isOpen || !paymentData) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={onClose}
                />

                <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                    {/* Header with Background Pattern */}
                    <div className="relative h-32 bg-emerald-500 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
                        </div>

                        <div className="relative h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-500 delay-150">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-white rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Payment Successful</h2>
                            <p className="text-slate-500 font-medium text-sm mt-1">Your transaction has been processed in Demo Mode.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                            <FileText size={16} className="text-slate-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">#{paymentData.invoiceId.slice(0, 8)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                            <CreditCard size={16} className="text-slate-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Ref</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono text-xs">{paymentData.txRef.split('-').slice(0, 2).join('-')}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                            <Calendar size={16} className="text-slate-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">
                                        {format(paymentData.paidAt, 'MMM dd, HH:mm')}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Amount Paid</span>
                                    <span className="text-xl font-black text-emerald-600">${parseFloat(paymentData.amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                            >
                                Back to Billing
                            </button>

                            <button className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                                <ExternalLink size={12} />
                                View Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
