import { IsNotEmpty, IsUUID, IsNumber, IsEnum } from 'class-validator';
import { InvoiceStatus } from '@prisma/client';

export class CreateInvoiceDto {
    @IsUUID()
    @IsNotEmpty()
    appointmentId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsEnum(InvoiceStatus)
    status?: InvoiceStatus;
}

export class UpdateInvoiceStatusDto {
    @IsEnum(InvoiceStatus)
    @IsNotEmpty()
    status: InvoiceStatus;
}
