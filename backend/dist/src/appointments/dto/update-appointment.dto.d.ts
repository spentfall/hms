import { AppointmentStatus } from '@prisma/client';
export declare class UpdateAppointmentDto {
    date?: string;
    status?: AppointmentStatus;
    description?: string;
    fee?: number;
}
