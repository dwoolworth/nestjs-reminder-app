import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

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
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      const user = { _id: '1', email: 'test@example.com', roles: ['user'] };
      (userService.findOne as jest.Mock).mockResolvedValue(user);

      const result = await strategy.validate({
        sub: '1',
        email: 'test@example.com',
      });
      expect(result).toEqual({
        userId: user._id,
        email: user.email,
        roles: user.roles,
      });
    });

    it('should throw an error if user is not found', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        strategy.validate({ sub: '1', email: 'test@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
