import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';

@Injectable()
export class LabResultsService {
    constructor(private prisma: PrismaService) { }

    async create(createLabResultDto: CreateLabResultDto) {
        const { patientId, ...data } = createLabResultDto;

        // Verify patient exists
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id: patientId },
        });

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${patientId} not found`);
        }

        return this.prisma.labResult.create({
            data: {
                ...data,
                patientId,
            },
        });
    }

    async findByPatient(patientId: string) {
        return this.prisma.labResult.findMany({
            where: { patientId },
            orderBy: { date: 'desc' },
        });
    }

    async remove(id: string) {
        const labResult = await this.prisma.labResult.findUnique({
            where: { id },
        });

        if (!labResult) {
            throw new NotFoundException(`Lab result with ID ${id} not found`);
        }

        return this.prisma.labResult.delete({
            where: { id },
        });
    }
}
