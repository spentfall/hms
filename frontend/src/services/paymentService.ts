import api from './api';

export interface Payment {
    id: string;
    invoiceId: string;
    chapaReference: string;
    txRef: string;
    amount: string;
    currency: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    customerEmail: string;
    customerName: string;
    paymentMethod?: string;
    paidAt?: string;
    createdAt: string;
}

export interface InitializePaymentResponse {
    paymentId: string;
    checkoutUrl: string;
    txRef: string;
}

export interface InitializePaymentDto {
    invoiceId: string;
    customerEmail: string;
    customerName: string;
    returnUrl?: string;
}

export const paymentService = {
    /**
     * Initialize a payment for an invoice
     */
    initializePayment: async (dto: InitializePaymentDto): Promise<InitializePaymentResponse> => {
        const response = await api.post<InitializePaymentResponse>('/payments/initialize', dto);
        return response.data;
    },

    /**
     * Verify a payment by transaction reference
     */
    verifyPayment: async (txRef: string): Promise<Payment> => {
        const response = await api.get<Payment>(`/payments/verify/${txRef}`);
        return response.data;
    },

    /**
     * Get payment history for an invoice
     */
    getPaymentHistory: async (invoiceId: string): Promise<Payment[]> => {
        const response = await api.get<Payment[]>(`/payments/invoice/${invoiceId}/history`);
        return response.data;
    },

    /**
     * Simulate a successful payment (for demo/testing)
     */
    simulatePayment: async (invoiceId: string): Promise<Payment> => {
        const response = await api.post<Payment>('/payments/demo-pay', { invoiceId });
        return response.data;
    },
};
