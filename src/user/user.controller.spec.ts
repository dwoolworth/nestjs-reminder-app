import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    _id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    roles: ['subscriber'],
  toObject: jest.fn().mockReturnThis(),
};

const mockUserService = {
  createUser: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn().mockResolvedValue(mockUser),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [UserController],
    providers: [
      {
        provide: UserService,
        useValue: mockUserService,
      },
    ],
  }).compile();

  controller = module.get<UserController>(UserController);
  service = module.get<UserService>(UserService);
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

    expect(await controller.create(createUserDto)).toEqual(mockUser);
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
  });
});

describe('findAll', () => {
  it('should return an array of users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });
});

describe('findOne', () => {
  it('should return a user by id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
    await expect(controller.findOne('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('update', () => {
  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
    };

    expect(await controller.update('1', updateUserDto)).toEqual(mockUser);
    expect(mockUserService.update).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should throw NotFoundException if user to update is not found', async () => {
    mockUserService.update.mockResolvedValueOnce(null);
    await expect(controller.update('nonexistent', {})).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('remove', () => {
  it('should remove a user', async () => {
    expect(await controller.remove('1')).toEqual(mockUser);
    expect(mockUserService.remove).toHaveBeenCalledWith('1');
  });

  it('should return null if user to remove is not found', async () => {
    mockUserService.remove.mockResolvedValueOnce(null);
    expect(await controller.remove('nonexistent')).toBeNull();
  });
});

}); // Add this closing bracket
