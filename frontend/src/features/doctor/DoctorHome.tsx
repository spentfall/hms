import { useQuery } from '@tanstack/react-query';
import {
    Users, Calendar, Clock, CheckCircle2,
    Search, Filter, ArrowRight, UserCheck,
    CalendarDays, Activity, MoreVertical,
    ChevronRight, BookOpen
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { format, isToday } from 'date-fns';
import { Link } from 'react-router-dom';

export function DoctorHome() {
    const { user } = useAuth();

    const { data: appointments } = useQuery({
        queryKey: ['appointments', 'doctor', user?.profileId],
        queryFn: () => appointmentService.getByDoctor(user?.profileId!),
        enabled: !!user?.profileId,
        refetchInterval: 5000,
    });

    const todaysAppointments = appointments?.filter(app => isToday(new Date(app.date)) && app.status !== 'CANCELLED');
    const pendingAppointments = appointments?.filter(app => app.status === 'PENDING');
    const confirmedToday = todaysAppointments?.filter(app => app.status === 'CONFIRMED');

    const stats = [
        { label: "Today's Appointments", value: todaysAppointments?.length || 0, icon: <Calendar className="text-indigo-600" />, color: "bg-indigo-50" },
        { label: "Pending Requests", value: pendingAppointments?.length || 0, icon: <Clock className="text-amber-600" />, color: "bg-amber-50" },
        { label: "Completed Today", value: todaysAppointments?.filter(a => a.status === 'COMPLETED').length || 0, icon: <CheckCircle2 className="text-emerald-600" />, color: "bg-emerald-50" },
        { label: "Total Patients", value: [...new Set(appointments?.map(a => a.patientId))].length || 0, icon: <Users className="text-rose-600" />, color: "bg-rose-50" },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Hello, <span className="text-primary italic">Dr. {user?.fullName?.split(' ').pop() || 'Doctor'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                        You have <span className="text-indigo-600 font-bold">{confirmedToday?.length || 0} scheduled appointments</span> for the remainder of today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <Search size={20} className="text-slate-400" />
                    </button>
                    <Link to="/appointments" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                        <BookOpen size={18} /> View Schedule
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="relative">
                            <div className={`p-4 w-fit rounded-2xl ${stat.color} mb-6`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Today's Schedule</h3>
                                <p className="text-slate-500 font-medium text-sm mt-1">{format(new Date(), 'EEEE, MMMM dd')}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-colors">
                                    <Filter size={18} />
                                </button>
                                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {todaysAppointments?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center min-w-[60px]">
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{format(new Date(app.date), 'hh:mm')}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(app.date), 'a')}</p>
                                        </div>
                                        <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-slate-900 dark:text-white leading-tight uppercase">{app.patient?.fullName}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                                    app.status === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{app.description || 'General Checkup'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link to="/appointments" className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-slate-400 hover:text-primary transition-all group-hover:scale-105">
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {(!todaysAppointments || todaysAppointments.length === 0) && (
                                <div className="text-center py-20">
                                    <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CalendarDays className="text-slate-300" size={40} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No appointments today</h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Take some time to review your medical journals.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Quick Access / Actions */}
                    <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                            <UserCheck size={100} strokeWidth={1} />
                        </div>
                        <div className="relative">
                            <h3 className="text-2xl font-black tracking-tight mb-2">Ready for your<br />next patient?</h3>
                            <p className="font-bold opacity-80 mb-8 text-sm leading-relaxed">Ensure you record all vital signs and update prescriptions after each session.</p>
                            <Link to="/appointments" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                Manage Appointments <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Pending Requests Mini List */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Clock className="text-amber-500" size={16} /> Pending Requests
                            </h3>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{pendingAppointments?.length || 0} New</span>
                        </div>

                        <div className="space-y-4">
                            {pendingAppointments?.slice(0, 3).map((app) => (
                                <div key={app.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase">{app.patient?.fullName}</h4>
                                        <span className="text-[9px] font-black text-slate-400">{format(new Date(app.date), 'MMM dd')}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium mb-3 truncate">{app.description || 'No description provided'}</p>
                                    <div className="flex gap-2">
                                        <Link to="/appointments" className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase text-center hover:bg-slate-50 transition-all">
                                            Review
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {(!pendingAppointments || pendingAppointments.length === 0) && (
                                <p className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">No pending requests</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={14} className="text-primary" /> Activity Pulse
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[9px]">Weekly Patients</span>
                                <span className="text-lg font-black tracking-tight">+14%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-3/4 rounded-full" />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">You've seen <span className="text-white">12 patients</span> more than last week. Keep it up!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
