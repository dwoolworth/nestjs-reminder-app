import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService], // Make sure WeatherService is exported
})
export class WeatherModule {}