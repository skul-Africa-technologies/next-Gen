import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { StoriesModule } from '../stories/stories.module';

@Module({
  imports: [UsersModule, EventsModule, StoriesModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}