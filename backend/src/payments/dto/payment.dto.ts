import { IsNotEmpty, IsNumber, IsString, IsEmail, IsOptional } from 'class-validator';

export class InitializePaymentDto {
    @IsString()
    @IsNotEmpty()
    invoiceId: string;

    @IsEmail()
    @IsNotEmpty()
    customerEmail: string;

    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @IsOptional()
    returnUrl?: string;
}

export class VerifyPaymentDto {
    @IsString()
    @IsNotEmpty()
    txRef: string;
}

export class WebhookPayloadDto {
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
