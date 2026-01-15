import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, User, ExternalLink, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DoctorForm } from './DoctorForm';
import { DepartmentModal } from './DepartmentModal';
import { doctorService } from '../../services/doctorService';

export function DoctorList() {
    const queryClient = useQueryClient();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDepartments, setShowDepartments] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('add') === 'true') {
            setShowForm(true);
        }
    }, [location]);

    const { data: doctors, isLoading } = useQuery({
        queryKey: ['doctors'],
        queryFn: doctorService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: doctorService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
        },
    });

    const filteredDoctors = doctors?.filter(doc =>
        doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl dark:bg-indigo-900/20"><User size={20} /></div>
                    <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{doctors?.length || 0}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Doctors</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-900/20"><Users size={20} /></div>
                    <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{[...new Set(doctors?.map(d => d.departmentId))].length || 0}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departments</p>
                    </div>
                </div>
                <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-black text-primary uppercase tracking-tight">Need more staff?</p>
                        <p className="text-[10px] font-medium text-primary/70">Register new medical professionals</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="p-2 bg-primary text-white rounded-lg hover:scale-110 transition-transform">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowDepartments(true)}
                        className="text-sm font-bold text-slate-600 dark:text-white bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        Manage Departments
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredDoctors?.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/doctors/${doctor.id}`}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{doctor.fullName}</p>
                                                <p className="text-xs text-slate-500">{doctor.user.email}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {doctor.specialization}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {doctor.department.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/doctors/${doctor.id}`}
                                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this doctor?')) {
                                                        deleteMutation.mutate(doctor.id);
                                                    }
                                                }}
                                                className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDoctors?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No doctors found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && <DoctorForm onClose={() => setShowForm(false)} />}
            {showDepartments && <DepartmentModal onClose={() => setShowDepartments(false)} />}
        </div>
    );
}
