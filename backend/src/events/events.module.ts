import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';
import { EventApplication, EventApplicationSchema } from './schemas/event-application.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { EventApplicationsService } from './services/event-applications.service';
import { EventApplicationsController } from './event-applications.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventApplication.name, schema: EventApplicationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [EventsController, EventApplicationsController],
  providers: [EventsService, EventApplicationsService],
  exports: [EventsService, EventApplicationsService],
})
export class EventsModule {}