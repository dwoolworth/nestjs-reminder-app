import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { User, UserDocument } from './user.schema';
import { UserRole } from '../constants/roles';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser: Partial<UserDocument> = {
    _id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    roles: [UserRole.SUBSCRIBER],
    refreshToken: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            createUser: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockUserService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'password123',
      };

      mockUserService.createUser.mockResolvedValue(mockUser as User);
      expect(await controller.create(createUserDto)).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserService.findAll.mockResolvedValue([mockUser as UserDocument]);

      const queryParams: FindAllUsersDto = {};
      const result = await controller.findAll(queryParams);
      expect(result).toEqual([mockUser]);
      expect(mockUserService.findAll).toHaveBeenCalledWith(queryParams);
    });

    it('should pass query parameters to service', async () => {
      const queryParams: FindAllUsersDto = {
        search: 'John',
        sort: 'firstName',
        order: 'asc',
      };
      await controller.findAll(queryParams);
      expect(mockUserService.findAll).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser as UserDocument);

      expect(await controller.findOne('1')).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      mockUserService.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      } as UserDocument);

      expect(await controller.update('1', updateUserDto)).toEqual({
        ...mockUser,
        ...updateUserDto,
      });
      expect(mockUserService.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      mockUserService.update.mockResolvedValue(null);
      await expect(controller.update('nonexistent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(mockUser as User);
      expect(await controller.remove('1')).toEqual(mockUser);
      expect(mockUserService.remove).toHaveBeenCalledWith('1');
    });

    it('should return null if user to remove is not found', async () => {
      mockUserService.remove.mockResolvedValue(null);
      expect(await controller.remove('nonexistent')).toBeNull();
    });
  });
});
