import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../features/auth/AuthContext';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function DashboardLayout() {
    const { user } = useAuth();
    const [showBanner, setShowBanner] = useState(true);

    const isDefaultPassword = user?.mustChangePassword === true || (user?.mustChangePassword === undefined && user?.email === 'isaacabragesh@gmail.com');

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {isDefaultPassword && showBanner && (
                    <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-500 z-50">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-white/20 rounded-lg">
                                <ShieldAlert size={18} />
                            </div>
                            <div className="text-sm font-medium">
                                <span className="font-bold">Security Alert:</span> You are using a default password. Please change it immediately to secure your account.
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/profile"
                                className="flex items-center gap-1 text-sm font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                            >
                                Secure Now <ArrowRight size={14} />
                            </Link>
                            <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                )}
                <Header />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
                    <Outlet />
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
