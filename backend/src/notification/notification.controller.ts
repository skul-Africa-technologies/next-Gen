import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

class SendEmailDto {
  subject: string;
  content: string;
}

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('students')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Send email to all students (admin only)' })
  sendBulkEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.notificationService.sendBulkEmail(
      sendEmailDto.subject,
      sendEmailDto.content,
    );
  }
}