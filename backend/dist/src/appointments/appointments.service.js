"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const invoices_service_1 = require("../invoices/invoices.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    notifications;
    invoices;
    constructor(prisma, notifications, invoices) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.invoices = invoices;
    }
    async create(createAppointmentDto) {
        const { date, doctorId, patientId, description, fee } = createAppointmentDto;
        const doctor = await this.prisma.doctorProfile.findUnique({
            where: { id: doctorId },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const appointment = await this.prisma.appointment.create({
            data: {
                date: new Date(date),
                description: description || '',
                doctorId,
                patientId,
                fee: fee || 150.00,
                status: client_1.AppointmentStatus.PENDING,
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
        this.sendSimulatedEmail(appointment);
        await this.notifications.create(appointment.doctor.userId, `New appointment request from ${appointment.patient.fullName || appointment.patient.user.email} for ${new Date(appointment.date).toLocaleString()}.`, client_1.NotificationType.APPOINTMENT_NEW);
        await this.notifications.create(appointment.patient.userId, `Your appointment with Dr. ${appointment.doctor.fullName} on ${new Date(appointment.date).toLocaleString()} has been booked.`, client_1.NotificationType.APPOINTMENT_NEW);
        return appointment;
    }
    sendSimulatedEmail(appointment) {
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
    async findOne(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                doctor: true,
                patient: true,
                invoice: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    findDoctorAppointments(doctorId) {
        return this.prisma.appointment.findMany({
            where: { doctorId },
            include: {
                patient: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    findPatientAppointments(patientId) {
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: {
                doctor: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const data = {};
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
        if (updateAppointmentDto.status) {
            const notificationType = updatedAppointment.status === 'CONFIRMED' ? client_1.NotificationType.APPOINTMENT_CONFIRMED :
                updatedAppointment.status === 'CANCELLED' ? client_1.NotificationType.APPOINTMENT_CANCELLED :
                    updatedAppointment.status === 'COMPLETED' ? client_1.NotificationType.APPOINTMENT_COMPLETED :
                        client_1.NotificationType.SYSTEM_UPDATE;
            const message = (updatedAppointment.status === 'COMPLETED' || updatedAppointment.status === 'CONFIRMED')
                ? `Your appointment with Dr. ${updatedAppointment.doctor.fullName} is now ${updatedAppointment.status}. An invoice has been generated in your billing section.`
                : `Your appointment with Dr. ${updatedAppointment.doctor.fullName} is now ${updatedAppointment.status}.`;
            await this.notifications.create(updatedAppointment.patient.userId, message, notificationType);
            if (updatedAppointment.status === 'CONFIRMED' || updatedAppointment.status === 'COMPLETED') {
                try {
                    await this.invoices.create({
                        appointmentId: updatedAppointment.id,
                        amount: Number(updatedAppointment.fee),
                        status: 'UNPAID',
                    });
                }
                catch (error) {
                    console.log(`Invoice for appointment ${updatedAppointment.id} already exists or failed to create.`);
                }
            }
            if (updatedAppointment.status === 'COMPLETED') {
                const admins = await this.prisma.user.findMany({
                    where: { role: 'ADMIN' },
                });
                for (const admin of admins) {
                    await this.notifications.create(admin.id, `Appointment between Dr. ${updatedAppointment.doctor.fullName} and ${updatedAppointment.patient.fullName} has been completed.`, client_1.NotificationType.APPOINTMENT_COMPLETED);
                }
            }
        }
        return updatedAppointment;
    }
    async remove(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return this.prisma.appointment.delete({
            where: { id },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        invoices_service_1.InvoicesService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map