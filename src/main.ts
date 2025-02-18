import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Reminder App API')
    .setDescription('The Reminder App API description')
    .setVersion('1.0')
    .addTag('Reminders')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // creating swagger json file
  const swaggerJson = './swagger/swagger.json';
  writeFileSync(swaggerJson, JSON.stringify(document, null, 2));
  console.log('Swagger Json created');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3080);
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Failed to start the application:', err);
  process.exit(1);
});
