import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { CreateVitalDto } from './dto/vital.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('vitals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VitalsController {
    constructor(private readonly vitalsService: VitalsService) { }

    @Post()
    @Roles(Role.DOCTOR, Role.ADMIN)
    create(@Body() createVitalDto: CreateVitalDto) {
        return this.vitalsService.create(createVitalDto);
    }

    @Get('patient/:patientId')
    @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
    findByPatient(@Param('patientId') patientId: string) {
        return this.vitalsService.findByPatient(patientId);
    }

    @Get('patient/:patientId/latest')
    @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
    getLatestByPatient(@Param('patientId') patientId: string) {
        return this.vitalsService.getLatestByPatient(patientId);
    }
}
