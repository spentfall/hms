import api from './api';

export type VitalType = 'BLOOD_PRESSURE' | 'HEART_RATE' | 'BLOOD_GLUCOSE' | 'TEMPERATURE' | 'WEIGHT';

export interface HealthVital {
    id: string;
    patientId: string;
    type: VitalType;
    value: string;
    unit: string;
    date: string;
}

export const vitalService = {
    getByPatient: async (patientId: string): Promise<HealthVital[]> => {
        const response = await api.get<HealthVital[]>(`/vitals/patient/${patientId}`);
        return response.data;
    },

    getLatestByPatient: async (patientId: string): Promise<HealthVital[]> => {
        const response = await api.get<HealthVital[]>(`/vitals/patient/${patientId}/latest`);
        return response.data;
    },

    create: async (data: Omit<HealthVital, 'id' | 'date'>): Promise<HealthVital> => {
        const response = await api.post<HealthVital>('/vitals', data);
        return response.data;
    },
};
