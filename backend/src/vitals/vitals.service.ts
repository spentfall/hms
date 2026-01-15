import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVitalDto } from './dto/vital.dto';
import { VitalType } from '@prisma/client';

@Injectable()
export class VitalsService {
    constructor(private prisma: PrismaService) { }

    async create(createVitalDto: CreateVitalDto) {
        return this.prisma.healthVital.create({
            data: {
                patientId: createVitalDto.patientId,
                type: createVitalDto.type,
                value: createVitalDto.value,
                unit: createVitalDto.unit,
            },
        });
    }

    async findByPatient(patientId: string) {
        return this.prisma.healthVital.findMany({
            where: { patientId },
            orderBy: { date: 'desc' },
        });
    }

    async getLatestByPatient(patientId: string) {
        const types = Object.values(VitalType);
        const latestVitals = await Promise.all(
            types.map(async (type) => {
                return this.prisma.healthVital.findFirst({
                    where: { patientId, type },
                    orderBy: { date: 'desc' },
                });
            })
        );
        return latestVitals.filter(v => v !== null);
    }
}
