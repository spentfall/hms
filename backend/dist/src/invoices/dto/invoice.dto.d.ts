import { InvoiceStatus } from '@prisma/client';
export declare class CreateInvoiceDto {
    appointmentId: string;
    amount: number;
    status?: InvoiceStatus;
}
export declare class UpdateInvoiceStatusDto {
    status: InvoiceStatus;
}
