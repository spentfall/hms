import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<{
        doctorProfile: {
            id: string;
            fullName: string;
        } | null;
        patientProfile: {
            id: string;
            fullName: string | null;
        } | null;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
