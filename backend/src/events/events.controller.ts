import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create event (admin only)' })
  async create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    const result = await this.eventsService.create(createEventDto, req.user.userId);
    return { status: 'success', data: result.data, message: result.message };
  }

  @Get()
  @ApiOperation({ summary: 'Get all events (public)' })
  async findAll() {
    const result = await this.eventsService.findAll();
    return { status: 'success', data: result.data, message: result.message };
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events (public)' })
  async getUpcomingEvents() {
    const events = await this.eventsService.getUpcomingEvents();
    return { status: 'success', data: events, message: 'Upcoming events retrieved successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID (public)' })
  async findOne(@Param('id') id: string) {
    const result = await this.eventsService.findOne(id);
    return { status: 'success', data: result.data, message: result.message };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event (admin only)' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const result = await this.eventsService.update(id, updateEventDto);
    return { status: 'success', data: result.data, message: result.message };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event (admin only)' })
  async remove(@Param('id') id: string) {
    const result = await this.eventsService.remove(id);
    return { status: 'success', data: null, message: result.message };
  }

  @Post(':eventId/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for an event (student only)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  async applyForEvent(
    @Param('eventId') eventId: string,
    @Request() req: any,
  ) {
    const studentId = req.user.userId;
    const result = await this.eventsService.applyForEvent(eventId, studentId);
    return { status: 'success', data: result.data, message: result.message };
  }
}
