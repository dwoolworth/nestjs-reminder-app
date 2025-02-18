import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { ReminderDocument } from 'src/reminder/reminder.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>
  ) {}

  async create(
    reminder: ReminderDocument,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    // When creating a note, we need to add the node id to the reminder
    const createdNote = new this.noteModel({
      ...createNoteDto,
      reminder: reminder._id, // Changed from userId to user
    });

    // Save the note first to get its _id
    const savedNote = await createdNote.save();

    // Update the reminder with the new note's _id
    reminder.notes.push(savedNote._id);
    await reminder.save();

    return savedNote;
  }

  async update(
    reminderId: string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const updatedNote = await this.noteModel
      .findOneAndUpdate({ _id: id, reminder: reminderId }, updateNoteDto, {
        new: true,
      });

    if (!updatedNote) {
      throw new NotFoundException(
        `Note with ID "${id}" not found or you don't have permission to update it`,
      );
    }

    return updatedNote;
  }

  async findAll(reminderId: string): Promise<Note[]> {
    const notes = await this.noteModel.find({ reminder: reminderId });

    if (!notes) {
      throw new NotFoundException(
        `Notes for Reminder "${reminderId}" not found or you don't have permission to view them`,
      );
    }

    return notes;
  }

  async find(reminderId: string, noteId: string): Promise<Note> {
    const note = await this.noteModel.findOne({ _id: noteId, reminder: reminderId }).exec();

    if (!note) {
      throw new NotFoundException(
        `Note with ID "${noteId}" not found or you don't have permission to view it`,
      );
    }

    return note;
  }

  async remove(
    reminder: ReminderDocument,
    noteId: string,
  ): Promise<Note> {
    const deletedNote = await this.noteModel
      .findOneAndDelete({ _id: noteId, reminder: reminder._id });
    if (!deletedNote) {
      throw new NotFoundException(
        `Note with ID "${noteId}" not found or you don't have permission to delete it`,
      );
    }
    // Don't forget to remove the note id from the reminder's notes array
    reminder.notes = reminder.notes.filter((id) => id.toString() !== noteId);
    await reminder.save();

    return deletedNote;
  }
}
