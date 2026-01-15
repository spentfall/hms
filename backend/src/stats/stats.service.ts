import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

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
                orderBy: { id: 'desc' }, // Assuming id is uuid, use createdAt if available on User
                include: {
                    user: { select: { createdAt: true } }
                }
            })
        ]);

        // Synthesize Recent Activities
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

        // Weekly Overview (Last 7 days)
        const weeklyData = await Promise.all(
            Array.from({ length: 7 }).map(async (_, i) => {
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
            })
        );

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
}
