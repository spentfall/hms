import { VitalType } from '@prisma/client';
export declare class CreateVitalDto {
    patientId: string;
    type: VitalType;
    value: string;
    unit: string;
}
