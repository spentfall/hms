import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role, NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log(`Validating user: ${email}`);
        const user = await this.usersService.findOne(email);
        if (!user) {
            console.log(`User not found: ${email}`);
            return null;
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(`Password match for ${email}: ${isMatch}`);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        console.log('Login attempt:', loginDto);
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const userResult = user as any;
        const profileId = userResult.doctorProfile?.id || userResult.patientProfile?.id;
        const fullName = userResult.doctorProfile?.fullName || userResult.patientProfile?.fullName || 'Administrator';
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            fullName,
            profileId,
            avatarUrl: user.avatarUrl,
            mustChangePassword: userResult.mustChangePassword
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Create new user with PATIENT role and empty profile in a transaction
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.$transaction(async (tx: any) => {
            const newUser = await tx.user.create({
                data: {
                    email: registerDto.email,
                    password: hashedPassword,
                    role: Role.PATIENT,
                    mustChangePassword: false,
                },
            });

            await tx.notification.create({
                data: {
                    userId: newUser.id,
                    message: `Welcome to HMS! We're glad to have you. Please explore the dashboard to manage your appointments.`,
                    type: NotificationType.SYSTEM_UPDATE,
                },
            });

            await tx.patientProfile.create({
                data: {
                    userId: newUser.id,
                    fullName: registerDto.fullName,
                },
            });

            return tx.user.findUnique({
                where: { id: newUser.id },
                include: {
                    doctorProfile: { select: { id: true, fullName: true } },
                    patientProfile: { select: { id: true, fullName: true } },
                },
            });
        });

        const userResult = user as any;
        const profileId = userResult.patientProfile?.id;
        const fullName = userResult.patientProfile?.fullName || 'New Patient';
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            fullName,
            profileId,
            avatarUrl: userResult.avatarUrl,
            mustChangePassword: userResult.mustChangePassword
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getUserByEmail(email: string) {
        const user = await this.usersService.findOne(email);
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }
}
