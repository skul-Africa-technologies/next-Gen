import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventApplication } from '../schemas/event-application.schema';
import { Event } from '../schemas/event.schema';
import { User, UserRole } from '../../auth/schemas/user.schema';

@Injectable()
export class EventApplicationsService {
  constructor(
    @InjectModel(EventApplication.name) private applicationModel: Model<EventApplication>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async applyForEvent(eventId: string, studentId: string): Promise<EventApplication> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const student = await this.userModel.findById(studentId);
    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundException('Student not found');
    }

    const existingApplication = await this.applicationModel.findOne({
      event: new Types.ObjectId(eventId),
      student: new Types.ObjectId(studentId),
    });

    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this event');
    }

    const application = new this.applicationModel({
      event: new Types.ObjectId(eventId),
      student: new Types.ObjectId(studentId),
      status: 'pending',
    });

    await application.save();
    return application;
  }

  async getStudentAppliedEvents(studentId: string) {
    const applications = await this.applicationModel
      .find({ student: new Types.ObjectId(studentId), status: 'accepted' })
      .populate<{ event: Event }>('event', 'title description date location image')
      .sort({ appliedAt: -1 })
      .exec();

    return applications.map((app) => ({
      ...app.event,
      applicationStatus: app.status,
      appliedAt: app.appliedAt,
    }));
  }

  async getEventApplicants(eventId: string) {
    const applications = await this.applicationModel
      .find({ event: new Types.ObjectId(eventId) })
      .populate<{ student: User }>('student', 'name email school')
      .exec();

    return applications;
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    const application = await this.applicationModel.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true },
    );

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async getApplicationCountByEvent(eventId: string): Promise<number> {
    return this.applicationModel.countDocuments({ event: new Types.ObjectId(eventId), status: 'accepted' }).exec();
  }
}
