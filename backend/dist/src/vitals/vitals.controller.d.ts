import { VitalsService } from './vitals.service';
import { CreateVitalDto } from './dto/vital.dto';
export declare class VitalsController {
    private readonly vitalsService;
    constructor(vitalsService: VitalsService);
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
