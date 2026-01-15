import { PrismaService } from '../prisma/prisma.service';
import { CreateVitalDto } from './dto/vital.dto';
export declare class VitalsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createVitalDto: CreateVitalDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.VitalType;
        value: string;
        unit: string;
        date: Date;
        patientId: string;
    }>;
    findByPatient(patientId: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.VitalType;
        value: string;
        unit: string;
        date: Date;
        patientId: string;
    }[]>;
    getLatestByPatient(patientId: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.VitalType;
        value: string;
        unit: string;
        date: Date;
        patientId: string;
    }[]>;
}
