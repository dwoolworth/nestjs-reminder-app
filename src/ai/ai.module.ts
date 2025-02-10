import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { WeatherModule } from '../weather/weather.module';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { ReminderModule } from '../reminder/reminder.module';

@Module({
  imports: [
    WeatherModule,
    GeocodingModule,
    ReminderModule
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}