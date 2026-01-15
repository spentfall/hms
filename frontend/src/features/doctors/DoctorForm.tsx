import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorService, departmentService, type CreateDoctorDto } from '../../services/doctorService';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Portal } from '../../components/shared/Portal';

interface DoctorFormProps {
    onClose: () => void;
}

export function DoctorForm({ onClose }: DoctorFormProps) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateDoctorDto>();

    const { data: departments, isLoading: loadingDepartments } = useQuery({
        queryKey: ['departments'],
        queryFn: departmentService.getAll,
    });

    const createMutation = useMutation({
        mutationFn: doctorService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
            onClose();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create doctor');
        },
    });

    const onSubmit = (data: CreateDoctorDto) => {
        setError(null);
        createMutation.mutate(data);
    };

    return (
        <Portal>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Doctor</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                placeholder="doctor@hospital.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                {...register('fullName', { required: 'Full Name is required' })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                placeholder="Dr. John Doe"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                {...register('phoneNumber', { required: 'Phone Number is required' })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                placeholder="+1 234 567 890"
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Gender
                            </label>
                            <select
                                {...register('gender', { required: 'Gender is required' })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Specialization
                            </label>
                            <input
                                type="text"
                                {...register('specialization', { required: 'Specialization is required' })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                placeholder="e.g., Cardiology, Neurology"
                            />
                            {errors.specialization && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.specialization.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Department
                            </label>
                            {loadingDepartments ? (
                                <div className="text-sm text-slate-500">Loading departments...</div>
                            ) : (
                                <select
                                    {...register('departmentId', { required: 'Department is required' })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                                >
                                    <option value="">Select a department</option>
                                    {departments?.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.departmentId && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.departmentId.message}</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Doctor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Portal>
    );
}
