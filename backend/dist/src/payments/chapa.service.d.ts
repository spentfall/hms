import { ConfigService } from '@nestjs/config';
export interface ChapaInitializePaymentDto {
    amount: number;
    currency: string;
    email: string;
    first_name: string;
    last_name: string;
    tx_ref: string;
    callback_url: string;
    return_url: string;
    customization?: {
        title?: string;
        description?: string;
    };
}
export interface ChapaPaymentResponse {
    message: string;
    status: string;
    data: {
        checkout_url: string;
    };
}
export interface ChapaVerifyResponse {
    message: string;
    status: string;
    data: {
        first_name: string;
        last_name: string;
        email: string;
        currency: string;
        amount: number;
        charge: number;
        mode: string;
        method: string;
        type: string;
        status: string;
        reference: string;
        tx_ref: string;
        customization: any;
        meta: any;
        created_at: string;
        updated_at: string;
    };
}
export declare class ChapaService {
    private configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly secretKey;
    constructor(configService: ConfigService);
    initializePayment(data: ChapaInitializePaymentDto): Promise<ChapaPaymentResponse>;
    verifyPayment(txRef: string): Promise<ChapaVerifyResponse>;
    verifyWebhookSignature(payload: string, signature: string): boolean;
}
