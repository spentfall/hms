import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto, UpdateMedicationStatusDto } from './dto/medication.dto';
import { MedicationStatus } from '@prisma/client';

@Injectable()
export class MedicationsService {
    constructor(private prisma: PrismaService) { }

    async create(createMedicationDto: CreateMedicationDto) {
        return this.prisma.medication.create({
            data: {
                patientId: createMedicationDto.patientId,
                name: createMedicationDto.name,
                dosage: createMedicationDto.dosage,
                frequency: createMedicationDto.frequency,
                instructions: createMedicationDto.instructions,
                startDate: createMedicationDto.startDate ? new Date(createMedicationDto.startDate) : new Date(),
                endDate: createMedicationDto.endDate ? new Date(createMedicationDto.endDate) : null,
                status: MedicationStatus.ACTIVE,
            },
        });
    }

    async findByPatient(patientId: string) {
        return this.prisma.medication.findMany({
            where: { patientId },
            orderBy: { startDate: 'desc' },
        });
    }

    async updateStatus(id: string, updateStatusDto: UpdateMedicationStatusDto) {
        return this.prisma.medication.update({
            where: { id },
            data: { status: updateStatusDto.status },
        });
    }
}
