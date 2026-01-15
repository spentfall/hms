import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, avatarUrl: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
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
