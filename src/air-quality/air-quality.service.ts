import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirQuality } from './air-quality.entity';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
    private readonly configService: ConfigService
  ) { }

  @Cron('*/300 * * * *') // Run every 1 minute
  async checkAirQuality() {
    const latitude = 48.856613;
    const longitude = 2.352222;

    const url = `${this.configService.get('IQAIR_API_URL')}nearest_city?lat=${latitude}&lon=${longitude}&key=${this.configService.get('API_KEY')}`;

    try {
      const response = await axios.get(url);
      const pollutionData = response.data.data.current.pollution;

      const airQuality = new AirQuality();
      airQuality.pollution = pollutionData;
      airQuality.dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      await this.airQualityRepository.save(airQuality);

    } catch (error) {
      throw new Error(`Failed to save air quality data`);
    }
  }
  async getNearestCityAirQuality(longitude: any, latitude: any): Promise<any> {
    const url = `${this.configService.get('IQAIR_API_URL')}nearest_city?lat=${latitude}&lon=${longitude}&key=${this.configService.get('API_KEY')}`;

    try {
      const response = await axios.get(url);
      const pollutionData = response.data.data.current.pollution;
      return { Results: { pollution: pollutionData } };
    } catch (error) {
      throw new Error(`Failed to fetch air quality data`);
    }
  }
  async getMostPollutedDateTime(): Promise<any> {
    const mostPolluted = await this.airQualityRepository
      .createQueryBuilder('airQuality')
      .orderBy('JSON_UNQUOTE(JSON_EXTRACT(airQuality.pollution, "$.aqius"))', 'DESC')
      .getOne();

    return { mostPolluted: mostPolluted.dateTime };
  }
}
