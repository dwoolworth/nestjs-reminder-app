import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Weather')
@Controller('weather')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get weather data for a location' })
  @ApiQuery({ name: 'latitude', required: true, type: Number, description: 'Latitude of the location' })
  @ApiQuery({ name: 'longitude', required: true, type: Number, description: 'Longitude of the location' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns weather data', 
    schema: {
      type: 'object',
      properties: {
        main: {
          type: 'object',
          properties: {
            temp: { type: 'number', description: 'Current temperature in Fahrenheit' },
            feels_like: { type: 'number', description: 'Feels like temperature in Fahrenheit' },
            humidity: { type: 'number', description: 'Humidity percentage' },
          }
        },
        wind: {
          type: 'object',
          properties: {
            speed: { type: 'number', description: 'Wind speed in miles per hour' },
          }
        },
        weather: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string', description: 'Brief description of the weather' },
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid latitude or longitude' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 500, description: 'Internal server error - Failed to fetch weather data' })
  async getWeather(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number
  ) {
    return this.weatherService.getWeather(latitude, longitude);
  }
}