import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(private prisma: PrismaService) { }

    async create(createInvoiceDto: CreateInvoiceDto) {
        const { appointmentId, amount, status } = createInvoiceDto;

        // Check if appointment exists
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
        }

        // Check if invoice already exists for this appointment
        const existingInvoice = await this.prisma.invoice.findUnique({
            where: { appointmentId },
        });

        if (existingInvoice) {
            throw new ConflictException(`Invoice already exists for appointment ${appointmentId}`);
        }

        return this.prisma.invoice.create({
            data: {
                appointmentId,
                amount,
                status: status || 'UNPAID',
            },
            include: {
                appointment: {
                    include: {
                        doctor: true,
                        patient: true,
                    },
                },
                payments: true,
            },
        });
    }

    async findAll() {
        return this.prisma.invoice.findMany({
            include: {
                appointment: {
                    include: {
                        doctor: true,
                        patient: true,
                    },
                },
                payments: true,
            },
            orderBy: { issuedAt: 'desc' },
        });
    }

    async findByPatient(patientId: string) {
        return this.prisma.invoice.findMany({
            where: {
                appointment: {
                    patientId,
                },
            },
            include: {
                appointment: {
                    include: {
                        doctor: true,
                        patient: true,
                    },
                },
                payments: true,
            },
            orderBy: { issuedAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                appointment: {
                    include: {
                        doctor: true,
                        patient: true,
                    },
                },
                payments: true,
            },
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }

        return invoice;
    }

    async updateStatus(id: string, updateInvoiceStatusDto: UpdateInvoiceStatusDto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }

        return this.prisma.invoice.update({
            where: { id },
            data: {
                status: updateInvoiceStatusDto.status,
            },
            include: {
                appointment: {
                    include: {
                        doctor: true,
                        patient: true,
                    },
                },
                payments: true,
            },
        });
    }
}
