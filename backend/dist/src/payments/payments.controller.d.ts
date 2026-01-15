import { PaymentsService } from './payments.service';
import { InitializePaymentDto, WebhookPayloadDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initializePayment(dto: InitializePaymentDto): Promise<{
        paymentId: string;
        checkoutUrl: string;
        txRef: string;
    }>;
    demoPayment(invoiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        invoiceId: string;
        customerEmail: string | null;
        customerName: string | null;
        txRef: string;
        chapaReference: string | null;
        currency: string;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    verifyPayment(txRef: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        invoiceId: string;
        customerEmail: string | null;
        customerName: string | null;
        txRef: string;
        chapaReference: string | null;
        currency: string;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    handleWebhook(payload: WebhookPayloadDto, signature: string): Promise<{
        message: string;
    }>;
    getPaymentHistory(invoiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        invoiceId: string;
        customerEmail: string | null;
        customerName: string | null;
        txRef: string;
        chapaReference: string | null;
        currency: string;
        paymentMethod: string | null;
        paidAt: Date | null;
    }[]>;
}
