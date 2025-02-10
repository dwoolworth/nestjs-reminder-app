import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReminderService } from './reminder.service';
import { Reminder, ReminderDocument } from './reminder.schema';
import { CreateReminderDto, UpdateReminderDto } from './dto/reminder.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReminderService', () => {
  let service: ReminderService;
  let model: Model<ReminderDocument>;

  const mockReminder = {
    _id: 'some-id',
    description: 'This is a test reminder',
    dueDate: new Date(),
    userId: 'user-id',
  };

  const mockReminderModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderService,
        {
          provide: getModelToken('Reminder'),
          useValue: mockReminderModel,
        },
      ],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
    model = module.get<Model<ReminderDocument>>(getModelToken('Reminder'));
  });
  describe('create', () => {
    it('should create a new reminder', async () => {
      const createReminderDto: CreateReminderDto = {
        description: 'Test reminder',
        dueDate: new Date(),
        userId: 'user123',
      };

      mockReminderModel.create.mockResolvedValue({
        ...createReminderDto,
        _id: 'some-id',
        save: jest.fn().mockResolvedValue(mockReminder),
      });
      const result = await service.create(createReminderDto);
      expect(result).toEqual(mockReminder);
      expect(mockReminderModel.create).toHaveBeenCalledWith(createReminderDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of reminders', async () => {
      mockReminderModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockReminder]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockReminder]);
    });
  });

  describe('findOne', () => {
    it('should return a single reminder', async () => {
      mockReminderModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReminder),
      });

      const result = await service.findOne('some-id');
      expect(result).toEqual(mockReminder);
    });

    it('should throw NotFoundException if reminder is not found', async () => {
      mockReminderModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a reminder', async () => {
      const updateReminderDto: UpdateReminderDto = {
        description: 'Updated Reminder',
      };

      mockReminderModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockReminder, ...updateReminderDto }),
      });

      const result = await service.update('some-id', updateReminderDto);
      expect(result).toEqual({ ...mockReminder, ...updateReminderDto });
    });

    it('should throw NotFoundException if reminder to update is not found', async () => {
      mockReminderModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a reminder', async () => {
      mockReminderModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReminder),
      });

      const result = await service.remove('some-id');
      expect(result).toEqual(mockReminder);
    });

    it('should throw NotFoundException if reminder to remove is not found', async () => {
      mockReminderModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return reminders for a specific user', async () => {
      mockReminderModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockReminder]),
      });

      const result = await service.findByUserId('user-id');
      expect(result).toEqual([mockReminder]);
    });
  });
});