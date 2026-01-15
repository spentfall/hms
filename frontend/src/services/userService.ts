import api from './api';

export const userService = {
    updateAvatar: async (avatarUrl: string) => {
        const response = await api.patch('/users/profile', { avatarUrl });
        return response.data;
    },
    changePassword: async (data: any) => {
        const response = await api.patch('/users/change-password', data);
        return response.data;
    },
};
