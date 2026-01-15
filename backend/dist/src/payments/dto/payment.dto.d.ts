export declare class InitializePaymentDto {
    invoiceId: string;
    customerEmail: string;
    customerName: string;
    returnUrl?: string;
}
export declare class VerifyPaymentDto {
    txRef: string;
}
export declare class WebhookPayloadDto {
    event: string;
    data: {
        tx_ref: string;
        reference: string;
        status: string;
        amount: number;
        currency: string;
        email: string;
        first_name: string;
        last_name: string;
        payment_method: string;
        created_at: string;
    };
}
