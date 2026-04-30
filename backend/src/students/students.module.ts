import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { EventApplication, EventApplicationSchema } from '../events/schemas/event-application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventApplication.name, schema: EventApplicationSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
