import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from './reminder.schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { REMINDER_STATUS } from './enums/reminder.status';

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
      status: REMINDER_STATUS.PENDING,
      user: userId, // Changed from userId to user
    });
    return createdReminder.save();
  }

  async findAll(
    userId: string,
    page: number,
    limit: number,
    status: string,
  ): Promise<{ reminders: Reminder[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { user: userId };
    if (status) {
      query['status'] = status; // Assuming 'status' field represents completion status
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
  async findOne(userId: string, id: string): Promise<ReminderDocument> {
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
    // Note that if the 'notes' field is included in the update, it will be updated as well.
    // If the 'notes' field is not included in the update, it will not be updated.
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
    console.log(`Admin user already exists`, userId);
    const result = await this.reminderModel
      .deleteMany({
        user: userId,
        status: REMINDER_STATUS.COMPLETED,
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
