import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get dashboard overview (admin only)' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('activity')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get recent activity (admin only)' })
  getActivity() {
    return this.adminService.getActivity();
  }

  @Get('students')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get students with pagination (admin only)' })
  getStudents(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getStudents(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('events')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get events with pagination (admin only)' })
  getEvents(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getEvents(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }
}