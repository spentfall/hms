import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ChapaService } from './chapa.service';
import { InitializePaymentDto, WebhookPayloadDto } from './dto/payment.dto';
export declare class PaymentsService {
    private prisma;
    private chapaService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, chapaService: ChapaService, configService: ConfigService);
    initializePayment(dto: InitializePaymentDto): Promise<{
        paymentId: string;
        checkoutUrl: string;
        txRef: string;
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
    simulateSuccess(invoiceId: string): Promise<{
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
    private mapChapaStatus;
}
