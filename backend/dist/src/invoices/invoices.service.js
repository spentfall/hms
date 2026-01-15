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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesService = class InvoicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createInvoiceDto) {
        const { appointmentId, amount, status } = createInvoiceDto;
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${appointmentId} not found`);
        }
        const existingInvoice = await this.prisma.invoice.findUnique({
            where: { appointmentId },
        });
        if (existingInvoice) {
            throw new common_1.ConflictException(`Invoice already exists for appointment ${appointmentId}`);
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
    async findByPatient(patientId) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async updateStatus(id, updateInvoiceStatusDto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
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
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map