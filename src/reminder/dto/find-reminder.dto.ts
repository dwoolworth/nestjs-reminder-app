import { IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { REMINDER_STATUS } from '../enums/reminder.status';
import { number } from 'joi';
import { Transform, Type } from 'class-transformer';

export class FindReminderDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'page',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => number)
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Min(10)
  page: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Limit',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => number)
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Min(10)
  limit?: number = 1;

  @ApiPropertyOptional({
    example: REMINDER_STATUS.PENDING,
    enum: REMINDER_STATUS,
    description: 'The status of the reminder or todo',
  })
  @IsOptional()
  @IsEnum(REMINDER_STATUS)
  status?: REMINDER_STATUS;
}
