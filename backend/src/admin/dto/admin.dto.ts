import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  totalEvents: number;

  @ApiProperty()
  totalStories: number;
}

export class ActivityResponseDto {
  @ApiProperty()
  recentEvents: any[];

  @ApiProperty()
  recentStudents: any[];
}

export class AdminStudentsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  limit?: string;
}

export class AdminEventsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  limit?: string;
}