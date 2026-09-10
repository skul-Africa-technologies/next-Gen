import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventApplication } from '../schemas/event-application.schema';
import { Event } from '../schemas/event.schema';
import { UserRole } from '../../auth/schemas/user.schema';

@Injectable()
export class EventApplicationsService {
  constructor(private prisma: PrismaService) {}

  async applyForEvent(eventId: string, studentId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundException('Student not found');
    }

    const existingApplication = await this.prisma.eventApplication.findFirst({
      where: { eventId, studentId },
    });

    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this event');
    }

    const application = await this.prisma.eventApplication.create({
      data: {
        eventId,
        studentId,
        status: 'pending',
      },
      include: {
        event: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true,
          },
        },
      },
    });

    return application;
  }

  async getStudentAppliedEvents(studentId: string) {
    const applications = await this.prisma.eventApplication.findMany({
      where: { studentId, status: 'accepted' },
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

  async getEventApplicants(eventId: string) {
    const applications = await this.prisma.eventApplication.findMany({
      where: { eventId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true,
          },
        },
      },
    });

    return applications;
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    const application = await this.prisma.eventApplication.update({
      where: { id: applicationId },
      data: { status },
      include: {
        event: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async getApplicationCountByEvent(eventId: string): Promise<number> {
    return this.prisma.eventApplication.count({
      where: { eventId, status: 'accepted' },
    });
  }
}
