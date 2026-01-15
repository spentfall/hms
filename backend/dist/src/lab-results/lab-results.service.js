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
exports.LabResultsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LabResultsService = class LabResultsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLabResultDto) {
        const { patientId, ...data } = createLabResultDto;
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
        }
        return this.prisma.labResult.create({
            data: {
                ...data,
                patientId,
            },
        });
    }
    async findByPatient(patientId) {
        return this.prisma.labResult.findMany({
            where: { patientId },
            orderBy: { date: 'desc' },
        });
    }
    async remove(id) {
        const labResult = await this.prisma.labResult.findUnique({
            where: { id },
        });
        if (!labResult) {
            throw new common_1.NotFoundException(`Lab result with ID ${id} not found`);
        }
        return this.prisma.labResult.delete({
            where: { id },
        });
    }
};
exports.LabResultsService = LabResultsService;
exports.LabResultsService = LabResultsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabResultsService);
//# sourceMappingURL=lab-results.service.js.map