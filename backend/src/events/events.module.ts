import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventApplicationsService } from './services/event-applications.service';
import { EventApplicationsController } from './event-applications.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [EventsController, EventApplicationsController],
  providers: [EventsService, EventApplicationsService],
  exports: [EventsService, EventApplicationsService],
})
export class EventsModule {}