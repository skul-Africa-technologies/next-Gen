import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/story.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create story (admin only)' })
  create(@Body() createStoryDto: CreateStoryDto, @Request() req: any) {
    return this.storiesService.create(createStoryDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stories (public)' })
  findAll() {
    return this.storiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get story by ID (public)' })
  findOne(@Param('id') id: string) {
    return this.storiesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete story (admin only)' })
  remove(@Param('id') id: string) {
    return this.storiesService.remove(id);
  }
}