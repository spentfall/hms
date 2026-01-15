import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../../services/patientService';
import { Plus, Search, Trash2, User, Filter, ExternalLink, Users, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PatientForm } from './PatientForm';

export function PatientList() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);

    const { data: patients, isLoading } = useQuery<any[]>({
        queryKey: ['patients'],
        queryFn: patientService.getAll,
        refetchInterval: 5000,
    });

    const deleteMutation = useMutation({
        mutationFn: patientService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });

    const filteredPatients = patients?.filter(p =>
        (p.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        p.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phoneNumber.includes(searchTerm)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-900/20"><Users size={20} /></div>
                    <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{patients?.length || 0}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl dark:bg-red-900/20"><Heart size={20} /></div>
                    <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{patients?.filter(p => !!p.bloodGroup).length || 0}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">With Blood Group</p>
                    </div>
                </div>
                <div className="md:col-span-2 p-6 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-between text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform" />
                    <div className="relative">
                        <p className="text-sm font-black uppercase tracking-tight">Need to register someone?</p>
                        <p className="text-[10px] font-medium opacity-80">Add a new patient to the system</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="relative p-3 bg-white text-indigo-600 rounded-xl hover:scale-110 transition-transform shadow-sm">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredPatients?.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/patients/${p.id}`}
                                            className="flex items-center gap-3 group"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{p.fullName || 'New Patient'}</p>
                                                <p className="text-xs text-slate-500">{p.gender}, {new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()}Y</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">{p.phoneNumber}</p>
                                        <p className="text-xs text-slate-500">{p.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                {p.bloodGroup}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(p.user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/patients/${p.id}`}
                                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            {user?.role === 'ADMIN' && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this patient?')) {
                                                            deleteMutation.mutate(p.id);
                                                        }
                                                    }}
                                                    className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPatients?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No patients found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && <PatientForm onClose={() => setShowForm(false)} />}
        </div>
    );
}
