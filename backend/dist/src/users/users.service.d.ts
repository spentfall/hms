import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(email: string): Promise<({
        doctorProfile: {
            id: string;
            fullName: string;
        } | null;
        patientProfile: {
            id: string;
            fullName: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findById(id: string): Promise<({
        doctorProfile: {
            id: string;
            userId: string;
            fullName: string;
            specialization: string;
            phoneNumber: string;
            gender: import(".prisma/client").$Enums.Gender;
            departmentId: string;
        } | null;
        patientProfile: {
            id: string;
            userId: string;
            fullName: string | null;
            phoneNumber: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            dateOfBirth: Date | null;
            address: string | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
            medicalHistory: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
