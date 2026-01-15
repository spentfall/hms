import { Controller, Get, Post, Body, Param, UseGuards, Req, Headers, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, VerifyPaymentDto, WebhookPayloadDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('initialize')
    @Roles(Role.PATIENT, Role.ADMIN, Role.DOCTOR)
    async initializePayment(@Body() dto: InitializePaymentDto) {
        return this.paymentsService.initializePayment(dto);
    }

    @Post('demo-pay')
    @Roles(Role.PATIENT, Role.ADMIN)
    async demoPayment(@Body('invoiceId') invoiceId: string) {
        return this.paymentsService.simulateSuccess(invoiceId);
    }

    @Get('verify/:txRef')
    async verifyPayment(@Param('txRef') txRef: string) {
        return this.paymentsService.verifyPayment(txRef);
    }

    @Public()
    @Post('webhook')
    @HttpCode(200)
    async handleWebhook(
        @Body() payload: WebhookPayloadDto,
        @Headers('chapa-signature') signature: string,
    ) {
        return this.paymentsService.handleWebhook(payload, signature);
    }

    @Get('invoice/:invoiceId/history')
    @Roles(Role.ADMIN, Role.PATIENT, Role.DOCTOR)
    async getPaymentHistory(@Param('invoiceId') invoiceId: string) {
        return this.paymentsService.getPaymentHistory(invoiceId);
    }
}
