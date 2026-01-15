import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, FileText, Clock } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { format } from 'date-fns';

export function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const txRef = searchParams.get('tx_ref') || searchParams.get('txRef');

    useEffect(() => {
        if (txRef) {
            verifyPayment();
        } else {
            setError('No transaction reference found');
            setLoading(false);
        }
    }, [txRef]);

    const verifyPayment = async () => {
        try {
            setLoading(true);
            const result = await paymentService.verifyPayment(txRef!);
            setPayment(result);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to verify payment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border border-red-200 dark:border-red-900">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock size={40} className="text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Verification Failed</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/billing')}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20"
                    >
                        Return to Billing
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 dark:border-emerald-900">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce">
                        <CheckCircle2 size={48} className="text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
                    <p className="text-emerald-100 font-medium">Your payment has been processed successfully</p>
                </div>

                {/* Payment Details */}
                <div className="p-8 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Transaction Reference</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{payment.txRef}</span>
                        </div>

                        {payment.chapaReference && (
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Chapa Reference</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{payment.chapaReference}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Amount Paid</span>
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payment Method</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white capitalize">
                                {payment.paymentMethod || 'N/A'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {payment.status}
                            </span>
                        </div>

                        {payment.paidAt && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payment Date</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                    {format(new Date(payment.paidAt), 'MMM dd, yyyy - hh:mm a')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Success Message */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                            <FileText className="text-emerald-600 dark:text-emerald-400 mt-1" size={20} />
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white mb-1">Invoice Updated</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Your invoice has been marked as paid. You can view your payment history in the billing section.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate('/billing')}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                        >
                            View Billing
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-6 rounded-xl transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
