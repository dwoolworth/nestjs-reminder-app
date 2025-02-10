import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getWeather(latitude: number, longitude: number): Promise<any> {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }
}