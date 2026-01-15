import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalService, type VitalType } from '../../services/vitalService';
import { X, Activity, Heart, Droplet, Thermometer, Weight } from 'lucide-react';

interface RecordVitalsModalProps {
    patientId: string;
    onClose: () => void;
}

interface VitalsForm {
    bloodPressure: string;
    heartRate: string;
    bloodGlucose: string;
    temperature: string;
    weight: string;
}

export function RecordVitalsModal({ patientId, onClose }: RecordVitalsModalProps) {
    const queryClient = useQueryClient();
    const [vitals, setVitals] = useState<VitalsForm>({
        bloodPressure: '',
        heartRate: '',
        bloodGlucose: '',
        temperature: '',
        weight: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createVitalMutation = useMutation({
        mutationFn: (data: { type: VitalType; value: string; unit: string }) =>
            vitalService.create({
                patientId,
                ...data,
            }),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const promises = [];

            if (vitals.bloodPressure) {
                promises.push(createVitalMutation.mutateAsync({
                    type: 'BLOOD_PRESSURE',
                    value: vitals.bloodPressure,
                    unit: 'mmHg',
                }));
            }
            if (vitals.heartRate) {
                promises.push(createVitalMutation.mutateAsync({
                    type: 'HEART_RATE',
                    value: vitals.heartRate,
                    unit: 'bpm',
                }));
            }
            if (vitals.bloodGlucose) {
                promises.push(createVitalMutation.mutateAsync({
                    type: 'BLOOD_GLUCOSE',
                    value: vitals.bloodGlucose,
                    unit: 'mg/dL',
                }));
            }
            if (vitals.temperature) {
                promises.push(createVitalMutation.mutateAsync({
                    type: 'TEMPERATURE',
                    value: vitals.temperature,
                    unit: '°C',
                }));
            }
            if (vitals.weight) {
                promises.push(createVitalMutation.mutateAsync({
                    type: 'WEIGHT',
                    value: vitals.weight,
                    unit: 'kg',
                }));
            }

            if (promises.length === 0) {
                setError('Please enter at least one vital sign');
                setIsSubmitting(false);
                return;
            }

            await Promise.all(promises);
            queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
            queryClient.invalidateQueries({ queryKey: ['vitals', patientId] });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to record vitals');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Record Vitals</h2>
                            <p className="text-sm text-slate-500">Capture current patient health metrics</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Activity size={16} className="text-rose-500" />
                                Blood Pressure
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vitals.bloodPressure}
                                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                                    placeholder="120/80"
                                    className="w-full pl-4 pr-16 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">mmHg</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Heart size={16} className="text-red-500" />
                                Heart Rate
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vitals.heartRate}
                                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                    placeholder="72"
                                    className="w-full pl-4 pr-16 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">bpm</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Droplet size={16} className="text-blue-500" />
                                Blood Glucose
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vitals.bloodGlucose}
                                    onChange={(e) => setVitals({ ...vitals, bloodGlucose: e.target.value })}
                                    placeholder="95"
                                    className="w-full pl-4 pr-20 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">mg/dL</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Thermometer size={16} className="text-orange-500" />
                                Temperature
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vitals.temperature}
                                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                                    placeholder="36.5"
                                    className="w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">°C</span>
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Weight size={16} className="text-indigo-500" />
                                Body Weight
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vitals.weight}
                                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                                    placeholder="70.5"
                                    className="w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Vitals'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
