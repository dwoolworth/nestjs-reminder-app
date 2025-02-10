import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UserRole } from '../constants/roles';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  const mockUser: Partial<UserDocument> = {
    _id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    roles: [UserRole.SUBSCRIBER],
    refreshToken: '',
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  // Add your other test cases here
  // For example:

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      const mockQueryParams: FindAllUsersDto = { page: 1, limit: 10, skip: 0 };
      jest.spyOn(model, 'find').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      } as any);

      const result = await service.findAll(mockQueryParams);
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, ...updateUserDto };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await service.remove('1');
      expect(result).toEqual(mockUser);
    });
  });
});
