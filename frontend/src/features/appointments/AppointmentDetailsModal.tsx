import { useState } from 'react';
import { X, Calendar, Clock, User, Stethoscope, FileText, CheckCircle, XCircle, AlertCircle, CheckCircle2, Loader2, Activity, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../auth/AuthContext';
import { Portal } from '../../components/shared/Portal';
import { vitalService } from '../../services/vitalService';

interface AppointmentDetailsModalProps {
    appointment: any;
    onClose: () => void;
    onStatusChange?: (id: string, status: string, fee?: number) => void;
    onDelete?: (id: string) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
}

export function AppointmentDetailsModal({ appointment, onClose, onStatusChange, onDelete, isUpdating, isDeleting }: AppointmentDetailsModalProps) {
    const { user } = useAuth();
    const [fee, setFee] = useState(appointment.fee?.toString() || '150');
    const [vitals, setVitals] = useState({
        BLOOD_PRESSURE: '',
        HEART_RATE: '',
        BLOOD_GLUCOSE: '',
    });
    const [isSavingVitals, setIsSavingVitals] = useState(false);

    const handleRecordVitals = async () => {
        if (!vitals.BLOOD_PRESSURE && !vitals.HEART_RATE && !vitals.BLOOD_GLUCOSE) return;

        setIsSavingVitals(true);
        try {
            if (vitals.BLOOD_PRESSURE) {
                await vitalService.create({
                    patientId: appointment.patientId,
                    type: 'BLOOD_PRESSURE' as any,
                    value: vitals.BLOOD_PRESSURE,
                    unit: 'mmHg'
                });
            }
            if (vitals.HEART_RATE) {
                await vitalService.create({
                    patientId: appointment.patientId,
                    type: 'HEART_RATE' as any,
                    value: vitals.HEART_RATE,
                    unit: 'bpm'
                });
            }
            if (vitals.BLOOD_GLUCOSE) {
                await vitalService.create({
                    patientId: appointment.patientId,
                    type: 'BLOOD_GLUCOSE' as any,
                    value: vitals.BLOOD_GLUCOSE,
                    unit: 'mg/dL'
                });
            }
        } catch (error) {
            console.error('Failed to save vitals:', error);
        } finally {
            setIsSavingVitals(false);
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="text-green-500" size={20} />;
            case 'PENDING': return <AlertCircle className="text-yellow-500" size={20} />;
            case 'COMPLETED': return <CheckCircle2 className="text-blue-500" size={20} />;
            case 'CANCELLED': return <XCircle className="text-red-500" size={20} />;
            default: return <AlertCircle className="text-slate-500" size={20} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                <Calendar size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appointment Details</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 text-slate-900 dark:text-slate-200">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(appointment.status)}
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment ID</p>
                                <p className="text-xs font-mono mt-1 text-slate-400">#{appointment.id.slice(0, 8)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar size={14} /> Date
                                </p>
                                <p className="font-semibold">{format(new Date(appointment.date), 'MMMM dd, yyyy')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Clock size={14} /> Time
                                </p>
                                <p className="font-semibold">{format(new Date(appointment.date), 'hh:mm a')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl">
                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</p>
                                    <p className="font-bold text-slate-900 dark:text-white uppercase">{appointment.patient?.fullName}</p>
                                    <p className="text-xs text-slate-500">{appointment.patient?.phoneNumber || 'No phone provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl">
                                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Doctor</p>
                                    <p className="font-bold text-slate-900 dark:text-white">Dr. {appointment.doctor?.fullName}</p>
                                    <p className="text-xs text-slate-500">{appointment.doctor?.specialization}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Description / Reason
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm leading-relaxed min-h-[100px]">
                                {appointment.description || 'No description provided.'}
                            </div>
                        </div>

                        {user?.role === 'DOCTOR' && (appointment.status === 'CONFIRMED' || appointment.status === 'PENDING') && (
                            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Activity size={18} className="text-indigo-600" />
                                    <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">Record Patient Vitals</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-1">BP (mmHg)</label>
                                        <input
                                            type="text"
                                            placeholder="120/80"
                                            value={vitals.BLOOD_PRESSURE}
                                            onChange={(e) => setVitals(prev => ({ ...prev, BLOOD_PRESSURE: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-1">HR (bpm)</label>
                                        <input
                                            type="text"
                                            placeholder="72"
                                            value={vitals.HEART_RATE}
                                            onChange={(e) => setVitals(prev => ({ ...prev, HEART_RATE: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-1">BG (mg/dL)</label>
                                        <input
                                            type="text"
                                            placeholder="95"
                                            value={vitals.BLOOD_GLUCOSE}
                                            onChange={(e) => setVitals(prev => ({ ...prev, BLOOD_GLUCOSE: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && appointment.status === 'PENDING' && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} /> Consultation Fee ($)
                                </p>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={fee}
                                    onChange={(e) => setFee(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                        )}

                        {!((user?.role === 'ADMIN' || user?.role === 'DOCTOR') && appointment.status === 'PENDING') && (
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} /> Consultation Fee
                                </p>
                                <p className="font-semibold text-primary text-xl tracking-tight">${Number(appointment.fee).toFixed(2)}</p>
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Close
                            </button>

                            {user?.role === 'ADMIN' && onDelete && (
                                <button
                                    onClick={() => onDelete(appointment.id)}
                                    disabled={isDeleting}
                                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Delete Appointment"
                                >
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                </button>
                            )}

                            {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && appointment.status === 'PENDING' && onStatusChange && (
                                <>
                                    <button
                                        onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
                                        disabled={isUpdating}
                                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                                        title="Cancel Appointment"
                                    >
                                        {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(appointment.id, 'CONFIRMED', parseFloat(fee))}
                                        disabled={isUpdating}
                                        className="flex-[2] py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                        Confirm Appointment
                                    </button>
                                </>
                            )}

                            {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && appointment.status === 'CONFIRMED' && onStatusChange && (
                                <button
                                    onClick={async () => {
                                        await handleRecordVitals();
                                        onStatusChange(appointment.id, 'COMPLETED');
                                    }}
                                    disabled={isUpdating || isSavingVitals}
                                    className="flex-[2] py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUpdating || isSavingVitals ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                    Finish Appointment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
