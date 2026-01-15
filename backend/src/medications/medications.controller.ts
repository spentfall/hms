import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationStatusDto } from './dto/medication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('medications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) { }

    @Post()
    @Roles(Role.DOCTOR, Role.ADMIN)
    create(@Body() createMedicationDto: CreateMedicationDto) {
        return this.medicationsService.create(createMedicationDto);
    }

    @Get('patient/:patientId')
    @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
    findByPatient(@Param('patientId') patientId: string) {
        return this.medicationsService.findByPatient(patientId);
    }

    @Patch(':id/status')
    @Roles(Role.DOCTOR, Role.ADMIN, Role.PATIENT)
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateMedicationStatusDto) {
        return this.medicationsService.updateStatus(id, updateStatusDto);
    }
}
