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
exports.VitalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let VitalsService = class VitalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createVitalDto) {
        return this.prisma.healthVital.create({
            data: {
                patientId: createVitalDto.patientId,
                type: createVitalDto.type,
                value: createVitalDto.value,
                unit: createVitalDto.unit,
            },
        });
    }
    async findByPatient(patientId) {
        return this.prisma.healthVital.findMany({
            where: { patientId },
            orderBy: { date: 'desc' },
        });
    }
    async getLatestByPatient(patientId) {
        const types = Object.values(client_1.VitalType);
        const latestVitals = await Promise.all(types.map(async (type) => {
            return this.prisma.healthVital.findFirst({
                where: { patientId, type },
                orderBy: { date: 'desc' },
            });
        }));
        return latestVitals.filter(v => v !== null);
    }
};
exports.VitalsService = VitalsService;
exports.VitalsService = VitalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VitalsService);
//# sourceMappingURL=vitals.service.js.map