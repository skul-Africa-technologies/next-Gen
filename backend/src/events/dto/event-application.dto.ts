import { IsString, IsMongoId, IsEnum, IsOptional } from 'class-validator';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// No DTO needed for apply - studentId comes from JWT token
// This DTO can be used for status updates by admin
export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
