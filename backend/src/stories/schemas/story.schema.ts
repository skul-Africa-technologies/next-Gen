import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Story extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  studentName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: function(doc: any, ret: any) {
    return {
      id: ret._id.toString(),
      title: ret.title,
      content: ret.content,
      image: ret.image,
      studentName: ret.studentName,
      createdBy: ret.createdBy?.toString(),
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});