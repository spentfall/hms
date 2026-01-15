"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, pass) {
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
    async login(loginDto) {
        console.log('Login attempt:', loginDto);
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const userResult = user;
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
    async register(registerDto) {
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: registerDto.email,
                    password: hashedPassword,
                    role: client_1.Role.PATIENT,
                    mustChangePassword: false,
                },
            });
            await tx.notification.create({
                data: {
                    userId: newUser.id,
                    message: `Welcome to HMS! We're glad to have you. Please explore the dashboard to manage your appointments.`,
                    type: client_1.NotificationType.SYSTEM_UPDATE,
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
        const userResult = user;
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
    async getUserByEmail(email) {
        const user = await this.usersService.findOne(email);
        if (!user)
            return null;
        const { password, ...result } = user;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map