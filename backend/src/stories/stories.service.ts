import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Story } from './schemas/story.schema';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createStoryDto: CreateStoryDto, adminId: string) {
    const story = await this.prisma.story.create({
      data: {
        ...createStoryDto,
        createdBy: adminId,
      },
    });

    return {
      success: true,
      message: 'Story created successfully',
      data: story,
    };
  }

  async findAll() {
    const stories = await this.prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Stories retrieved successfully',
      data: stories,
    };
  }

  async findOne(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

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
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) {
      throw new NotFoundException('Story not found');
    }

    await this.prisma.story.delete({ where: { id } });

    return {
      success: true,
      message: 'Story deleted successfully',
    };
  }

  async getStoriesCount(): Promise<number> {
    return this.prisma.story.count();
  }

  async getRecentStories(limit: number = 5): Promise<Story[]> {
    return this.prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
