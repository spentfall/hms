import api from './api';

export interface LabResult {
    id: string;
    patientId: string;
    testName: string;
    resultUrl?: string;
    notes?: string;
    date: string;
}

export interface CreateLabResultDto {
    patientId: string;
    testName: string;
    resultUrl?: string;
    notes?: string;
}

export const labResultService = {
    create: async (data: CreateLabResultDto) => {
        const response = await api.post<LabResult>('/lab-results', data);
        return response.data;
    },

    getByPatient: async (patientId: string) => {
        const response = await api.get<LabResult[]>(`/lab-results/patient/${patientId}`);
        return response.data;
    },

    remove: async (id: string) => {
        await api.delete(`/lab-results/${id}`);
    },
};
