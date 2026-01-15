import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
        });
    }

    async findOne(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                doctorProfile: { select: { id: true, fullName: true } },
                patientProfile: { select: { id: true, fullName: true } },
            },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                doctorProfile: true,
                patientProfile: true,
            },
        });
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordMatching = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatching) {
            throw new BadRequestException('Invalid password');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                mustChangePassword: false
            },
        });
    }
}
