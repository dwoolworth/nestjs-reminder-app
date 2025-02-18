import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ReminderModule } from './reminder/reminder.module';
import { AiModule } from './ai/ai.module';
import { WeatherModule } from './weather/weather.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    GeocodingModule,
    AuthModule,
    ReminderModule,
    WeatherModule,
    AiModule,
    NoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
