import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { LabResultsService } from './lab-results.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('lab-results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabResultsController {
    constructor(private readonly labResultsService: LabResultsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.DOCTOR)
    create(@Body() createLabResultDto: CreateLabResultDto) {
        return this.labResultsService.create(createLabResultDto);
    }

    @Get('patient/:patientId')
    findByPatient(@Param('patientId') patientId: string) {
        return this.labResultsService.findByPatient(patientId);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.DOCTOR)
    remove(@Param('id') id: string) {
        return this.labResultsService.remove(id);
    }
}
