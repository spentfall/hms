"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const chapa_service_1 = require("./chapa.service");
const client_1 = require("@prisma/client");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    chapaService;
    configService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma, chapaService, configService) {
        this.prisma = prisma;
        this.chapaService = chapaService;
        this.configService = configService;
    }
    async initializePayment(dto) {
        const { invoiceId, customerEmail, customerName, returnUrl } = dto;
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
            throw new common_1.NotFoundException('Invoice not found');
        }
        if (invoice.status === 'PAID') {
            throw new common_1.BadRequestException('Invoice is already paid');
        }
        const txRef = `HMS-${Date.now()}-${invoiceId.substring(0, 8)}`;
        const nameParts = customerName.trim().split(' ');
        const firstName = nameParts[0] || 'Patient';
        const lastName = nameParts.slice(1).join(' ') || 'User';
        let chapaResponse;
        try {
            const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
            chapaResponse = await this.chapaService.initializePayment({
                amount: Number(invoice.amount),
                currency: 'ETB',
                email: customerEmail,
                first_name: firstName,
                last_name: lastName,
                tx_ref: txRef,
                callback_url: `${this.configService.get('BACKEND_URL') || 'http://localhost:3001'}/payments/webhook`,
                return_url: returnUrl || `${frontendUrl}/billing/payment/success`,
                customization: {
                    title: 'MediSys Hospital Payment',
                    description: `Payment for appointment with Dr. ${invoice.appointment.doctor.fullName}`,
                },
            });
        }
        catch (error) {
            this.logger.error(`Chapa initialization failed: ${error.message}`);
            throw new common_1.BadRequestException(error.message);
        }
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId,
                txRef,
                amount: invoice.amount,
                currency: 'ETB',
                status: client_1.PaymentStatus.PENDING,
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
    async verifyPayment(txRef) {
        const payment = await this.prisma.payment.findUnique({
            where: { txRef },
            include: { invoice: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const verification = await this.chapaService.verifyPayment(txRef);
        const status = this.mapChapaStatus(verification.data.status);
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status,
                chapaReference: verification.data.reference,
                paymentMethod: verification.data.method,
                paidAt: status === client_1.PaymentStatus.SUCCESS ? new Date() : null,
            },
        });
        if (status === client_1.PaymentStatus.SUCCESS) {
            await this.prisma.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: 'PAID' },
            });
            this.logger.log(`Invoice ${payment.invoiceId} marked as PAID`);
        }
        return updatedPayment;
    }
    async handleWebhook(payload, signature) {
        const isValid = this.chapaService.verifyWebhookSignature(JSON.stringify(payload), signature);
        if (!isValid) {
            this.logger.warn('Invalid webhook signature');
            throw new common_1.BadRequestException('Invalid signature');
        }
        const { tx_ref, reference, status, payment_method } = payload.data;
        const payment = await this.prisma.payment.findUnique({
            where: { txRef: tx_ref },
        });
        if (!payment) {
            this.logger.warn(`Payment not found for tx_ref: ${tx_ref}`);
            return { message: 'Payment not found' };
        }
        const paymentStatus = this.mapChapaStatus(status);
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: paymentStatus,
                chapaReference: reference,
                paymentMethod: payment_method,
                paidAt: paymentStatus === client_1.PaymentStatus.SUCCESS ? new Date() : null,
            },
        });
        if (paymentStatus === client_1.PaymentStatus.SUCCESS) {
            await this.prisma.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: 'PAID' },
            });
            this.logger.log(`Invoice ${payment.invoiceId} marked as PAID via webhook`);
        }
        return { message: 'Webhook processed successfully' };
    }
    async getPaymentHistory(invoiceId) {
        return this.prisma.payment.findMany({
            where: { invoiceId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async simulateSuccess(invoiceId) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        if (invoice.status === 'PAID') {
            throw new common_1.BadRequestException('Invoice is already paid');
        }
        const txRef = `DEMO-${Date.now()}-${invoiceId.substring(0, 8)}`;
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId,
                txRef,
                amount: invoice.amount,
                currency: 'ETB',
                status: client_1.PaymentStatus.SUCCESS,
                customerEmail: 'demo@example.com',
                customerName: 'Demo User',
                paymentMethod: 'DEMO_MODE',
                paidAt: new Date(),
            },
        });
        await this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PAID' },
        });
        this.logger.log(`Demo payment successful for invoice: ${invoiceId}`);
        return payment;
    }
    mapChapaStatus(chapaStatus) {
        switch (chapaStatus.toLowerCase()) {
            case 'success':
                return client_1.PaymentStatus.SUCCESS;
            case 'failed':
                return client_1.PaymentStatus.FAILED;
            case 'pending':
                return client_1.PaymentStatus.PENDING;
            default:
                return client_1.PaymentStatus.FAILED;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chapa_service_1.ChapaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map