import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { AirQualityService } from './air-quality.service';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly configService: ConfigService,
    private readonly airQualityService: AirQualityService) { }

  @Get('nearest-city')
  async getNearestCityAirQuality(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
  ): Promise<any> {
    const url = `${this.configService.get('IQAIR_API_URL')}nearest_city?lat=${latitude}&lon=${longitude}&key=${this.configService.get('API_KEY')}`;

    try {
        const response = await axios.get(url);
        const pollutionData = response.data.data.current.pollution;
        return { Results: { pollution: pollutionData } };
    } catch (error) {
        throw new Error('Failed to fetch air quality data');
    }
  }
  @Get('most-polluted-datetime')
  async getMostPollutedDateTime(): Promise<any> {
    return this.airQualityService.getMostPollutedDateTime();
  }
}