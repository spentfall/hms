import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    findAll(@Request() req: any) {
        console.log(`Fetching notifications for user: ${req.user.userId}`);
        return this.notificationsService.findAllForUser(req.user.userId);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }

    @Patch('read-all')
    markAllAsRead(@Request() req: any) {
        console.log(`Marking all notifications as read for user: ${req.user.userId}`);
        return this.notificationsService.markAllAsRead(req.user.userId);
    }
}
