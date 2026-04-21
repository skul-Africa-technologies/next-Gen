import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, adminId: string) {
    const event = new this.eventModel({
      ...createEventDto,
      createdBy: new Types.ObjectId(adminId),
    });

    await event.save();

    return {
      success: true,
      message: 'Event created successfully',
      data: event,
    };
  }

  async findAll() {
    const events = await this.eventModel
      .find()
      .sort({ date: 1 })
      .select('-__v')
      .exec();

    return {
      success: true,
      message: 'Events retrieved successfully',
      data: events,
    };
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(id).select('-__v').exec();

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
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .select('-__v')
      .exec();

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
    const event = await this.eventModel.findByIdAndDelete(id).exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  }

  async getEventsCount(): Promise<number> {
    return this.eventModel.countDocuments().exec();
  }

  async getRecentEvents(limit: number = 5): Promise<Event[]> {
    return this.eventModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}