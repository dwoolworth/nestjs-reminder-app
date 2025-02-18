import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from './reminder.schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
  ) {}

  async create(
    userId: string,
    createReminderDto: CreateReminderDto,
  ): Promise<Reminder> {
    const createdReminder = new this.reminderModel({
      ...createReminderDto,
      user: userId, // Changed from userId to user
    });
    return createdReminder.save();
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    showCompleted: boolean = false,
  ): Promise<{ reminders: Reminder[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = { user: userId };
    if (!showCompleted) {
      query['status'] = false; // Assuming 'status' field represents completion status
    }
    const [reminders, total] = await Promise.all([
      this.reminderModel
        .find(query)
        .populate('notes')
        .sort({ priority: -1, dueDate: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reminderModel.countDocuments(query),
    ]);

    return { reminders, total };
  }

  // Update other methods similarly
  async findOne(userId: string, id: string): Promise<Reminder> {
    const reminder = await this.reminderModel
      .findOne({ _id: id, user: userId })
      .populate('notes')
      .exec();
    if (!reminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to access it`,
      );
    }
    return reminder;
  }

  async update(
    userId: string,
    id: string,
    updateReminderDto: UpdateReminderDto,
  ): Promise<Reminder> {
    const updatedReminder = await this.reminderModel
      .findOneAndUpdate({ _id: id, user: userId }, updateReminderDto, {
        new: true,
      })
      .exec();
    if (!updatedReminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to update it`,
      );
    }
    return updatedReminder;
  }

  async remove(userId: string, id: string): Promise<Reminder> {
    const deletedReminder = await this.reminderModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    if (!deletedReminder) {
      throw new NotFoundException(
        `Reminder with ID "${id}" not found or you don't have permission to delete it`,
      );
    }
    return deletedReminder;
  }

  async getTodayReminders(userId: string, date: Date): Promise<Reminder[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    return this.reminderModel
      .find({
        user: userId, // Changed from userId to user
        dueDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .populate('notes')
      .exec();
  }
  async deleteAllCompleted(userId: string): Promise<{ deletedCount: number }> {
    const result = await this.reminderModel
      .deleteMany({
        user: userId,
        status: true, // Assuming 'status: true' means the reminder is completed
      })
      .exec();

    return { deletedCount: result.deletedCount };
  }

  async addNoteToReminder(
    userId: string,
    id: string,
    note: any,
  ): Promise<Reminder> {
    return this.reminderModel.findOneAndUpdate(
      { _id: id, user: userId },
      { $push: { notes: note } },
      { new: true },
    );
  }
}
