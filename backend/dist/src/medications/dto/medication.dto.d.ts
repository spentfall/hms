import { MedicationStatus } from '@prisma/client';
export declare class CreateMedicationDto {
    patientId: string;
    name: string;
    dosage: string;
    frequency: string;
    instructions?: string;
    startDate?: string;
    endDate?: string;
}
export declare class UpdateMedicationStatusDto {
    status: MedicationStatus;
}
