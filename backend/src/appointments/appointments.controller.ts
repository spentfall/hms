import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.PATIENT)
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        return this.appointmentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: any) {
        const appointment = await this.appointmentsService.findOne(id);

        // Restriction: Doctors can only see their own appointments
        if (req.user.role === Role.DOCTOR && appointment.doctorId !== req.user.profileId) {
            throw new ForbiddenException('You can only access your own appointments');
        }

        // Restriction: Patients can only see their own appointments
        if (req.user.role === Role.PATIENT && appointment.patientId !== req.user.profileId) {
            throw new ForbiddenException('You can only access your own appointments');
        }

        return appointment;
    }

    @Get('doctor/:id')
    @Roles(Role.ADMIN, Role.DOCTOR)
    async findDoctorAppointments(@Param('id') id: string, @Req() req: any) {
        // If user is a DOCTOR, they can only see their own appointments
        if (req.user.role === Role.DOCTOR && req.user.profileId !== id) {
            throw new ForbiddenException('You can only access your own appointments');
        }
        return this.appointmentsService.findDoctorAppointments(id);
    }

    @Get('patient/:id')
    @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
    async findPatientAppointments(@Param('id') id: string, @Req() req: any) {
        // Restriction: Patients can only see their own appointments
        if (req.user.role === Role.PATIENT && req.user.profileId !== id) {
            throw new ForbiddenException('You can only access your own records');
        }

        // If it's a doctor, we filter the results in the service or here.
        // For now, let's keep it simple: doctors can see patient appointments 
        // but we might want to filter them to only those with "this" doctor.
        // However, the user said "should not able to see other doctor's appointment."
        // So we filter the results from the service.
        const appointments = await this.appointmentsService.findPatientAppointments(id);

        if (req.user.role === Role.DOCTOR) {
            return appointments.filter(app => app.doctorId === req.user.profileId);
        }

        return appointments;
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.DOCTOR)
    update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.appointmentsService.remove(id);
    }
}
