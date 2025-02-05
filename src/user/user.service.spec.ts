import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: 'someId',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    passwordHash: 'hashedpassword',
    roles: ['subscriber'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      const mockUser = {
        _id: 'someId',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        passwordHash: 'hashedpassword',
        roles: ['subscriber'],
        __v: 0,
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve([mockUser] as any));

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(model.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        passwordHash: 'hashedpassword',
      });
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockUser]),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.findOne('someId');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.findOne('nonexistentId');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, firstName: 'Jane' };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedUser),
      } as any);

      const result = await service.update('someId', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove and return a user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.remove('someId');
      expect(result).toEqual(mockUser);
    });
  });
});
