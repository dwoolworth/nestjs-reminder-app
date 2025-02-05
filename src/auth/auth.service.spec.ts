import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            setRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const user = {
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        toObject: () => ({
          email: 'test@example.com',
          passwordHash: 'hashedPassword',
        }),
      };
      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });

    it('should return user without password if validation is successful', async () => {
      const user = {
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        name: 'Test User',
        toObject: () => ({
          email: 'test@example.com',
          passwordHash: 'hashedPassword',
          name: 'Test User',
        }),
      };
      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateUser(
        'test@example.com',
        'correctPassword',
      );
      expect(result).toEqual({ email: 'test@example.com', name: 'Test User' });
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { _id: '123', email: 'test@example.com', roles: ['user'] };
      (jwtService.sign as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');
      const result = await service.login(user);
      expect(result).toEqual({
        access_token: 'accessToken',
      });
      expect(userService.setRefreshToken).toHaveBeenCalledWith(
        '123',
        'refreshToken',
      );
    });
  });

  // Add more tests for other methods like register, refreshToken, etc.
});
