import api from './api';
import type { Doctor } from './doctorService';
import type { Patient } from './patientService';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
    id: string;
    date: string;
    status: AppointmentStatus;
    doctorId: string;
    patientId: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    doctor?: Doctor;
    patient?: Patient;
}

export interface CreateAppointmentDto {
    date: string;
    doctorId: string;
    patientId: string;
    description: string;
    fee?: number;
}

export interface UpdateAppointmentDto {
    date?: string;
    status?: AppointmentStatus;
    description?: string;
    fee?: number;
}

export const appointmentService = {
    getAll: async () => {
        const response = await api.get<Appointment[]>('/appointments');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Appointment>(`/appointments/${id}`);
        return response.data;
    },

    getByDoctor: async (doctorId: string) => {
        const response = await api.get<Appointment[]>(`/appointments/doctor/${doctorId}`);
        return response.data;
    },

    getByPatient: async (patientId: string) => {
        const response = await api.get<Appointment[]>(`/appointments/patient/${patientId}`);
        return response.data;
    },

    create: async (data: CreateAppointmentDto) => {
        const response = await api.post<Appointment>('/appointments', data);
        return response.data;
    },

    update: async (id: string, data: UpdateAppointmentDto) => {
        const response = await api.patch<Appointment>(`/appointments/${id}`, data);
        return response.data;
    },

    remove: async (id: string) => {
        await api.delete(`/appointments/${id}`);
    },
};
