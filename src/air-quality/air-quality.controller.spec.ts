import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let airQualityService: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AirQualityService,
          useValue: {
            getNearestCityAirQuality: jest.fn(),
            getMostPollutedDateTime: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    airQualityService = module.get<AirQualityService>(AirQualityService);
  });

  describe('getNearestCityAirQuality', () => {
    it('should return air quality data for the nearest city', async () => {
      const mockResult = {
        "Results": {
          "pollution": {
            "ts": "2023-08-19T17:00:00.000Z",
            "aqius": 26,
            "mainus": "o3",
            "aqicn": 20,
            "maincn": "o3"
          }
        }
      };
      jest.spyOn(airQualityService, 'getNearestCityAirQuality').mockResolvedValue(mockResult);

      const longitude = '2.352222';
      const latitude = '48.856613';

      const result = await controller.getNearestCityAirQuality(longitude, latitude);
      expect(result).toEqual(mockResult);
      expect(airQualityService.getNearestCityAirQuality).toHaveBeenCalled();

    });

    it('should throw an error if failed to fetch air quality data', async () => {
      jest.spyOn(airQualityService, 'getNearestCityAirQuality').mockRejectedValueOnce(Error('Failed to fetch air quality data'));

      const longitude = '2.352222';
      const latitude = '48.856613';

      await expect(controller.getNearestCityAirQuality(longitude, latitude)).rejects.toThrowError(
        'Failed to fetch air quality data'
      );
      expect(airQualityService.getNearestCityAirQuality).toHaveBeenCalled();
    });
  });

  describe('getMostPollutedDateTime', () => {
    it('should return the most polluted date and time', async () => {
      const mockResult = { mostPolluted: 'mockDateTime' };
      jest.spyOn(airQualityService, 'getMostPollutedDateTime').mockResolvedValue(mockResult);

      const result = await controller.getMostPollutedDateTime();

      expect(result).toEqual(mockResult);
      expect(airQualityService.getMostPollutedDateTime).toHaveBeenCalled();
    });
  });
});