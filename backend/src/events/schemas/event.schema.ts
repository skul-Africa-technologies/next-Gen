import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  image: string;

  @Prop()
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: function(doc: any, ret: any) {
    return {
      id: ret._id.toString(),
      title: ret.title,
      description: ret.description,
      date: ret.date,
      image: ret.image,
      location: ret.location,
      createdBy: ret.createdBy?.toString(),
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});