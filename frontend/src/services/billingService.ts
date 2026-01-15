import api from './api';

export interface Invoice {
    id: string;
    appointmentId: string;
    amount: string;
    status: 'PAID' | 'UNPAID';
    issuedAt: string;
    appointment: {
        date: string;
        doctor: {
            fullName: string;
            specialization: string;
        };
        patient: {
            fullName: string;
            phoneNumber: string;
        };
    };
    payments?: {
        id: string;
        txRef: string;
        amount: string;
        status: string;
        paidAt: string;
    }[];
}

export const billingService = {
    getAll: async () => {
        const response = await api.get<Invoice[]>('/invoices');
        return response.data;
    },

    getByPatient: async (patientId: string) => {
        const response = await api.get<Invoice[]>(`/invoices/patient/${patientId}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Invoice>(`/invoices/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: 'PAID' | 'UNPAID') => {
        const response = await api.patch<Invoice>(`/invoices/${id}/status`, { status });
        return response.data;
    },
};
