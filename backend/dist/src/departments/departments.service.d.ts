import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<{
        id: string;
        name: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            doctors: number;
        };
    } & {
        id: string;
        name: string;
    })[]>;
    remove(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
