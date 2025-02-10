import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('reminders')
@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reminder' })
  @ApiResponse({
    status: 201,
    description: 'The reminder has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.create(createReminderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reminders' })
  @ApiResponse({ status: 200, description: 'Return all reminders.' })
  findAll() {
    return this.reminderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reminder by id' })
  @ApiResponse({ status: 200, description: 'Return the reminder.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  findOne(@Param('id') id: string) {
    return this.reminderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.reminderService.update(id, updateReminderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  remove(@Param('id') id: string) {
    return this.reminderService.remove(id);
  }
}