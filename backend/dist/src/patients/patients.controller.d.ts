import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(createPatientDto: CreatePatientDto): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            avatarUrl: string | null;
            mustChangePassword: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: {
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
    }>;
    findAll(): Promise<({
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
    } & {
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
        appointments: ({
            doctor: {
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
        labResults: {
            id: string;
            date: Date;
            patientId: string;
            testName: string;
            resultUrl: string | null;
            notes: string | null;
        }[];
    } & {
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
    }>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<{
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
    } & {
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
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
