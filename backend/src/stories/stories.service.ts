import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Story } from './schemas/story.schema';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
  ) {}

  async create(createStoryDto: CreateStoryDto, adminId: string) {
    const story = new this.storyModel({
      ...createStoryDto,
      createdBy: new Types.ObjectId(adminId),
    });

    await story.save();

    return {
      success: true,
      message: 'Story created successfully',
      data: story,
    };
  }

  async findAll() {
    const stories = await this.storyModel
      .find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .exec();

    return {
      success: true,
      message: 'Stories retrieved successfully',
      data: stories,
    };
  }

  async findOne(id: string) {
    const story = await this.storyModel.findById(id).select('-__v').exec();

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return {
      success: true,
      message: 'Story retrieved successfully',
      data: story,
    };
  }

  async remove(id: string) {
    const story = await this.storyModel.findByIdAndDelete(id).exec();

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return {
      success: true,
      message: 'Story deleted successfully',
    };
  }

  async getStoriesCount(): Promise<number> {
    return this.storyModel.countDocuments().exec();
  }

  async getRecentStories(limit: number = 5): Promise<Story[]> {
    return this.storyModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}