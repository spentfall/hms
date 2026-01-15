import { DollarSign, Users, Activity, Plus, FileText, Calendar, ShieldCheck, UserPlus, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

import { useAuth } from '../auth/AuthContext';

export function AdminHome() {
    const { user } = useAuth();
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await api.get('/stats/admin');
            return response.data;
        },
        refetchInterval: 5000, // Poll stats every 5 seconds
    });

    const stats = [
        {
            name: 'Total Revenue',
            value: statsData ? `$${statsData.totalRevenue.toLocaleString()}` : '$0.00',
            change: statsData?.revenueChange || '0%',
            icon: DollarSign,
            color: 'text-blue-600'
        },
        {
            name: 'Active Patients',
            value: statsData ? statsData.activePatients.toString() : '0',
            change: statsData?.patientsChange || '0%',
            icon: Users,
            color: 'text-green-600'
        },
        {
            name: 'Appointments',
            value: statsData ? statsData.totalAppointments.toString() : '0',
            change: statsData?.appointmentsChange || '0%',
            icon: Activity,
            color: 'text-orange-600'
        },
        {
            name: 'Doctors',
            value: statsData ? statsData.totalDoctors.toString() : '0',
            change: statsData?.doctorsChange || '0',
            icon: Users,
            color: 'text-indigo-600'
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Admin <span className="text-primary italic">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Welcome back, <span className="text-indigo-600 font-bold">{user?.fullName || 'Administrator'}</span>. Here's what's happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/doctors?add=true" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <UserPlus size={18} /> Add Doctor
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20">
                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Overview Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Weekly Overview</h3>
                            <p className="text-slate-500 font-medium text-sm mt-1">Appointment volume over the last 7 days</p>
                        </div>
                    </div>

                    <div className="h-64 w-full flex items-end justify-between gap-4 px-4">
                        {statsData?.weeklyOverview?.map((data: any, i: number) => {
                            const maxCount = Math.max(...statsData.weeklyOverview.map((d: any) => d.count), 5);
                            const heightPercentage = (data.count / maxCount) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="relative w-full flex justify-center">
                                        <div
                                            className="w-full max-w-[40px] bg-indigo-50 dark:bg-slate-800 rounded-t-xl transition-all duration-700 ease-out group-hover:bg-primary/20 relative"
                                            style={{ height: `${heightPercentage}%`, minHeight: '8px' }}
                                        >
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl transition-all duration-1000 delay-300"
                                                style={{ height: data.count > 0 ? '4px' : '0px' }}
                                            />

                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                {data.count} Appts
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Recent Activity</h3>
                    <div className="space-y-6">
                        {statsData?.recentActivities?.map((activity: any) => (
                            <div key={activity.id} className="flex gap-4 group cursor-pointer">
                                <div className={cn(
                                    "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    activity.type === 'APPOINTMENT' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {activity.type === 'APPOINTMENT' ? <Calendar size={18} /> : <UserPlus size={18} />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{activity.title}</p>
                                    <p className="text-xs font-medium text-slate-500 leading-tight">{activity.description}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pt-1">
                                        <Clock size={10} /> {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/appointments" className="w-full py-4 mt-8 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        View System Logs <Plus size={14} />
                    </Link>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">System Controls</h3>
                        <p className="text-slate-400 font-medium mt-1">Direct access to core management functions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Healthy</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Export Data', icon: <FileText size={20} />, sub: 'Generate PDF reports' },
                        { label: 'Permissions', icon: <ShieldCheck size={20} />, sub: 'Roles & Access' },
                        { label: 'Schedule', icon: <Calendar size={20} />, sub: 'Global Calendar' },
                        { label: 'Patient Logs', icon: <Users size={20} />, sub: 'Audit registrations' },
                    ].map((btn) => (
                        <button key={btn.label} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all text-left group">
                            <div className="mb-4 text-indigo-400 group-hover:scale-110 transition-transform">{btn.icon}</div>
                            <p className="font-black text-sm">{btn.label}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{btn.sub}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
