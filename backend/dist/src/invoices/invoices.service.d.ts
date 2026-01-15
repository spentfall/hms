import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
export declare class InvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<{
        appointment: {
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
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            customerEmail: string | null;
            customerName: string | null;
            txRef: string;
            chapaReference: string | null;
            currency: string;
            paymentMethod: string | null;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        issuedAt: Date;
    }>;
    findAll(): Promise<({
        appointment: {
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
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            customerEmail: string | null;
            customerName: string | null;
            txRef: string;
            chapaReference: string | null;
            currency: string;
            paymentMethod: string | null;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        issuedAt: Date;
    })[]>;
    findByPatient(patientId: string): Promise<({
        appointment: {
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
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            customerEmail: string | null;
            customerName: string | null;
            txRef: string;
            chapaReference: string | null;
            currency: string;
            paymentMethod: string | null;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        issuedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        appointment: {
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
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            customerEmail: string | null;
            customerName: string | null;
            txRef: string;
            chapaReference: string | null;
            currency: string;
            paymentMethod: string | null;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        issuedAt: Date;
    }>;
    updateStatus(id: string, updateInvoiceStatusDto: UpdateInvoiceStatusDto): Promise<{
        appointment: {
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
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            customerEmail: string | null;
            customerName: string | null;
            txRef: string;
            chapaReference: string | null;
            currency: string;
            paymentMethod: string | null;
            paidAt: Date | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        issuedAt: Date;
    }>;
}
