import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event } from '../events/schemas/event.schema';
import { EventApplication } from '../events/schemas/event-application.schema';
import { UpdateUserDto } from '../users/dto/user.dto';

export interface StudentDashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  appliedEvents: number;
}

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(studentId: string): Promise<StudentDashboardStats> {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!student || student.role !== 'student') {
      throw new Error('Student not found');
    }

    const totalEvents = await this.prisma.event.count();

    const now = new Date();
    const upcomingEvents = await this.prisma.event.count({
      where: { date: { gt: now } },
    });

    const appliedEvents = await this.prisma.eventApplication.count({
      where: { studentId, status: 'accepted' },
    });

    return {
      totalEvents,
      upcomingEvents,
      appliedEvents,
    };
  }

  async getStudentAppliedEvents(studentId: string) {
    const applications = await this.prisma.eventApplication.findMany({
      where: { studentId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            image: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return applications.map((app) => ({
      ...app.event,
      applicationStatus: app.status,
      appliedAt: app.appliedAt,
    }));
  }

  async getStudentProfile(studentId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    return user;
  }

  async updateStudentProfile(studentId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: studentId },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    return user;
  }
}
