import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        return this.invoicesService.findAll();
    }

    @Get('patient/:patientId')
    @Roles(Role.ADMIN, Role.PATIENT)
    findByPatient(@Param('patientId') patientId: string) {
        return this.invoicesService.findByPatient(patientId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.invoicesService.findOne(id);
    }

    @Patch(':id/status')
    @Roles(Role.ADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body() updateInvoiceStatusDto: UpdateInvoiceStatusDto,
    ) {
        return this.invoicesService.updateStatus(id, updateInvoiceStatusDto);
    }
}
