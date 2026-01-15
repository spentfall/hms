import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
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
    findOne(id: string, req: any): Promise<{
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
    findDoctorAppointments(id: string, req: any): Promise<({
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
    findPatientAppointments(id: string, req: any): Promise<({
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
