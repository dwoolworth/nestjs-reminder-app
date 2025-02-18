import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { ReminderModule } from 'src/reminder/reminder.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    ReminderModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService], // Add this line to export NoteService
})
export class NoteModule {}
