import { useAuth } from '../../features/auth/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            {/* Search Bar - Hidden on small mobile, compact on others */}
            <div className="flex items-center gap-2 max-w-[200px] sm:max-w-md w-full bg-slate-100 dark:bg-slate-800 rounded-lg px-3 sm:px-4 py-2 text-slate-500">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none focus:outline-none text-xs sm:text-sm w-full"
                />
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <NotificationCenter />

                <Link to="/profile" className="flex items-center gap-2 sm:gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded-xl transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{user?.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-medium capitalize">{user?.role.toLowerCase()}</p>
                    </div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs sm:text-base overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            user?.fullName?.[0]?.toUpperCase() || '?'
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}
