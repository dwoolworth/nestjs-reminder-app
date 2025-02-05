import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().required()
      })
    }),
    // Connect to MongoDB using MongooseModule.forRoot
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule, // import your feature modules here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
