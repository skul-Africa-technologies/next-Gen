import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event } from './schemas/event.schema';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { EventApplicationsService } from './services/event-applications.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private readonly eventApplicationsService: EventApplicationsService,
  ) {}

  async create(createEventDto: CreateEventDto, adminId: string) {
    const event = await this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description ?? null,
        date: createEventDto.date,
        image: createEventDto.image ?? null,
        location: createEventDto.location,
        createdBy: adminId,
      },
    });

    return {
      success: true,
      message: 'Event created successfully',
      data: event,
    };
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    return {
      success: true,
      message: 'Events retrieved successfully',
      data: events,
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      success: true,
      message: 'Event retrieved successfully',
      data: event,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      success: true,
      message: 'Event updated successfully',
      data: event,
    };
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({ where: { id } });

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  }

  async getEventsCount(): Promise<number> {
    return this.prisma.event.count();
  }

  async getRecentEvents(limit: number = 5): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUpcomingEvents(limit?: number) {
    const now = new Date();
    const where = { date: { gt: now } };

    return this.prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      ...(limit ? { take: limit } : {}),
    });
  }

  async applyForEvent(eventId: string, studentId: string) {
    const application = await this.eventApplicationsService.applyForEvent(eventId, studentId);
    return {
      success: true,
      message: 'Application submitted successfully',
      data: application,
    };
  }
}
