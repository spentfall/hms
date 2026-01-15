import { IsString, IsNotEmpty, IsUUID, IsOptional, IsUrl } from 'class-validator';

export class CreateLabResultDto {
    @IsUUID()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    testName: string;

    @IsUrl()
    @IsOptional()
    resultUrl?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
