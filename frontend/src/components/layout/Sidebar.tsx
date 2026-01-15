import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Settings,
    LogOut,
    UserPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { ConfirmModal } from '../shared/ConfirmModal';

export function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const links = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
        { name: 'Doctors', href: '/doctors', icon: UserPlus, roles: ['ADMIN'] },
        { name: 'Patients', href: '/patients', icon: Users, roles: ['ADMIN', 'DOCTOR'] },
        { name: 'Appointments', href: '/appointments', icon: Calendar, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
        { name: 'Billing', href: '/billing', icon: FileText, roles: ['ADMIN', 'PATIENT'] },
        { name: 'Settings', href: '/profile', icon: Settings, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    ];

    return (
        <div className="hidden lg:flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64">
            <div className="p-6">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    MediSys <span className="text-primary">HMS</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {links.filter(link => user && link.roles.includes(user.role)).map((link) => {
                    const Icon = link.icon;
                    const isActive = link.href === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary"
                            )}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>

            {showLogoutConfirm && (
                <ConfirmModal
                    title="Sign Out"
                    message="Are you sure you want to end your session? You will need to login again to access your account."
                    confirmLabel="Sign Out Now"
                    cancelLabel="Stay Logged In"
                    variant="danger"
                    onStatusChange={(confirmed) => {
                        setShowLogoutConfirm(false);
                        if (confirmed) logout();
                    }}
                />
            )}
        </div>
    );
}
