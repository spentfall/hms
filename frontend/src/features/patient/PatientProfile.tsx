import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../services/patientService';
import { ChevronLeft, Mail, Phone, MapPin, Calendar, User, Activity, Droplet, ShieldAlert, Clock, FlaskConical, CalendarCheck2, Settings, Stethoscope, Plus } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { AddLabResultModal } from './AddLabResultModal';
import { RecordVitalsModal } from './RecordVitalsModal';

export function PatientProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [showAddLabModal, setShowAddLabModal] = useState(false);
    const [showRecordVitalsModal, setShowRecordVitalsModal] = useState(false);

    const { data: patient, isLoading } = useQuery({
        queryKey: ['patient', id],
        queryFn: () => patientService.getById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Patient not found</h2>
                <button
                    onClick={() => navigate('/patients')}
                    className="mt-4 text-primary hover:underline"
                >
                    Back to Directory
                </button>
            </div>
        );
    }

    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Record</h1>
                </div>
                {(currentUser?.role === 'ADMIN' || currentUser?.role === 'DOCTOR') && (
                    <button
                        onClick={() => setShowRecordVitalsModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20"
                    >
                        <Activity size={18} />
                        Record Vitals
                    </button>
                )}
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
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold mb-4 shadow-inner overflow-hidden">
                                {patient.user.avatarUrl ? (
                                    <img src={patient.user.avatarUrl} alt={patient.fullName} className="h-full w-full object-cover" />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{patient.fullName}</h2>
                            <p className="text-slate-500 font-medium">{patient.gender}, {age} Years Old</p>

                            <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl text-center border border-red-100 dark:border-red-900/20">
                                    <Droplet className="mx-auto text-red-500 mb-1" size={20} />
                                    <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Blood Group</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{patient.bloodGroup}</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-2xl text-center border border-primary/10">
                                    <Activity className="mx-auto text-primary mb-1" size={20} />
                                    <p className="text-xs text-primary font-bold uppercase tracking-wider">Status</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">Active</p>
                                </div>
                            </div>

                            <div className="mt-8 w-full space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <Mail size={18} className="text-primary flex-shrink-0" />
                                    <span className="truncate">{patient.user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <Phone size={18} className="text-primary flex-shrink-0" />
                                    <span>{patient.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <MapPin size={18} className="text-primary flex-shrink-0" />
                                    <span className="text-left leading-snug">{patient.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-rose-900/20">
                        <h3 className="text-xs font-bold uppercase tracking-[2px] opacity-80 mb-4 flex items-center gap-2">
                            <ShieldAlert size={16} />
                            Emergency Contact
                        </h3>
                        <p className="text-lg font-bold mb-1">{patient.emergencyContact || 'Not Provided'}</p>
                        <p className="text-xs opacity-70">Primary Contact Person</p>
                    </div>
                </div>

                {/* Right Column - Medical History & results */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Medical History Placeholder */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Medical History</h3>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {patient.medicalHistory || 'No significant medical history recorded. This section can include past diagnoses, allergies, and chronic conditions.'}
                            </p>
                        </div>
                    </div>

                    {/* Recent Appointments */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                    <CalendarCheck2 size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Visits</h3>
                            </div>
                            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {patient.appointments?.length > 0 ? (
                                patient.appointments.map((appointment: any) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Stethoscope size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {appointment.description || 'Medical Consultation'}
                                                </p>
                                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    {new Date(appointment.date).toLocaleDateString()}
                                                    <span className="mx-1">•</span>
                                                    <Clock size={12} />
                                                    {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-slate-500">Doctor</p>
                                            <p className="text-sm font-bold text-primary">Dr. {appointment.doctor.fullName}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 text-sm">No recent visits recorded.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lab Results Placeholder */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <FlaskConical size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lab Results</h3>
                            </div>
                            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'DOCTOR') && (
                                <button
                                    onClick={() => setShowAddLabModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
                                >
                                    <Plus size={14} /> Add New
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(patient.labResults?.length || 0) > 0 ? (
                                patient.labResults.map((result: any) => (
                                    <div
                                        key={result.id}
                                        className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                                                <Activity size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{result.testName}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                    {new Date(result.date).toLocaleDateString(undefined, {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {result.resultUrl ? (
                                            <a
                                                href={result.resultUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary font-bold text-xs group-hover:underline"
                                            >
                                                VIEW
                                            </a>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Result pending</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 md:col-span-2 text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 text-sm">No lab results found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showAddLabModal && (
                <AddLabResultModal
                    patientId={id!}
                    onClose={() => setShowAddLabModal(false)}
                />
            )}
            {showRecordVitalsModal && (
                <RecordVitalsModal
                    patientId={id!}
                    onClose={() => setShowRecordVitalsModal(false)}
                />
            )}
        </div>
    );
}
