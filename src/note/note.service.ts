import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(
    reminderId: string,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const createdNote = new this.noteModel({
      ...createNoteDto,
      reminder: reminderId, // Changed from userId to user
    });
    return createdNote.save();
  }

  async update(
    reminderId: string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const updatedNote = await this.noteModel
      .findOneAndUpdate({ _id: id, reminder: reminderId }, updateNoteDto, {
        new: true,
      })
      .exec();

    if (!updatedNote) {
      throw new NotFoundException(
        `Note with ID "${id}" not found or you don't have permission to update it`,
      );
    }
    return updatedNote;
  }
  async find(reminderId: string): Promise<Note[]> {
    return await this.noteModel.find({ reminder: reminderId });
  }
}
