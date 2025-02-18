import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  NotFoundException,
  Get,
  Delete
} from '@nestjs/common';
import { ReminderService } from '../reminder/reminder.service';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Note } from './note.schema';

@ApiBearerAuth()
@ApiTags('reminder')
@Controller('reminder')
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(
    private readonly reminderService: ReminderService,
    private readonly noteService: NoteService,
  ) {}

  @Post(':id/notes')
  @ApiOperation({ summary: 'Create a new note for the reminder' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created for the reminder.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createNotes(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const userId = this.getUserId(req);
    const reminder = await this.reminderService.findOne(userId, id);
    if (!reminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to update it`,
      );
    }

    return this.noteService.create(id, createNoteDto);
  }

  @Put(':id/notes/:noteId')
  @ApiOperation({ summary: 'Update an existing note for a reminder' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully updated for the reminder. ',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateNote(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const userId = this.getUserId(req);
    const reminder = await this.reminderService.findOne(userId, id);

    if (!reminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to update it`,
      );
    }

    return this.noteService.update(id, noteId, updateNoteDto);
  }

  @Get(':id/notes')
  @ApiOperation({ summary: 'Find an existing notes for a reminder' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully fetched for the reminder. ',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findNotes(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Note[]> {
    const userId = this.getUserId(req);
    const reminder = await this.reminderService.findOne(userId, id);

    if (!reminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to update it`,
      );
    }

    return this.noteService.find(id);
  }

  @Delete(':id/notes/:noteId')
  @ApiOperation({summary: 'Delete an existing note for a reminder'})
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully deleted for the reminder. '
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async deleteNote(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('noteId') noteId: string,
  ):Promise<Note> {
    const userId = this.getUserId(req);
    const reminder = await this.reminderService.findOne(userId, id);

    if (!reminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to update it`,
      );
    }

    return this.noteService.remove(id, noteId);
  }

  private getUserId(req: Request): string {
    const user = req.user as any;
    if (user && (user.userId || user.sub || user._id)) {
      return user.userId || user.sub || user._id;
    }
    throw new NotFoundException('User not found');
  }
}
