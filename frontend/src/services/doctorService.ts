import api from './api';

export interface Doctor {
    id: string;
    fullName: string;
    specialization: string;
    phoneNumber: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    departmentId: string;
    user: {
        id: string;
        email: string;
        role: string;
        avatarUrl?: string;
        createdAt?: string;
    };
    department: {
        id: string;
        name: string;
    };
    appointments?: any[];
}

export interface CreateDoctorDto {
    email: string;
    fullName: string;
    specialization: string;
    phoneNumber: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    departmentId: string;
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> { }

export const doctorService = {
    getAll: async () => {
        const response = await api.get<Doctor[]>('/doctors');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Doctor>(`/doctors/${id}`);
        return response.data;
    },

    create: async (data: CreateDoctorDto) => {
        const response = await api.post<Doctor>('/doctors', data);
        return response.data;
    },

    update: async (id: string, data: UpdateDoctorDto) => {
        const response = await api.patch<Doctor>(`/doctors/${id}`, data);
        return response.data;
    },

    remove: async (id: string) => {
        await api.delete(`/doctors/${id}`);
    },
};

export const departmentService = {
    getAll: async () => {
        const response = await api.get('/departments');
        return response.data;
    },

    create: async (name: string) => {
        const response = await api.post('/departments', { name });
        return response.data;
    },
};
