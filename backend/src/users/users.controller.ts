import { Controller, Patch, Body, UseGuards, Request, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch('profile')
    updateProfile(@Request() req: any, @Body('avatarUrl') avatarUrl: string) {
        return this.usersService.updateAvatar(req.user.userId, avatarUrl);
    }

    @Patch('change-password')
    changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        return this.usersService.changePassword(req.user.userId, changePasswordDto);
    }
}
