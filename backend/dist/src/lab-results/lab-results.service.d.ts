import { PrismaService } from '../prisma/prisma.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';
export declare class LabResultsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLabResultDto: CreateLabResultDto): Promise<{
        id: string;
        date: Date;
        patientId: string;
        testName: string;
        resultUrl: string | null;
        notes: string | null;
    }>;
    findByPatient(patientId: string): Promise<{
        id: string;
        date: Date;
        patientId: string;
        testName: string;
        resultUrl: string | null;
        notes: string | null;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        date: Date;
        patientId: string;
        testName: string;
        resultUrl: string | null;
        notes: string | null;
    }>;
}
