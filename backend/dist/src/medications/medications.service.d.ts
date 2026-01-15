import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto, UpdateMedicationStatusDto } from './dto/medication.dto';
export declare class MedicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMedicationDto: CreateMedicationDto): Promise<{
        id: string;
        name: string;
        patientId: string;
        dosage: string;
        frequency: string;
        instructions: string | null;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.MedicationStatus;
    }>;
    findByPatient(patientId: string): Promise<{
        id: string;
        name: string;
        patientId: string;
        dosage: string;
        frequency: string;
        instructions: string | null;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.MedicationStatus;
    }[]>;
    updateStatus(id: string, updateStatusDto: UpdateMedicationStatusDto): Promise<{
        id: string;
        name: string;
        patientId: string;
        dosage: string;
        frequency: string;
        instructions: string | null;
        startDate: Date;
        endDate: Date | null;
        status: import(".prisma/client").$Enums.MedicationStatus;
    }>;
}
