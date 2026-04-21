import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../auth/schemas/user.schema';
import { UpdateUserDto } from './dto/user.dto';

export interface CreateAdminDto {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    const users = await this.userModel
      .find({ role: 'student' })
      .select('-password -refreshToken')
      .exec();

    return {
      success: true,
      message: 'Students retrieved successfully',
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -refreshToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password -refreshToken')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  async getStudentsCount(): Promise<number> {
    return this.userModel.countDocuments({ role: 'student' }).exec();
  }

  async findOneByRole(role: UserRole): Promise<User | null> {
    return this.userModel.findOne({ role }).exec();
  }

  async createAdmin(data: CreateAdminDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = new this.userModel({
      email: data.email,
      password: hashedPassword,
      name: data.name || 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true,
    });

    return admin.save();
  }
}