import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

@Injectable()
export class ChapaService {
    private readonly logger = new Logger(ChapaService.name);
    private readonly baseUrl = 'https://api.chapa.co/v1';
    private readonly secretKey: string;

    constructor(private configService: ConfigService) {
        const rawKey = this.configService.get<string>('CHAPA_SECRET_KEY') ?? '';
        // Strip potential surrounding quotes that might be literalized from .env
        this.secretKey = rawKey.replace(/^["'](.+)["']$/, '$1').trim();

        if (!this.secretKey) {
            this.logger.warn('CHAPA_SECRET_KEY not configured. Payment processing will fail.');
        } else {
            this.logger.log(`Chapa initialized with key: ${this.secretKey.substring(0, 12)}... (length: ${this.secretKey.length})`);
        }
    }

    /**
     * Initialize a payment with Chapa
     */
    async initializePayment(data: ChapaInitializePaymentDto): Promise<ChapaPaymentResponse> {
        try {
            this.logger.log(`Initializing payment for tx_ref: ${data.tx_ref}`);

            const response = await axios.post<ChapaPaymentResponse>(
                `${this.baseUrl}/transaction/initialize`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            this.logger.log(`Payment initialized successfully: ${data.tx_ref}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to initialize payment: ${error.message}`, error.stack);

            if (axios.isAxiosError(error) && error.response) {
                const apiMessage = error.response.data?.message || 'Gateway error';
                throw new Error(`Payment gateway error: ${apiMessage}`);
            }

            throw new Error(`Chapa payment initialization failed: ${error.message}`);
        }
    }

    /**
     * Verify a payment with Chapa
     */
    async verifyPayment(txRef: string): Promise<ChapaVerifyResponse> {
        try {
            this.logger.log(`Verifying payment for tx_ref: ${txRef}`);

            const response = await axios.get<ChapaVerifyResponse>(
                `${this.baseUrl}/transaction/verify/${txRef}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.secretKey}`,
                    },
                },
            );

            this.logger.log(`Payment verification result: ${response.data.data.status}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to verify payment: ${error.message}`, error.stack);
            throw new Error(`Chapa payment verification failed: ${error.message}`);
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string, signature: string): boolean {
        const webhookSecret = this.configService.get<string>('CHAPA_WEBHOOK_SECRET');
        if (!webhookSecret) {
            this.logger.warn('CHAPA_WEBHOOK_SECRET not configured. Skipping signature verification.');
            return true; // Allow in development
        }

        // Chapa uses HMAC SHA256 for webhook signatures
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

        return signature === expectedSignature;
    }
}
