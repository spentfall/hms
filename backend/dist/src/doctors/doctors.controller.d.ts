import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    create(createDoctorDto: CreateDoctorDto): Promise<{
        user: {
            [x: string]: {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            }[] | ({
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            } | {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            })[];
            [x: number]: never;
            [x: symbol]: never;
        };
        department: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        fullName: string;
        specialization: string;
        phoneNumber: string;
        gender: import(".prisma/client").$Enums.Gender;
        departmentId: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            [x: string]: {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            }[] | ({
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            } | {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            })[];
            [x: number]: never;
            [x: symbol]: never;
        };
        department: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        fullName: string;
        specialization: string;
        phoneNumber: string;
        gender: import(".prisma/client").$Enums.Gender;
        departmentId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            [x: string]: {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            }[] | ({
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            } | {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            })[];
            [x: number]: never;
            [x: symbol]: never;
        };
        department: {
            id: string;
            name: string;
        };
        appointments: ({
            patient: {
                id: string;
                userId: string;
                fullName: string | null;
                phoneNumber: string | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                dateOfBirth: Date | null;
                address: string | null;
                bloodGroup: string | null;
                emergencyContact: string | null;
                medicalHistory: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            patientId: string;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            description: string;
            fee: import("@prisma/client/runtime/library").Decimal;
            doctorId: string;
        })[];
    } & {
        id: string;
        userId: string;
        fullName: string;
        specialization: string;
        phoneNumber: string;
        gender: import(".prisma/client").$Enums.Gender;
        departmentId: string;
    }>;
    update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<{
        user: {
            [x: string]: {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            }[] | ({
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            } | {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            })[];
            [x: number]: never;
            [x: symbol]: never;
        };
        department: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        fullName: string;
        specialization: string;
        phoneNumber: string;
        gender: import(".prisma/client").$Enums.Gender;
        departmentId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
