import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

describe('Bootstrap (main.ts)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    configService = app.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create the application', () => {
    expect(app).toBeDefined();
  });

  it('should set global prefix to "api"', () => {
    expect((app as any).config.globalPrefix).toBe('api');
  });

  it('should use the correct port', () => {
    const port = configService.get<string>('PORT', '3080');
    expect(port).toBeDefined();
    expect(typeof port).toBe('string');
    expect(parseInt(port, 10)).toBeGreaterThan(0);
  });

  // You can add more tests here for Swagger setup if needed
});
