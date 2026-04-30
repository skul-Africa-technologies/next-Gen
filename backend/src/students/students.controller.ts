import {
  Controller,
  Get,
  Param,
  Body,
  Patch,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../users/dto/user.dto';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get(':id/dashboard')
  @ApiOperation({ summary: 'Get student dashboard statistics' })
  async getDashboardStats(@Param('id') id: string, @Request() req: any) {
    const studentId = req.user.userId;
    if (studentId !== id) {
      throw new NotFoundException('Not authorized');
    }
    const stats = await this.studentsService.getDashboardStats(id);
    return { status: 'success', data: stats, message: 'Dashboard stats retrieved successfully' };
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get student profile' })
  getProfile(@Param('id') id: string, @Request() req: any) {
    const studentId = req.user.userId;
    if (studentId !== id) {
      throw new NotFoundException('Not authorized');
    }
    const profile = this.studentsService.getStudentProfile(id);
    return { status: 'success', data: profile, message: 'Profile retrieved successfully' };
  }

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Update student profile' })
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const studentId = req.user.userId;
    if (studentId !== id) {
      throw new NotFoundException('Not authorized');
    }
    const updated = this.studentsService.updateStudentProfile(id, updateUserDto);
    return { status: 'success', data: updated, message: 'Profile updated successfully' };
  }

  @Get(':id/applied-events')
  @ApiOperation({ summary: 'Get events applied by student' })
  getAppliedEvents(@Param('id') id: string, @Request() req: any) {
    const studentId = req.user.userId;
    if (studentId !== id) {
      throw new NotFoundException('Not authorized');
    }
    const events = this.studentsService.getStudentAppliedEvents(id);
    return { status: 'success', data: events, message: 'Applied events retrieved successfully' };
  }
}
