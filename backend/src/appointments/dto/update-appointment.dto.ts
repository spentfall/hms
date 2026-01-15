import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
    @IsDateString()
    @IsOptional()
    date?: string;

    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @IsOptional()
    description?: string;

    @IsOptional()
    fee?: number;
}
