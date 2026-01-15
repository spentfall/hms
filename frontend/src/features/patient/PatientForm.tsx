import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService, type CreatePatientDto } from '../../services/patientService';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Portal } from '../../components/shared/Portal';

interface PatientFormProps {
    onClose: () => void;
}

export function PatientForm({ onClose }: PatientFormProps) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<CreatePatientDto>();

    const createMutation = useMutation({
        mutationFn: patientService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            onClose();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to register patient');
        },
    });

    const onSubmit = (data: CreatePatientDto) => {
        setError(null);
        createMutation.mutate(data);
    };

    return (
        <Portal>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Register New Patient</h2>
                            <p className="text-sm text-slate-500">Enter personal and medical details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Account Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email is required' })}
                                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        placeholder="patient@email.com"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        {...register('fullName', { required: 'Full name is required' })}
                                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date of Birth</label>
                                        <input
                                            type="date"
                                            {...register('dateOfBirth', { required: 'Date of birth is required' })}
                                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                                        <select
                                            {...register('gender', { required: 'Gender is required' })}
                                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Medical & Contact Info</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        {...register('phoneNumber', { required: 'Phone is required' })}
                                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                                    <input
                                        type="text"
                                        {...register('address', { required: 'Address is required' })}
                                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        placeholder="Street, City, State"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
                                        <select
                                            {...register('bloodGroup', { required: 'Required' })}
                                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                        >
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Emergency Contact</label>
                                        <input
                                            type="tel"
                                            {...register('emergencyContact')}
                                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                            placeholder="Relation & Phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-10 border-t border-slate-100 dark:border-slate-800 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 font-semibold"
                            >
                                {createMutation.isPending ? 'Registering...' : 'Register Patient'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Portal>
    );
}
