import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ConfigModule', () => {
    const configModule = module.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should have MongooseModule', () => {
    const mongooseModule = module.get(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });

  it('should have UserModule', () => {
    const userModule = module.get(UserModule);
    expect(userModule).toBeDefined();
  });

  it('should have AuthModule', () => {
    const authModule = module.get(AuthModule);
    expect(authModule).toBeDefined();
  });
});
