import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminStats(): Promise<{
        totalRevenue: number;
        activePatients: number;
        totalAppointments: number;
        totalDoctors: number;
        revenueChange: string;
        patientsChange: string;
        appointmentsChange: string;
        doctorsChange: string;
        recentActivities: {
            id: string;
            type: string;
            title: string;
            description: string;
            time: Date;
        }[];
        weeklyOverview: {
            day: string;
            count: number;
        }[];
    }>;
}
