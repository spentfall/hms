import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ChapaService } from './chapa.service';
import { InitializePaymentDto, WebhookPayloadDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        private prisma: PrismaService,
        private chapaService: ChapaService,
        private configService: ConfigService,
    ) { }

    /**
     * Initialize a payment for an invoice
     */
    async initializePayment(dto: InitializePaymentDto) {
        const { invoiceId, customerEmail, customerName, returnUrl } = dto;

        // Find the invoice
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                appointment: {
                    include: {
                        patient: true,
                        doctor: true,
                    },
                },
            },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        if (invoice.status === 'PAID') {
            throw new BadRequestException('Invoice is already paid');
        }

        // Generate unique transaction reference
        const txRef = `HMS-${Date.now()}-${invoiceId.substring(0, 8)}`;

        // Split customer name
        const nameParts = customerName.trim().split(' ');
        const firstName = nameParts[0] || 'Patient';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        // Initialize payment with Chapa
        let chapaResponse;
        try {
            const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
            chapaResponse = await this.chapaService.initializePayment({
                amount: Number(invoice.amount),
                currency: 'ETB',
                email: customerEmail,
                first_name: firstName,
                last_name: lastName,
                tx_ref: txRef,
                callback_url: `${this.configService.get<string>('BACKEND_URL') || 'http://localhost:3001'}/payments/webhook`,
                return_url: returnUrl || `${frontendUrl}/billing/payment/success`,
                customization: {
                    title: 'MediSys Hospital Payment',
                    description: `Payment for appointment with Dr. ${invoice.appointment.doctor.fullName}`,
                },
            });
        } catch (error) {
            this.logger.error(`Chapa initialization failed: ${error.message}`);
            throw new BadRequestException(error.message);
        }

        // Create payment record
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId,
                txRef,
                amount: invoice.amount,
                currency: 'ETB',
                status: PaymentStatus.PENDING,
                customerEmail,
                customerName,
            },
        });

        this.logger.log(`Payment initialized: ${txRef} for invoice ${invoiceId}`);

        return {
            paymentId: payment.id,
            checkoutUrl: chapaResponse.data.checkout_url,
            txRef,
        };
    }

    /**
     * Verify a payment
     */
    async verifyPayment(txRef: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { txRef },
            include: { invoice: true },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Verify with Chapa
        const verification = await this.chapaService.verifyPayment(txRef);

        // Update payment status
        const status = this.mapChapaStatus(verification.data.status);
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status,
                chapaReference: verification.data.reference,
                paymentMethod: verification.data.method,
                paidAt: status === PaymentStatus.SUCCESS ? new Date() : null,
            },
        });

        // Update invoice if payment successful
        if (status === PaymentStatus.SUCCESS) {
            await this.prisma.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: 'PAID' },
            });
            this.logger.log(`Invoice ${payment.invoiceId} marked as PAID`);
        }

        return updatedPayment;
    }

    /**
     * Handle webhook from Chapa
     */
    async handleWebhook(payload: WebhookPayloadDto, signature: string) {
        // Verify signature
        const isValid = this.chapaService.verifyWebhookSignature(
            JSON.stringify(payload),
            signature,
        );

        if (!isValid) {
            this.logger.warn('Invalid webhook signature');
            throw new BadRequestException('Invalid signature');
        }

        const { tx_ref, reference, status, payment_method } = payload.data;

        // Find payment
        const payment = await this.prisma.payment.findUnique({
            where: { txRef: tx_ref },
        });

        if (!payment) {
            this.logger.warn(`Payment not found for tx_ref: ${tx_ref}`);
            return { message: 'Payment not found' };
        }

        // Update payment
        const paymentStatus = this.mapChapaStatus(status);
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: paymentStatus,
                chapaReference: reference,
                paymentMethod: payment_method,
                paidAt: paymentStatus === PaymentStatus.SUCCESS ? new Date() : null,
            },
        });

        // Update invoice if successful
        if (paymentStatus === PaymentStatus.SUCCESS) {
            await this.prisma.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: 'PAID' },
            });
            this.logger.log(`Invoice ${payment.invoiceId} marked as PAID via webhook`);
        }

        return { message: 'Webhook processed successfully' };
    }

    /**
     * Get payment history for an invoice
     */
    async getPaymentHistory(invoiceId: string) {
        return this.prisma.payment.findMany({
            where: { invoiceId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Simulate a successful payment (for demo/testing)
     */
    async simulateSuccess(invoiceId: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        if (invoice.status === 'PAID') {
            throw new BadRequestException('Invoice is already paid');
        }

        const txRef = `DEMO-${Date.now()}-${invoiceId.substring(0, 8)}`;

        // Create a successful payment record
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId,
                txRef,
                amount: invoice.amount,
                currency: 'ETB',
                status: PaymentStatus.SUCCESS,
                customerEmail: 'demo@example.com',
                customerName: 'Demo User',
                paymentMethod: 'DEMO_MODE',
                paidAt: new Date(),
            },
        });

        // Update invoice status
        await this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PAID' },
        });

        this.logger.log(`Demo payment successful for invoice: ${invoiceId}`);

        return payment;
    }

    /**
     * Map Chapa status to our PaymentStatus enum
     */
    private mapChapaStatus(chapaStatus: string): PaymentStatus {
        switch (chapaStatus.toLowerCase()) {
            case 'success':
                return PaymentStatus.SUCCESS;
            case 'failed':
                return PaymentStatus.FAILED;
            case 'pending':
                return PaymentStatus.PENDING;
            default:
                return PaymentStatus.FAILED;
        }
    }
}
