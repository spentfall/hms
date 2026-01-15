import api from './api';

export type NotificationType =
    | 'APPOINTMENT_NEW'
    | 'APPOINTMENT_CANCELLED'
    | 'APPOINTMENT_CONFIRMED'
    | 'APPOINTMENT_COMPLETED'
    | 'SECURITY_ALERT'
    | 'SYSTEM_UPDATE';

export interface Notification {
    id: string;
    userId: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    getAll: async () => {
        const response = await api.get<Notification[]>('/notifications');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.patch<Notification>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.patch<Notification[]>('/notifications/read-all');
        return response.data;
    },
};
