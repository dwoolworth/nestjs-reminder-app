import {
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { REMINDER_STATUS } from '../enums/reminder.status';

export class CreateReminderDto {
  @ApiProperty({
    example: 'Meeting at 10 AM',
    description: 'The description of the reminder or todo',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2022-01-15T10:00:00.000Z',
    description: 'The date and time when the reminder or todo is due',
  })
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    example: REMINDER_STATUS.PENDING,
    enum: REMINDER_STATUS,
    description: 'The status of the reminder or todo',
  })
  @IsEnum(REMINDER_STATUS)
  status: REMINDER_STATUS;

  @ApiProperty({
    example: true,
    description: 'Indicates this reminder is a priority',
  })
  @IsNumber()
  priority: boolean;
}
