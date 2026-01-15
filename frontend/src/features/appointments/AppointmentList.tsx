import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Search, User, Clock, CheckCircle, XCircle, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../auth/AuthContext';
import { format } from 'date-fns';
import { BookAppointmentModal } from './BookAppointmentModal';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';
import { ConfirmModal } from '../../components/shared/ConfirmModal';

export function AppointmentList() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [showBookModal, setShowBookModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => {
            if (user?.role === 'ADMIN') return appointmentService.getAll();
            if (user?.role === 'DOCTOR' && user.profileId) return appointmentService.getByDoctor(user.profileId);
            if (user?.role === 'PATIENT' && user.profileId) return appointmentService.getByPatient(user.profileId);
            return Promise.resolve([]);
        },
        refetchInterval: 5000, // Poll every 5 seconds
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, fee }: { id: string, status: any, fee?: number }) =>
            appointmentService.update(id, { status, fee }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            if (selectedAppointment?.id === data.id) {
                setSelectedAppointment(data);
            }
        },
    });
    const deleteMutation = useMutation({
        mutationFn: (id: string) => appointmentService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            setSelectedAppointment(null);
            setAppointmentToDelete(null);
        },
        onError: (error) => {
            console.error('Failed to delete appointment:', error);
            setAppointmentToDelete(null);
        }
    });

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const filteredAppointments = appointments?.filter(app =>
        app.doctor?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
                    <p className="text-slate-500">View and manage medical appointments</p>
                </div>
                {(user?.role === 'PATIENT' || user?.role === 'ADMIN' || user?.role === 'DOCTOR') && (
                    <button
                        onClick={() => setShowBookModal(true)}
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Book New Appointment
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {user?.role === 'PATIENT' ? 'Doctor' : 'Patient'}
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredAppointments?.map((app) => (
                                <tr
                                    key={app.id}
                                    onClick={() => setSelectedAppointment(app)}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                            <Calendar size={16} className="text-slate-400" />
                                            {format(new Date(app.date), 'MMM dd, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Clock size={14} />
                                            {format(new Date(app.date), 'hh:mm a')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {user?.role === 'PATIENT' ? app.doctor?.fullName : app.patient?.fullName}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {user?.role === 'PATIENT' ? app.doctor?.specialization : app.patient?.phoneNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={app.description}>
                                            {app.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && app.status === 'PENDING' && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateStatusMutation.mutate({ id: app.id, status: 'CONFIRMED' });
                                                        }}
                                                        className="text-green-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                                                        title="Confirm"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateStatusMutation.mutate({ id: app.id, status: 'CANCELLED' });
                                                        }}
                                                        className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === app.id ? null : app.id);
                                                    }}
                                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {openMenuId === app.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAppointment(app);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                                                        >
                                                            <Calendar size={14} /> View Details
                                                        </button>
                                                        {user?.role === 'ADMIN' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAppointmentToDelete(app);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                            >
                                                                <Trash2 size={14} /> Delete Appointment
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppointments?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No appointments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showBookModal && <BookAppointmentModal onClose={() => setShowBookModal(false)} />}
            {selectedAppointment && (
                <AppointmentDetailsModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onStatusChange={(id, status, fee) => {
                        updateStatusMutation.mutate(
                            { id, status, fee },
                            {
                                onSuccess: (data) => {
                                    setSelectedAppointment(data);
                                }
                            }
                        );
                    }}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isUpdating={updateStatusMutation.isPending}
                    isDeleting={deleteMutation.isPending}
                />
            )}
            {appointmentToDelete && (
                <ConfirmModal
                    title="Delete Appointment"
                    message={`Are you sure you want to delete the appointment for ${appointmentToDelete.patient?.fullName}? This action cannot be undone.`}
                    confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
                    variant="danger"
                    onStatusChange={(confirmed) => {
                        if (confirmed) {
                            deleteMutation.mutate(appointmentToDelete.id);
                        } else {
                            setAppointmentToDelete(null);
                        }
                    }}
                />
            )}
        </div>
    );
}
