
import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air-quality.controller';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'IQAIR_API_URL') {
                return 'http://api.airvisual.com/v2/';
              } else if (key === 'API_KEY') {
                return 'bf0bcf88-7237-4193-a904-028c90a7dd81';
              }
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getNearestCityAirQuality', () => {
    it('should fetch air quality data for the nearest city', async () => {
      // Mock the axios library to return a specific response
      const axiosResponse = {
        data: {
          data: {
            current: {
              pollution:  {
                    "ts": "2023-08-19T00:00:00.000Z",
                    "aqius": 61,
                    "mainus": "p2",
                    "aqicn": 33,
                    "maincn": "p1"
                },
            },
          },
        },
      };
      jest.spyOn(axios, 'get').mockResolvedValue(axiosResponse);

      const longitude = '10.123';
      const latitude = '20.456';

      const result = await controller.getNearestCityAirQuality(longitude, latitude);

      expect(axios.get).toHaveBeenCalledWith(
        'http://api.airvisual.com/v2/nearest_city?lat=20.456&lon=10.123&key=bf0bcf88-7237-4193-a904-028c90a7dd81',
      );
      expect(result).toEqual({ Results: { pollution: axiosResponse.data.data.current.pollution } });
    });

    it('should throw an error if fetching air quality data fails', async () => {
      // Mock the axios library to throw an error
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch data'));

      const longitude = '10.123';
      const latitude = '20.456';

      await expect(controller.getNearestCityAirQuality(longitude, latitude)).rejects.toThrow(
        'Failed to fetch air quality data',
      );
    });
  });
});