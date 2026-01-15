import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCircle, Clock, Info, ShieldAlert, X, Eye } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { NotificationType } from '../../services/notificationService';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getAll,
        refetchInterval: 5000, // Poll every 5 seconds for faster updates
    });

    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'APPOINTMENT_NEW': return <Clock className="text-blue-500" size={16} />;
            case 'APPOINTMENT_CONFIRMED': return <CheckCircle className="text-emerald-500" size={16} />;
            case 'APPOINTMENT_CANCELLED': return <X className="text-red-500" size={16} />;
            case 'APPOINTMENT_COMPLETED': return <CheckCircle className="text-primary" size={16} />;
            case 'SECURITY_ALERT': return <ShieldAlert className="text-amber-500" size={16} />;
            default: return <Info className="text-slate-400" size={16} />;
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsReadMutation.mutate()}
                                className="text-[11px] font-semibold text-primary hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {notifications?.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                    <Bell size={24} />
                                </div>
                                <p className="text-sm text-slate-500">All caught up! No new notifications.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {notifications?.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group",
                                            !notification.isRead && "bg-primary/5 border-l-2 border-primary"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="space-y-1 pr-4">
                                                <p className={cn(
                                                    "text-sm leading-snug",
                                                    notification.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white font-medium"
                                                )}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    {format(new Date(notification.createdAt), 'MMM dd, hh:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Mark as read"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
