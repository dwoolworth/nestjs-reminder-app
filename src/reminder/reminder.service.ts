import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from './reminder.schema';
import { CreateReminderDto, UpdateReminderDto } from './dto/reminder.dto';

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
  ) {}

  // Remove this method
  // async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
  //   const createdReminder = new this.reminderModel(createReminderDto);
  //   return createdReminder.save();
  // }

  // Keep this method
  async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
    return this.reminderModel.create(createReminderDto);
  }

  async findOne(id: string): Promise<Reminder> {
    const reminder = await this.reminderModel.findById(id).exec();
    if (!reminder) {
      throw new NotFoundException(`Reminder with ID "${id}" not found`);
    }
    return reminder;
  }

  async update(id: string, updateReminderDto: UpdateReminderDto): Promise<Reminder> {
    const updatedReminder = await this.reminderModel
      .findByIdAndUpdate(id, updateReminderDto, { new: true })
      .exec();
    if (!updatedReminder) {
      throw new NotFoundException(`Reminder with ID "${id}" not found`);
    }
    return updatedReminder;
  }

  async remove(id: string): Promise<Reminder> {
    const deletedReminder = await this.reminderModel.findByIdAndDelete(id).exec();
    if (!deletedReminder) {
      throw new NotFoundException(`Reminder with ID "${id}" not found`);
    }
    return deletedReminder;
  }

  async findByUserId(userId: string): Promise<Reminder[]> {
    return this.reminderModel.find({ userId }).exec();
  }
async findAll(): Promise<Reminder[]> {
  return this.reminderModel.find().exec();
}
}