import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { WeatherService } from '../weather/weather.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { ReminderService } from '../reminder/reminder.service';
import { Request } from 'express';
import { User } from '../user/user.schema';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly weatherService: WeatherService,
    private readonly geocodingService: GeocodingService,
    private readonly reminderService: ReminderService
  ) {}

  @Post('inspiration')
  @ApiOperation({ summary: 'Get inspirational message based on user context' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        longitude: { type: 'number' },
        latitude: { type: 'number' },
      },
      required: ['longitude', 'latitude'],
    },
  })
  @ApiResponse({ status: 200, description: 'Returns an inspirational message', type: String })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInspirationalMessage(
    @Req() req: Request,
    @Body('longitude') longitude: number,
    @Body('latitude') latitude: number
  ) {
    const user = req.user as User; // Assuming the user object is attached to the request by JwtAuthGuard

    // Get weather
    const weather = await this.weatherService.getWeather(latitude, longitude);

    // Get address
    const address = await this.geocodingService.getAddress(latitude, longitude);

    // Get today's reminders
    const today = new Date();
    const reminders = await this.reminderService.getTodayReminders(user._id, today);

    // Assemble context
    const context = {
      weather,
      address,
      currentDateTime: today.toISOString(),
      reminders
    };

    // Prepare message for AI
    const message = `Given today's weather outlook: ${JSON.stringify(weather)}, 
                     address: ${JSON.stringify(address)}, 
                     current date and time: ${context.currentDateTime}, 
                     and their list of reminders or todo's: ${JSON.stringify(reminders)}, 
                     please provide a short motivational message for this user.`;

    // Get AI response
    const response = await this.aiService.getChatCompletion(message);

    return { inspirationalMessage: response.replace(/"/g, '') };
  }
}