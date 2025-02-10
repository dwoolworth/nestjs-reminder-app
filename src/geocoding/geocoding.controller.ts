import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Geocoding')
@Controller('geocoding')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Get('address')
  @ApiOperation({ summary: 'Get address for a location' })
  @ApiResponse({ status: 200, description: 'Returns address' })
  async getAddress(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number
  ) {
    return this.geocodingService.getAddress(latitude, longitude);
  }
}