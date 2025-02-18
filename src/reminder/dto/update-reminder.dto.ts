import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateReminderDto } from './create-reminder.dto';
import { IsOptional, IsArray, IsMongoId } from 'class-validator';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {
  @ApiProperty({ required: false, type: [String], description: 'Array of note IDs to set for this reminder' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  notes?: string[];
}
