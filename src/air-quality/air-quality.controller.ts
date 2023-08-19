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
      return this.airQualityService.getNearestCityAirQuality(longitude ,latitude );
  }
  @Get('most-polluted-datetime')
  async getMostPollutedDateTime(): Promise<any> {
    return this.airQualityService.getMostPollutedDateTime();
  }
}