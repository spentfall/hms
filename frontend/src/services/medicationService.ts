import api from './api';

export type MedicationStatus = 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';

export interface Medication {
    id: string;
    patientId: string;
    name: string;
    dosage: string;
    frequency: string;
    instructions: string | null;
    startDate: string;
    endDate: string | null;
    status: MedicationStatus;
}

export const medicationService = {
    getByPatient: async (patientId: string): Promise<Medication[]> => {
        const response = await api.get<Medication[]>(`/medications/patient/${patientId}`);
        return response.data;
    },

    create: async (data: Partial<Medication>): Promise<Medication> => {
        const response = await api.post<Medication>('/medications', data);
        return response.data;
    },

    updateStatus: async (id: string, status: MedicationStatus): Promise<Medication> => {
        const response = await api.patch<Medication>(`/medications/${id}/status`, { status });
        return response.data;
    },
};
