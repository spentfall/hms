import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientsService {
    constructor(private prisma: PrismaService) { }

    async create(createPatientDto: CreatePatientDto) {
        const { email, dateOfBirth, ...profileData } = createPatientDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('A user with this email already exists');
        }

        // Default password for new patients
        const hashedPassword = await bcrypt.hash('patient123', 10);

        // Create user and profile in a transaction
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: Role.PATIENT,
                },
            });

            const profile = await tx.patientProfile.create({
                data: {
                    ...profileData,
                    userId: user.id,
                    dateOfBirth: new Date(dateOfBirth),
                } as any,
            });

            return { user, profile };
        });
    }

    async findAll() {
        return this.prisma.patientProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                        createdAt: true,
                    } as any,
                },
            },
            orderBy: {
                user: {
                    createdAt: 'desc',
                },
            },
        });
    }

    async findOne(id: string) {
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    } as any,
                },
                appointments: {
                    include: {
                        doctor: {
                            include: {
                                user: { select: { email: true, avatarUrl: true } as any },
                                department: true,
                            },
                        },
                    },
                    orderBy: { date: 'desc' },
                    take: 5,
                },
                labResults: {
                    orderBy: { date: 'desc' },
                },
            },
        });

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }

        return patient;
    }

    async update(id: string, updatePatientDto: UpdatePatientDto) {
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id },
        });

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }

        const { email, dateOfBirth, ...profileData } = updatePatientDto;

        return this.prisma.patientProfile.update({
            where: { id },
            data: {
                ...profileData,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            } as any,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                        createdAt: true,
                    } as any,
                },
            },
        });
    }

    async remove(id: string) {
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id },
        });

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }

        // Delete user and profile
        return this.prisma.$transaction(async (tx) => {
            await tx.patientProfile.delete({ where: { id } });
            return tx.user.delete({ where: { id: patient.userId } });
        });
    }
}
