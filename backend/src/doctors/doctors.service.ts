import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';

@Injectable()
export class DoctorsService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
    ) { }

    async create(createDoctorDto: CreateDoctorDto) {
        const { email, specialization, departmentId, fullName, gender, phoneNumber } = createDoctorDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Check if department exists
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });

        if (!department) {
            throw new NotFoundException('Department not found');
        }

        // Create user with default password (patient123 or similar, should be changed or emailed)
        // For now, let's use a default password 'doctor123'
        const user = await this.usersService.create({
            email,
            password: 'doctor123',
            role: Role.DOCTOR,
        });

        // Create doctor profile
        return this.prisma.doctorProfile.create({
            data: {
                userId: user.id,
                fullName,
                specialization,
                phoneNumber,
                gender,
                departmentId,
            } as any,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    } as any,
                },
                department: true,
            },
        });
    }

    findAll() {
        return this.prisma.doctorProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    } as any,
                },
                department: true,
            },
        });
    }

    async findOne(id: string) {
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        avatarUrl: true,
                    } as any,
                },
                department: true,
                appointments: {
                    include: {
                        patient: true,
                    },
                    orderBy: { date: 'desc' },
                    take: 10,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        return doctor;
    }

    async update(id: string, updateDoctorDto: UpdateDoctorDto) {
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        const { departmentId, ...profileData } = updateDoctorDto;

        // If department is changing, verify it exists
        if (departmentId) {
            const department = await this.prisma.department.findUnique({
                where: { id: departmentId },
            });
            if (!department) {
                throw new NotFoundException('Department not found');
            }
        }

        return this.prisma.doctorProfile.update({
            where: { id },
            data: {
                ...profileData,
                departmentId,
            } as any,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    } as any,
                },
                department: true,
            },
        });
    }

    async remove(id: string) {
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        // Delete doctor profile and user
        await this.prisma.$transaction([
            this.prisma.doctorProfile.delete({ where: { id } }),
            this.prisma.user.delete({ where: { id: doctor.userId } }),
        ]);

        return { message: 'Doctor deleted successfully' };
    }
}
