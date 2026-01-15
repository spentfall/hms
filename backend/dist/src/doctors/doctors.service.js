"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const client_1 = require("@prisma/client");
let DoctorsService = class DoctorsService {
    prisma;
    usersService;
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async create(createDoctorDto) {
        const { email, specialization, departmentId, fullName, gender, phoneNumber } = createDoctorDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });
        if (!department) {
            throw new common_1.NotFoundException('Department not found');
        }
        const user = await this.usersService.create({
            email,
            password: 'doctor123',
            role: client_1.Role.DOCTOR,
        });
        return this.prisma.doctorProfile.create({
            data: {
                userId: user.id,
                fullName,
                specialization,
                phoneNumber,
                gender,
                departmentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    },
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
                    },
                },
                department: true,
            },
        });
    }
    async findOne(id) {
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
                    },
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
            throw new common_1.NotFoundException('Doctor not found');
        }
        return doctor;
    }
    async update(id, updateDoctorDto) {
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const { departmentId, ...profileData } = updateDoctorDto;
        if (departmentId) {
            const department = await this.prisma.department.findUnique({
                where: { id: departmentId },
            });
            if (!department) {
                throw new common_1.NotFoundException('Department not found');
            }
        }
        return this.prisma.doctorProfile.update({
            where: { id },
            data: {
                ...profileData,
                departmentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    },
                },
                department: true,
            },
        });
    }
    async remove(id) {
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        await this.prisma.$transaction([
            this.prisma.doctorProfile.delete({ where: { id } }),
            this.prisma.user.delete({ where: { id: doctor.userId } }),
        ]);
        return { message: 'Doctor deleted successfully' };
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map