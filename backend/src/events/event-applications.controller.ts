import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventApplicationsService } from './services/event-applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@ApiTags('event-applications')
@Controller('event-applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventApplicationsController {
  constructor(private readonly eventApplicationsService: EventApplicationsService) {}

  @Post(':eventId/apply')
  @ApiOperation({ summary: 'Apply for an event (student only)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  applyForEvent(
    @Param('eventId') eventId: string,
    @Request() req: any,
  ) {
    const studentId = req.user.userId;
    const application = this.eventApplicationsService.applyForEvent(eventId, studentId);
    return { status: 'success', data: application, message: 'Application submitted successfully' };
  }

  @Get('my-applications')
  @ApiOperation({ summary: 'Get current student\'s applied events' })
  getMyAppliedEvents(@Request() req: any) {
    const studentId = req.user.userId;
    const events = this.eventApplicationsService.getStudentAppliedEvents(studentId);
    return { status: 'success', data: events, message: 'Applied events retrieved successfully' };
  }

  @Get('event/:eventId/applicants')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get applicants for an event (admin only)' })
  getEventApplicants(@Param('eventId') eventId: string) {
    const applicants = this.eventApplicationsService.getEventApplicants(eventId);
    return { status: 'success', data: applicants, message: 'Applicants retrieved successfully' };
  }
}
