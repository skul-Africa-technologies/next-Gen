import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Event } from '../events/schemas/event.schema';
import { Story } from '../stories/schemas/story.schema';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { StoriesService } from '../stories/stories.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private eventsService: EventsService,
    private storiesService: StoriesService,
  ) {}

  async getDashboard() {
    const [totalStudents, totalEvents, totalStories] = await Promise.all([
      this.usersService.getStudentsCount(),
      this.eventsService.getEventsCount(),
      this.storiesService.getStoriesCount(),
    ]);

    return {
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        totalStudents,
        totalEvents,
        totalStories,
      },
    };
  }

  async getActivity() {
    const [recentEvents, recentStudents] = await Promise.all([
      this.eventsService.getRecentEvents(5),
      (await this.usersService.findAll()).data.slice(0, 5),
    ]);

    return {
      success: true,
      message: 'Activity data retrieved successfully',
      data: {
        recentEvents,
        recentStudents,
      },
    };
  }

  async getStudents(page: number = 1, limit: number = 10) {
    const users = await (await this.usersService.findAll()).data;
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);

    return {
      success: true,
      message: 'Students retrieved successfully',
      data: {
        users: paginatedUsers,
        total: users.length,
        page,
        limit,
      },
    };
  }

  async getEvents(page: number = 1, limit: number = 10) {
    const events = await (await this.eventsService.findAll()).data;
    const start = (page - 1) * limit;
    const paginatedEvents = events.slice(start, start + limit);

    return {
      success: true,
      message: 'Events retrieved successfully',
      data: {
        events: paginatedEvents,
        total: events.length,
        page,
        limit,
      },
    };
  }
}