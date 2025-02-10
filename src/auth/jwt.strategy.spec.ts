import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../constants/roles';
import { UserDocument } from '../user/user.schema';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('testSecret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get(UserService) as jest.Mocked<UserService>;
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      const user: Partial<UserDocument> = {
        _id: '1',
        email: 'test@example.com',
        roles: [UserRole.SUBSCRIBER],
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        passwordHash: 'hashedPassword',
        refreshToken: 'refreshToken',
      };
      userService.findOne.mockResolvedValue(user as UserDocument);

      const result = await strategy.validate({
        sub: '1',
        email: 'test@example.com',
      });
      expect(result).toEqual(user); // Changed this line
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        strategy.validate({ sub: '1', email: 'test@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
