import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../../services/doctorService';
import { X, Plus, Trash2 } from 'lucide-react';

interface DepartmentModalProps {
    onClose: () => void;
}

export function DepartmentModal({ onClose }: DepartmentModalProps) {
    const queryClient = useQueryClient();
    const [newDeptName, setNewDeptName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { data: departments, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: departmentService.getAll,
    });

    const createMutation = useMutation({
        mutationFn: departmentService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            setNewDeptName('');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to add department');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeptName.trim()) return;
        setError(null);
        createMutation.mutate(newDeptName);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Departments</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                            placeholder="New department name..."
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-slate-800 dark:text-white transition-all outline-none"
                        />
                        <button
                            type="submit"
                            disabled={createMutation.isPending || !newDeptName}
                            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <Plus size={20} />
                        </button>
                    </form>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {isLoading ? (
                            <p className="text-center text-slate-500">Loading...</p>
                        ) : (
                            departments?.map((dept: any) => (
                                <div
                                    key={dept.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                >
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{dept.name}</span>
                                    <span className="text-xs text-slate-400">{dept._count?.doctors || 0} doctors</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
