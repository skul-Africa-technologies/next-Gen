import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class EventApplication extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ default: Date.now })
  appliedAt: Date;

  @Prop({ enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: string;
}

export const EventApplicationSchema = SchemaFactory.createForClass(EventApplication);

EventApplicationSchema.set('toJSON', {
  transform: function (doc: any, ret: any) {
    return {
      id: ret._id.toString(),
      student: ret.student?.toString(),
      event: ret.event?.toString(),
      appliedAt: ret.appliedAt,
      status: ret.status,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});
