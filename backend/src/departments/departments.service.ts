import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createDepartmentDto: CreateDepartmentDto) {
        const existing = await this.prisma.department.findUnique({
            where: { name: createDepartmentDto.name },
        });

        if (existing) {
            throw new ConflictException('Department already exists');
        }

        return this.prisma.department.create({
            data: createDepartmentDto,
        });
    }

    findAll() {
        return this.prisma.department.findMany({
            include: {
                _count: {
                    select: { doctors: true }
                }
            }
        });
    }

    async remove(id: string) {
        return this.prisma.department.delete({
            where: { id },
        });
    }
}
