import { IsString, IsEnum, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { MedicationStatus } from '@prisma/client';

export class CreateMedicationDto {
    @IsNotEmpty()
    @IsString()
    patientId: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    dosage: string;

    @IsNotEmpty()
    @IsString()
    frequency: string;

    @IsOptional()
    @IsString()
    instructions?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}

export class UpdateMedicationStatusDto {
    @IsEnum(MedicationStatus)
    status: MedicationStatus;
}
