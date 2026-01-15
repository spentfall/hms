import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { userService } from '../../services/userService';
import { Save, User, Phone, MapPin, Camera, Loader2, Info, ArrowLeft, Sun, Moon, Bell, Shield, Languages, Palette, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ChangePasswordModal } from './ChangePasswordModal';

export function ProfileEdit() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [avatarUrl, setAvatarUrl] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [notifications, setNotifications] = useState({
        emails: true,
        browser: true,
        appointments: true,
        system: false,
    });
    const [showChangePassword, setShowChangePassword] = useState(false);

    const isDoctor = user?.role === 'DOCTOR';
    const isPatient = user?.role === 'PATIENT';

    const { data: profile, isLoading } = useQuery<any>({
        queryKey: ['profile', user?.profileId],
        queryFn: () => isDoctor ? doctorService.getById(user!.profileId!) : patientService.getById(user!.profileId!),
        enabled: !!user?.profileId,
    });

    useEffect(() => {
        if (profile) {
            setFormData(profile);
            setAvatarUrl(profile.user?.avatarUrl || user?.avatarUrl || '');
        } else if (user) {
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [profile, user]);

    const updateProfileMutation = useMutation<any, any, any>({
        mutationFn: (data: any) => {
            const profileId = user?.profileId;
            if (!profileId) throw new Error('Profile ID missing');
            if (isDoctor) return doctorService.update(profileId, data);
            return patientService.update(profileId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.profileId] });
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    });

    const updateAvatarMutation = useMutation({
        mutationFn: (url: string) => userService.updateAvatar(url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.profileId] });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Update avatar first if changed
            const currentAvatar = profile?.user?.avatarUrl || user?.avatarUrl || '';
            if (avatarUrl !== currentAvatar) {
                await updateAvatarMutation.mutateAsync(avatarUrl);
            }

            if (user?.profileId) {
                // Clean data for patient (dateOfBirth should be string or Date)
                const cleanData = { ...formData };
                if (isPatient && cleanData.dateOfBirth) {
                    cleanData.dateOfBirth = new Date(cleanData.dateOfBirth).toISOString();
                }

                // Remove nested objects
                delete cleanData.user;
                delete cleanData.department;
                delete cleanData.appointments;
                delete cleanData.id;
                delete cleanData.userId;
                if (isDoctor) delete cleanData.departmentId;

                await updateProfileMutation.mutateAsync(cleanData);
            } else if (!user?.profileId && avatarUrl !== currentAvatar) {
                // Just avatar updated for admin, consider it a success
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
                        <p className="text-slate-500">Manage your personal information and preferences</p>
                    </div>
                </div>
                {successMessage && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium border border-emerald-100 dark:border-emerald-900/20">
                        {successMessage}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Quick Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-3xl bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={48} className="text-primary" />
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="mt-6 w-full space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avatar URL</label>
                                <input
                                    type="text"
                                    value={avatarUrl || ''}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                    className="mt-1 w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <div className="flex items-start gap-3">
                                    <Info size={16} className="text-primary mt-0.5 shrink-0" />
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Use a public image URL to update your profile photo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Account Security</h3>
                        <p className="text-xs text-slate-500 mb-4">You are logged in as <span className="text-slate-900 dark:text-slate-200 font-medium">{user?.email}</span></p>
                        <div className="mt-4 space-y-2">
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="w-full py-2.5 px-4 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={logout}
                                className="w-full py-2.5 px-4 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-2">
                    {user?.profileId ? (
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <User size={16} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName || ''}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Phone size={16} /> Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.phoneNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                {isDoctor && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialization</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.specialization || ''}
                                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
                                            <input
                                                type="text"
                                                disabled
                                                value={formData.department?.name || ''}
                                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </>
                                )}

                                {isPatient && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blood Group</label>
                                            <select
                                                value={formData.bloodGroup || ''}
                                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                            >
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <MapPin size={16} /> Address
                                            </label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={formData.address || ''}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Medical History</label>
                                            <textarea
                                                rows={3}
                                                value={formData.medicalHistory || ''}
                                                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Admin Preferences Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <Palette size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Preferences</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Appearance</label>
                                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
                                            <button
                                                onClick={() => setTheme('light')}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                                                    theme === 'light' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                                )}
                                            >
                                                <Sun size={14} /> Light
                                            </button>
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                                                    theme === 'dark' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                                )}
                                            >
                                                <Moon size={14} /> Dark
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Languages size={16} /> Language
                                        </label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all">
                                            <option value="en">English (US)</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                        <Bell size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h3>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'emails', label: 'Email Notifications', desc: 'Receive daily summaries and critical updates via email.' },
                                        { id: 'browser', label: 'Browser Push Notifications', desc: 'Get real-time alerts for new system registrations.' },
                                        { id: 'appointments', label: 'Appointment Alerts', desc: 'Notification on new appointment bookings.' },
                                        { id: 'system', label: 'System Maintenance', desc: 'Early alerts for scheduled maintenance windows.' },
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center justify-between py-2">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</p>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, [item.id]: !(notifications as any)[item.id] })}
                                                className={cn(
                                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-transparent ring-offset-2",
                                                    (notifications as any)[item.id] ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                        (notifications as any)[item.id] ? "translate-x-6" : "translate-x-1"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="px-10 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70"
                                >
                                    {isSaving ? 'Saving Changes...' : 'Save All Preferences'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
        </div>
    );
}
