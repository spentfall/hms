import { LabResultsService } from './lab-results.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';
export declare class LabResultsController {
    private readonly labResultsService;
    constructor(labResultsService: LabResultsService);
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
