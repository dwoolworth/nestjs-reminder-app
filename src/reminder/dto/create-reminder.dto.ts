import { IsNotEmpty, IsDate, IsBoolean, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: true,
    description: 'The status of the reminder or todo (true for completed, false for not completed)',
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    example: true,
    description: 'Indicates this reminder is a priority',
  })
  @IsNumber()
  priority: boolean;

  @ApiProperty({
    example: [],
    description: 'An array of notes related to the reminder or todo',
  })
  @IsNotEmpty()
  @IsArray()
  notes?: [string];
}