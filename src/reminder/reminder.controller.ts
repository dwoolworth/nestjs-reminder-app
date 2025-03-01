import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Reminder } from './reminder.schema';
import { FindReminderDto } from './dto/find-reminder.dto';

@ApiBearerAuth()
@ApiTags('Reminders')
@Controller('reminder')
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
  async create(
    @Req() req: Request,
    @Body() createReminderDto: CreateReminderDto,
  ) {
    const userId = this.getUserId(req);
    return this.reminderService.create(userId, createReminderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reminders for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Return all reminders for the user.',
  })
  async findAll(
    @Req() req: Request,
    @Query() findReminderDto: FindReminderDto,
  ) {
    const { page, limit, status } = findReminderDto;
    const userId = this.getUserId(req);
    return this.reminderService.findAll(userId, page, limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reminder by id' })
  @ApiResponse({ status: 200, description: 'Return the reminder.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = this.getUserId(req);
    return this.reminderService.findOne(userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ): Promise<Reminder> {
    const userId = this.getUserId(req);
    const updatedReminder = await this.reminderService.update(
      userId,
      id,
      updateReminderDto,
    );
    if (!updatedReminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to update it`,
      );
    }
    return updatedReminder;
  }

  @Delete('completed')
  @ApiOperation({
    summary: 'Delete all completed reminders for the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Completed reminders have been successfully deleted.',
  })
  async deleteAllCompleted(@Req() req: Request) {
    const userId = this.getUserId(req);
    return this.reminderService.deleteAllCompleted(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Reminder> {
    const userId = this.getUserId(req);
    const deletedReminder = await this.reminderService.remove(userId, id);
    if (!deletedReminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to delete it`,
      );
    }
    return deletedReminder;
  }

  private getUserId(req: Request): string {
    const user = req.user as any;
    if (user && (user.userId || user.sub || user._id)) {
      return user.userId || user.sub || user._id;
    }
    throw new NotFoundException('User not found');
  }
}
