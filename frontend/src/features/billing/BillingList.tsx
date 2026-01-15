import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CreditCard, Clock, CheckCircle2, AlertCircle, FileText, Filter, ChevronRight, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import { billingService, type Invoice } from '../../services/billingService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../auth/AuthContext';
import { format } from 'date-fns';

import { PaymentSuccessModal } from '../../components/shared/PaymentSuccessModal';
import { PaymentConfirmationModal } from '../../components/shared/PaymentConfirmationModal';

export function BillingList() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [successModalData, setSuccessModalData] = useState<{
        txRef: string;
        amount: string;
        paidAt: Date;
        invoiceId: string;
    } | null>(null);

    const { data: invoices, isLoading } = useQuery({
        queryKey: ['invoices'],
        queryFn: () => {
            if (user?.role === 'ADMIN') return billingService.getAll();
            if (user?.role === 'PATIENT' && user.profileId) return billingService.getByPatient(user.profileId);
            return Promise.resolve([]);
        },
        refetchInterval: 10000,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: 'PAID' | 'UNPAID' }) =>
            billingService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
    });

    const demoPaymentMutation = useMutation({
        mutationFn: (invoiceId: string) => paymentService.simulatePayment(invoiceId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            setSuccessModalData({
                txRef: data.txRef,
                amount: data.amount,
                paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
                invoiceId: data.invoiceId,
            });

            setIsConfirmModalOpen(false);
            setSelectedInvoice(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Payment failed');
            setIsConfirmModalOpen(false);
        },
    });

    const handlePayNowInitiate = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmPayment = () => {
        if (selectedInvoice) {
            demoPaymentMutation.mutate(selectedInvoice.id);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800';
            case 'UNPAID':
                return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:border-slate-800';
        }
    };

    const filteredInvoices = invoices?.filter(invoice => {
        const matchesSearch =
            invoice.appointment.patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.appointment.doctor?.fullName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Billing & Invoices</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage payments and medical service invoices</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                ${invoices?.filter(i => i.status === 'PAID').reduce((acc, i) => acc + parseFloat(i.amount), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-2xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payments</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                ${invoices?.filter(i => i.status === 'UNPAID').reduce((acc, i) => acc + parseFloat(i.amount), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Invoices</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {invoices?.filter(i => i.status === 'PAID').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400 mr-2" />
                        <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                            {(['ALL', 'PAID', 'UNPAID'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === status
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {status === 'ALL' ? 'Everything' : status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Invoice Details</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    {user?.role === 'PATIENT' ? 'Doctor' : 'Patient'}
                                </th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredInvoices?.map((invoice) => (
                                <tr key={invoice.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">#{invoice.id.slice(0, 8)}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                        {format(new Date(invoice.issuedAt), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-bold">
                                                    {user?.role === 'PATIENT' ? `Dr. ${invoice.appointment.doctor.fullName}` : invoice.appointment.patient.fullName}
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                    {user?.role === 'PATIENT' ? invoice.appointment.doctor.specialization : invoice.appointment.patient.phoneNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">${parseFloat(invoice.amount).toFixed(2)}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusStyles(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    {user?.role === 'ADMIN' && (
                                        <td className="px-8 py-6 text-right">
                                            {invoice.status === 'UNPAID' ? (
                                                <button
                                                    onClick={() => updateStatusMutation.mutate({ id: invoice.id, status: 'PAID' })}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-600/20 active:scale-95 uppercase tracking-widest"
                                                >
                                                    Mark Paid
                                                </button>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle2 size={12} /> Complete
                                                </div>
                                            )}
                                        </td>
                                    )}
                                    {user?.role === 'PATIENT' && (
                                        <td className="px-8 py-6 text-right">
                                            {invoice.status === 'UNPAID' ? (
                                                <button
                                                    onClick={() => handlePayNowInitiate(invoice)}
                                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 gap-2"
                                                >
                                                    <CreditCard className="w-3 h-3" />
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="inline-flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg">
                                                        <CheckCircle2 size={12} /> Paid
                                                    </div>
                                                    {invoice.payments && invoice.payments.length > 0 && (
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                                {format(new Date(invoice.payments[0].paidAt), 'MMM dd, HH:mm')}
                                                            </p>
                                                            <p className="text-[9px] font-medium text-slate-400 font-mono">
                                                                REF: {invoice.payments[0].txRef.split('-').slice(0, 2).join('-')}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredInvoices?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                                                <AlertCircle size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-bold">No invoices found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400">Total Records: {filteredInvoices?.length}</p>
                    <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                        Print Report <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <PaymentConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmPayment}
                isPending={demoPaymentMutation.isPending}
                invoice={selectedInvoice}
            />

            <PaymentSuccessModal
                isOpen={!!successModalData}
                onClose={() => setSuccessModalData(null)}
                paymentData={successModalData}
            />
        </div>
    );
}
