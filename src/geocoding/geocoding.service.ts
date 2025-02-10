import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getAddress(latitude: number, longitude: number): Promise<string> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      throw new Error('Failed to fetch address data');
    }
  }
}