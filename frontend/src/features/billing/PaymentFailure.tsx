import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';

export function PaymentFailure() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const txRef = searchParams.get('tx_ref') || searchParams.get('txRef');
    const message = searchParams.get('message') || 'Payment was not completed';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-red-200 dark:border-red-900">
                {/* Failure Header */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
                        <XCircle size={48} className="text-red-600" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Payment Failed</h1>
                    <p className="text-red-100 font-medium">We couldn't process your payment</p>
                </div>

                {/* Failure Details */}
                <div className="p-8 space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                        <h3 className="font-black text-slate-900 dark:text-white mb-2">What happened?</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{message}</p>

                        {txRef && (
                            <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Transaction Reference</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{txRef}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Common Reasons */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
                        <h3 className="font-black text-slate-900 dark:text-white mb-3">Common reasons for payment failure:</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Insufficient funds in your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Payment was cancelled by user</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Network or connection issues</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Invalid card details or expired card</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Transaction timeout</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate('/billing')}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                        >
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Go to Dashboard
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Need help? Contact our support team for assistance with your payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
