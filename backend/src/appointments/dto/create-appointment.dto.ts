import { IsNotEmpty, IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsUUID()
    @IsNotEmpty()
    doctorId: string;

    @IsUUID()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    fee?: number;
}
