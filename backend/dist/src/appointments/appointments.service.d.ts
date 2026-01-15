import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { InvoicesService } from '../invoices/invoices.service';
export declare class AppointmentsService {
    private prisma;
    private notifications;
    private invoices;
    constructor(prisma: PrismaService, notifications: NotificationsService, invoices: InvoicesService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
        patient: {
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
        };
        doctor: {
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
    }>;
    private sendSimulatedEmail;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        doctor: {
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
    })[]>;
    findOne(id: string): Promise<{
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
        doctor: {
            id: string;
            userId: string;
            fullName: string;
            specialization: string;
            phoneNumber: string;
            gender: import(".prisma/client").$Enums.Gender;
            departmentId: string;
        };
        invoice: {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            appointmentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            issuedAt: Date;
        } | null;
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
    }>;
    findDoctorAppointments(doctorId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    findPatientAppointments(patientId: string): import(".prisma/client").Prisma.PrismaPromise<({
        doctor: {
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
    })[]>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<{
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
        doctor: {
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
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        patientId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        description: string;
        fee: import("@prisma/client/runtime/library").Decimal;
        doctorId: string;
    }>;
}
