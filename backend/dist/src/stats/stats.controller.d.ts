import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
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
