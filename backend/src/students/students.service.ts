import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
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
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(EventApplication.name) private applicationModel: Model<EventApplication>,
  ) {}

  async getDashboardStats(studentId: string): Promise<StudentDashboardStats> {
    const student = await this.userModel.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new Error('Student not found');
    }

    const totalEvents = await this.eventModel.countDocuments();

    const now = new Date();
    const upcomingEvents = await this.eventModel.countDocuments({
      date: { $gt: now },
    });

    const appliedEvents = await this.applicationModel.countDocuments({
      student: new Types.ObjectId(studentId),
      status: 'accepted',
    });

    return {
      totalEvents,
      upcomingEvents,
      appliedEvents,
    };
  }

  async getStudentAppliedEvents(studentId: string) {
    const applications = await this.applicationModel
      .find({ student: new Types.ObjectId(studentId) })
      .populate<{ event: Event }>('event', 'title description date location image')
      .sort({ appliedAt: -1 })
      .exec();

    return applications.map((app) => ({
      ...app.event.toJSON ? app.event.toJSON() : app.event,
      applicationStatus: app.status,
      appliedAt: app.appliedAt,
    }));
  }

  async getStudentProfile(studentId: string) {
    const user = await this.userModel
      .findById(studentId)
      .select('-password -refreshToken')
      .exec();

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    return user;
  }

  async updateStudentProfile(studentId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(studentId, updateUserDto, { new: true })
      .select('-password -refreshToken')
      .exec();

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    return user;
  }
}
