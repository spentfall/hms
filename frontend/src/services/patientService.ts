import api from './api';

export interface Patient {
    id: string;
    fullName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber: string;
    address: string;
    bloodGroup: string;
    emergencyContact?: string;
    medicalHistory?: string | null;
    appointments: any[];
    labResults?: any[];
    user: {
        id: string;
        email: string;
        role: string;
        avatarUrl?: string;
        createdAt: string;
    };
}

export interface CreatePatientDto {
    email: string;
    fullName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber: string;
    address: string;
    bloodGroup: string;
    emergencyContact?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> { }

export const patientService = {
    getAll: async () => {
        const response = await api.get<Patient[]>('/patients');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Patient>(`/patients/${id}`);
        return response.data;
    },

    create: async (data: CreatePatientDto) => {
        const response = await api.post('/patients', data);
        return response.data;
    },

    update: async (id: string, data: UpdatePatientDto) => {
        const response = await api.patch<Patient>(`/patients/${id}`, data);
        return response.data;
    },

    remove: async (id: string) => {
        await api.delete(`/patients/${id}`);
    },
};
