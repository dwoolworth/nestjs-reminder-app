import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  description: string;

  @IsDate()
  dueDate: Date;

  @IsString()
  userId: string;
}

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  dueDate?: Date;
}