import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services/doctorService';
import { ChevronLeft, Mail, Stethoscope, Building2, Calendar, Clock, User, Activity, CalendarCheck2, Settings } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function DoctorProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const { data: doctor, isLoading } = useQuery({
        queryKey: ['doctor', id],
        queryFn: () => doctorService.getById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doctor not found</h2>
                <button
                    onClick={() => navigate('/doctors')}
                    className="mt-4 text-primary hover:underline"
                >
                    Back to Doctors List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Doctor Profile</h1>
                </div>
                {currentUser?.profileId === id && (
                    <button
                        onClick={() => navigate('/profile/edit')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all shadow-sm"
                    >
                        <Settings size={18} />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
                                {doctor.user.avatarUrl ? (
                                    <img src={doctor.user.avatarUrl} alt={doctor.fullName} className="h-full w-full object-cover" />
                                ) : (
                                    <Stethoscope size={40} />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Dr. {doctor.fullName}</h2>
                            <p className="text-primary font-semibold text-sm px-3 py-1 bg-primary/5 rounded-full">{doctor.specialization}</p>

                            <div className="mt-8 w-full space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <Mail size={18} className="text-primary" />
                                    <span className="truncate">{doctor.user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <Building2 size={18} className="text-primary" />
                                    <span>{doctor.department.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <Calendar size={18} className="text-primary" />
                                    <span>Joined {doctor.user.createdAt ? new Date(doctor.user.createdAt).toLocaleDateString() : 'Recent'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-primary/95 rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-6 flex items-center gap-2">
                            <Activity size={16} />
                            Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <p className="text-2xl font-bold">{doctor.appointments?.length || 0}</p>
                                <p className="text-xs opacity-70">Total Appointments</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <p className="text-2xl font-bold">4.9</p>
                                <p className="text-xs opacity-70">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Appointments */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <CalendarCheck2 size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Appointments</h3>
                            </div>
                            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {doctor.appointments && doctor.appointments.length > 0 ? (
                                doctor.appointments.map((apt: any) => (
                                    <div
                                        key={apt.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{apt.patient.fullName}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(apt.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            apt.status === 'PENDING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500">No appointments found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* About / Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Availability</h3>
                            <div className="space-y-3">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                    <div key={day} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">{day}</span>
                                        <span className="text-slate-900 dark:text-white font-bold">09:00 AM - 05:00 PM</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {['General Consultation', 'Post-Op Care', 'Diagnosis'].map(s => (
                                    <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
