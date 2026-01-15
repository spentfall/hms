import { useQuery } from '@tanstack/react-query';
import {
    Activity, Heart, Droplet,
    Calendar, ChevronRight, Plus,
    Pill, History, Lightbulb, Grape, Dumbbell, Brain
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { vitalService } from '../../services/vitalService';
import { medicationService } from '../../services/medicationService';
import { appointmentService } from '../../services/appointmentService';
import { format, isAfter } from 'date-fns';
import { useState, useEffect } from 'react';

export default function PatientHome() {
    const { user } = useAuth();
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const healthTips = [
        {
            title: "Daily Hydration",
            description: "Drink at least 8 glasses of water daily to maintain kidney function.",
            icon: <Droplet className="text-blue-500" />,
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: "Balanced Diet",
            description: "Include more leafy greens and seasonal fruits in your meals.",
            icon: <Grape className="text-purple-500" />,
            bgColor: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            title: "Stay Active",
            description: "A 30-minute walk daily can improve your cardiovascular health.",
            icon: <Dumbbell className="text-orange-500" />,
            bgColor: "bg-orange-50 dark:bg-orange-900/20"
        },
        {
            title: "Mental Wellness",
            description: "Practice mindfulness and get at least 7 hours of quality sleep.",
            icon: <Brain className="text-indigo-500" />,
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTipIndex(prev => (prev + 1) % healthTips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const { data: vitals } = useQuery<any[]>({
        queryKey: ['vitals', user?.profileId],
        queryFn: () => vitalService.getLatestByPatient(user?.profileId!),
        enabled: !!user?.profileId,
        refetchInterval: 5000,
    });

    const { data: medications } = useQuery<any[]>({
        queryKey: ['medications', user?.profileId],
        queryFn: () => medicationService.getByPatient(user?.profileId!),
        enabled: !!user?.profileId,
        refetchInterval: 5000,
    });

    const { data: appointments } = useQuery<any[]>({
        queryKey: ['appointments', user?.profileId],
        queryFn: () => appointmentService.getByPatient(user?.profileId!),
        enabled: !!user?.profileId,
        refetchInterval: 5000,
    });

    const nextAppointment = appointments?.find(app => isAfter(new Date(app.date), new Date()) && app.status !== 'CANCELLED');
    const pastAppointments = appointments?.filter(app => !isAfter(new Date(app.date), new Date())).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);

    const getVitalIcon = (type: string) => {
        switch (type) {
            case 'BLOOD_PRESSURE': return <Activity className="text-blue-500" />;
            case 'HEART_RATE': return <Heart className="text-rose-500" />;
            case 'BLOOD_GLUCOSE': return <Droplet className="text-emerald-500" />;
            default: return <Activity className="text-indigo-500" />;
        }
    };

    const getVitalColor = (type: string) => {
        switch (type) {
            case 'BLOOD_PRESSURE': return 'bg-blue-50 dark:bg-blue-900/20';
            case 'HEART_RATE': return 'bg-rose-50 dark:bg-rose-900/20';
            case 'BLOOD_GLUCOSE': return 'bg-emerald-50 dark:bg-emerald-900/20';
            default: return 'bg-indigo-50 dark:bg-indigo-900/20';
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Welcome back, <span className="text-primary italic">{user?.fullName || 'Patient'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                        You have <span className="text-indigo-600 font-bold">{medications?.filter(m => m.status === 'ACTIVE').length || 0} medical actions</span> requiring attention today.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95">
                    <Plus size={18} /> Book an Appointment
                </button>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Blood Pressure', type: 'BLOOD_PRESSURE', unit: 'mmHg', trend: '-2% High', trendColor: 'text-rose-600 bg-rose-50' },
                    { title: 'Heart Rate', type: 'HEART_RATE', unit: 'bpm', trend: '+1% Normal', trendColor: 'text-emerald-600 bg-emerald-50' },
                    { title: 'Blood Glucose', type: 'BLOOD_GLUCOSE', unit: 'mg/dL', trend: '-3% Stable', trendColor: 'text-amber-600 bg-amber-50' }
                ].map((item) => {
                    const vital = vitals?.find(v => v.type === item.type);
                    return (
                        <div key={item.title} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-4 rounded-2xl ${getVitalColor(item.type)}`}>
                                        {getVitalIcon(item.type)}
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${item.trendColor}`}>
                                        {item.trend}
                                    </span>
                                </div>

                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                        {vital ? vital.value : '--/--'}
                                    </h3>
                                    <span className="text-sm font-bold text-slate-400">{item.unit}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Medications Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Today's Medications</h3>
                                <p className="text-slate-500 font-medium text-sm mt-1">Don't forget to take your prescriptions</p>
                            </div>
                            <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                {medications?.filter(m => m.status === 'ACTIVE').length || 0} Reminders
                            </span>
                        </div>

                        <div className="space-y-4">
                            {medications?.filter(m => m.status === 'ACTIVE').map((med) => (
                                <div key={med.id} className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className="h-6 w-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-primary transition-colors">
                                            <div className="h-3 w-3 rounded-sm bg-primary scale-0 group-hover:scale-100 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">{med.name} — {med.dosage}</h4>
                                            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{med.frequency} Dose • Scheduled for 8:00 AM</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">Upcoming</span>
                                </div>
                            ))}
                            {(!medications || medications.length === 0) && (
                                <div className="text-center py-10">
                                    <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Pill className="text-slate-300" size={32} />
                                    </div>
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No medications prescribed</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medical History Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <History className="text-primary" /> My Medical History
                            </h3>
                        </div>

                        <div className="space-y-4 relative">
                            <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

                            {pastAppointments?.map((app, idx) => (
                                <div key={app.id} className="relative pl-20 group">
                                    <div className={`absolute left-[34px] top-8 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 transition-all group-hover:scale-125 ${idx === 0 ? 'bg-primary' : 'bg-slate-300'}`} />

                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{format(new Date(app.date), 'MMM dd, yyyy')}</span>
                                            <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">Routine Checkup</span>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize mb-2">{app.description || 'General Health Examination'}</h4>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            Conducted by Dr. {app.doctor?.fullName || 'Doctor'}. All vitals normal. Recommended continued healthy lifestyle.
                                        </p>
                                        <button className="text-primary font-black text-[10px] uppercase tracking-widest mt-4 inline-flex items-center gap-2 hover:underline">
                                            View Report <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Healthy Living Tips Carousel */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Lightbulb size={16} className="text-amber-500" /> Healthy Tips
                            </h3>
                            <div className="flex gap-1.5">
                                {healthTips.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentTipIndex ? 'w-6 bg-primary' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative h-48">
                            {healthTips.map((tip, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 transition-all duration-700 transform ${idx === currentTipIndex
                                        ? 'opacity-100 translate-x-0'
                                        : 'opacity-0 translate-x-8'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl ${tip.bgColor} flex items-center justify-center mb-6`}>
                                        {tip.icon}
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{tip.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {tip.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                            <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                Explore Wellness Guide <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Next Appointment Card */}
                    {nextAppointment ? (
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                                <Calendar size={80} strokeWidth={1} />
                            </div>

                            <div className="relative">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-8">Next Appointment</p>

                                <div className="mb-8">
                                    <h4 className="text-3xl font-black tracking-tight">{format(new Date(nextAppointment.date), 'MMM dd')}</h4>
                                    <p className="font-bold opacity-80 mt-1">{format(new Date(nextAppointment.date), 'eeee, hh:mm a')}</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 flex items-center gap-4 border border-white/10 hover:bg-white/20 transition-all">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/10 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nextAppointment.doctor?.fullName || 'D')}&background=random`} alt="Doctor" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">Dr. {nextAppointment.doctor?.fullName}</p>
                                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-0.5">{nextAppointment.doctor?.specialization}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Calendar className="mx-auto text-slate-300 mb-4" size={40} />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No upcoming appointments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
