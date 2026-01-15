import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
    Home as HomeIcon,
    Users,
    Calendar,
    FileText,
    UserCircle,
    UserPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav() {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Home', href: '/', icon: HomeIcon, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
        { name: 'Doctors', href: '/doctors', icon: UserPlus, roles: ['ADMIN'] },
        { name: 'Patients', href: '/patients', icon: Users, roles: ['ADMIN', 'DOCTOR'] },
        { name: 'Schedule', href: '/appointments', icon: Calendar, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
        { name: 'Billing', href: '/billing', icon: FileText, roles: ['ADMIN', 'PATIENT'] },
        { name: 'Profile', href: '/profile', icon: UserCircle, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-2 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.filter(item => user && item.roles.includes(user.role)).map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-full transition-all duration-200",
                                isActive
                                    ? "text-primary scale-110"
                                    : "text-slate-500 hover:text-primary"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={cn(
                                "text-[10px] font-semibold tracking-wide",
                                isActive ? "opacity-100" : "opacity-70"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
