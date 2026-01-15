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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatsService = class StatsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminStats() {
        const [revenueData, patientCount, appointmentCount, doctorCount, recentAppointments, recentPatients] = await Promise.all([
            this.prisma.invoice.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true },
            }),
            this.prisma.patientProfile.count(),
            this.prisma.appointment.count(),
            this.prisma.doctorProfile.count(),
            this.prisma.appointment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    doctor: { select: { fullName: true } },
                    patient: { select: { fullName: true } },
                }
            }),
            this.prisma.patientProfile.findMany({
                take: 5,
                orderBy: { id: 'desc' },
                include: {
                    user: { select: { createdAt: true } }
                }
            })
        ]);
        const activities = [
            ...recentAppointments.map(app => ({
                id: app.id,
                type: 'APPOINTMENT',
                title: 'New Appointment',
                description: `Dr. ${app.doctor.fullName} with ${app.patient.fullName}`,
                time: app.createdAt,
            })),
            ...recentPatients.map(p => ({
                id: p.id,
                type: 'REGISTRATION',
                title: 'New Patient',
                description: `${p.fullName || 'New Patient'} joined the system`,
                time: p.user.createdAt,
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
        const weeklyData = await Promise.all(Array.from({ length: 7 }).map(async (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);
            const count = await this.prisma.appointment.count({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDate
                    }
                }
            });
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count
            };
        }));
        return {
            totalRevenue: Number(revenueData._sum.amount || 0),
            activePatients: patientCount,
            totalAppointments: appointmentCount,
            totalDoctors: doctorCount,
            revenueChange: '+12.5%',
            patientsChange: '+5.2%',
            appointmentsChange: '+8.1%',
            doctorsChange: '+2.4%',
            recentActivities: activities,
            weeklyOverview: weeklyData
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map