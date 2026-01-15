import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar as CalendarIcon, Clock, User, MoreVertical, FileText } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../auth/AuthContext';

import { Portal } from '../../components/shared/Portal';

interface BookAppointmentModalProps {
    onClose: () => void;
}

export function BookAppointmentModal({ onClose }: BookAppointmentModalProps) {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [description, setDescription] = useState('');
    const [fee, setFee] = useState('150');

    const { data: doctors } = useQuery({
        queryKey: ['doctors'],
        queryFn: doctorService.getAll,
    });

    const { data: patients } = useQuery({
        queryKey: ['patients'],
        queryFn: patientService.getAll,
        enabled: user?.role === 'ADMIN' || user?.role === 'DOCTOR',
    });

    const bookMutation = useMutation({
        mutationFn: (data: any) => appointmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patientId = (user?.role === 'ADMIN' || user?.role === 'DOCTOR') ? selectedPatientId : user?.profileId;
        if (!patientId) return;

        // Combine date and time
        const combinedDate = new Date(`${date}T${time}`);

        bookMutation.mutate({
            date: combinedDate.toISOString(),
            doctorId,
            patientId,
            description,
            fee: parseFloat(fee),
        });
    }

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book Appointment</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <User size={16} /> Select Doctor
                            </label>
                            <select
                                required
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            >
                                <option value="">Select a doctor...</option>
                                {doctors?.map(doc => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.fullName} ({doc.specialization})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <User size={16} /> Select Patient
                                </label>
                                <select
                                    required
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                >
                                    <option value="">Select a patient...</option>
                                    {patients?.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.fullName || patient.user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <CalendarIcon size={16} /> Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Clock size={16} /> Time
                                </label>
                                <input
                                    required
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <MoreVertical size={16} /> Description / Reason for Visit
                            </label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please describe the reason for your visit..."
                                rows={3}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                            />
                        </div>

                        {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <FileText size={16} /> Consultation Fee ($)
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={fee}
                                    onChange={(e) => setFee(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                disabled={bookMutation.isPending}
                                type="submit"
                                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {bookMutation.isPending ? 'Booking...' : 'Confirm Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Portal>
    );
}
