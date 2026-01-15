import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { VitalType } from '@prisma/client';

export class CreateVitalDto {
    @IsNotEmpty()
    @IsString()
    patientId: string;

    @IsEnum(VitalType)
    type: VitalType;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsString()
    unit: string;
}
