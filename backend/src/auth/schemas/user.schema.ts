import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop()
  school: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop()
  @Exclude()
  refreshToken: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ required: false })
  verificationToken?: string;

  @Prop({ required: false })
  verificationExpires?: Date;

  @Prop({ default: false })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: function(doc: any, ret: any) {
    return {
      id: ret._id.toString(),
      name: ret.name,
      email: ret.email,
      school: ret.school,
      role: ret.role,
      isActive: ret.isActive,
      isEmailVerified: ret.isEmailVerified,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});