import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class AppointmentsService {
    constructor(
        private prisma: PrismaService,
        private notifications: NotificationsService,
        private invoices: InvoicesService,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto) {
        const { date, doctorId, patientId, description, fee } = createAppointmentDto;

        // Verify doctor exists
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id: doctorId },
        });
        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        // Verify patient exists
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        const appointment = await this.prisma.appointment.create({
            data: {
                date: new Date(date),
                description: description || '',
                doctorId,
                patientId,
                fee: fee || 150.00,
                status: AppointmentStatus.PENDING,
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                },
                patient: {
                    include: {
                        user: true
                    }
                },
            },
        });

        // Simulate email sending
        this.sendSimulatedEmail(appointment);

        // Create database notifications
        await this.notifications.create(
            appointment.doctor.userId,
            `New appointment request from ${appointment.patient.fullName || appointment.patient.user.email} for ${new Date(appointment.date).toLocaleString()}.`,
            NotificationType.APPOINTMENT_NEW
        );

        await this.notifications.create(
            appointment.patient.userId,
            `Your appointment with Dr. ${appointment.doctor.fullName} on ${new Date(appointment.date).toLocaleString()} has been booked.`,
            NotificationType.APPOINTMENT_NEW
        );

        return appointment;
    }

    private sendSimulatedEmail(appointment: any) {
        console.log('--------------------------------------------------');
        console.log('📧 SIMULATED EMAIL NOTIFICATION');
        console.log(`To: ${appointment.doctor.user.email}`);
        console.log(`Subject: New Appointment Request - ${appointment.patient.fullName || appointment.patient.user.email}`);
        console.log(`Body: `);
        console.log(`Hello Dr. ${appointment.doctor.fullName},`);
        console.log(`You have a new appointment request for ${new Date(appointment.date).toLocaleString()}.`);
        console.log(`Reason for visit: ${appointment.description}`);
        console.log('--------------------------------------------------');
    }

    findAll() {
        return this.prisma.appointment.findMany({
            include: {
                doctor: true,
                patient: true,
            },
            orderBy: { date: 'desc' },
        });
    }

    async findOne(id: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                doctor: true,
                patient: true,
                invoice: true,
            },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        return appointment;
    }

    findDoctorAppointments(doctorId: string) {
        return this.prisma.appointment.findMany({
            where: { doctorId },
            include: {
                patient: true,
            },
            orderBy: { date: 'desc' },
        });
    }

    findPatientAppointments(patientId: string) {
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: {
                doctor: true,
            },
            orderBy: { date: 'desc' },
        });
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        const data: any = {};
        if (updateAppointmentDto.date) {
            data.date = new Date(updateAppointmentDto.date);
        }
        if (updateAppointmentDto.status) {
            data.status = updateAppointmentDto.status;
        }
        if (updateAppointmentDto.description) {
            data.description = updateAppointmentDto.description;
        }
        if (updateAppointmentDto.fee !== undefined) {
            data.fee = updateAppointmentDto.fee;
        }

        const updatedAppointment = await this.prisma.appointment.update({
            where: { id },
            data,
            include: {
                doctor: true,
                patient: true,
            },
        });

        // Notify patient of status change
        if (updateAppointmentDto.status) {
            const notificationType =
                updatedAppointment.status === 'CONFIRMED' ? NotificationType.APPOINTMENT_CONFIRMED :
                    updatedAppointment.status === 'CANCELLED' ? NotificationType.APPOINTMENT_CANCELLED :
                        updatedAppointment.status === 'COMPLETED' ? NotificationType.APPOINTMENT_COMPLETED :
                            NotificationType.SYSTEM_UPDATE;

            const message = (updatedAppointment.status === 'COMPLETED' || updatedAppointment.status === 'CONFIRMED')
                ? `Your appointment with Dr. ${updatedAppointment.doctor.fullName} is now ${updatedAppointment.status}. An invoice has been generated in your billing section.`
                : `Your appointment with Dr. ${updatedAppointment.doctor.fullName} is now ${updatedAppointment.status}.`;

            await this.notifications.create(
                updatedAppointment.patient.userId,
                message,
                notificationType
            );

            // Create Invoice automatically if confirmed or completed
            if (updatedAppointment.status === 'CONFIRMED' || updatedAppointment.status === 'COMPLETED') {
                try {
                    await this.invoices.create({
                        appointmentId: updatedAppointment.id,
                        amount: Number(updatedAppointment.fee),
                        status: 'UNPAID',
                    });
                } catch (error) {
                    // Invoice might already exist, just log and continue
                    console.log(`Invoice for appointment ${updatedAppointment.id} already exists or failed to create.`);
                }
            }

            // Notify Admin if completed
            if (updatedAppointment.status === 'COMPLETED') {
                const admins = await this.prisma.user.findMany({
                    where: { role: 'ADMIN' },
                });

                for (const admin of admins) {
                    await this.notifications.create(
                        admin.id,
                        `Appointment between Dr. ${updatedAppointment.doctor.fullName} and ${updatedAppointment.patient.fullName} has been completed.`,
                        NotificationType.APPOINTMENT_COMPLETED
                    );
                }
            }
        }

        return updatedAppointment;
    }

    async remove(id: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        return this.prisma.appointment.delete({
            where: { id },
        });
    }
}
