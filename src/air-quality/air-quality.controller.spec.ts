import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import axios from 'axios';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let configService: ConfigService;
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
            getMostPollutedDateTime: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    configService = module.get<ConfigService>(ConfigService);
    airQualityService = module.get<AirQualityService>(AirQualityService);
  });

  describe('getNearestCityAirQuality', () => {
    it('should return air quality data for the nearest city', async () => {
      // Mock the configService.get method and axios.get method
      jest.spyOn(configService, 'get').mockReturnValueOnce('mockIqairApiUrl').mockReturnValueOnce('mockApiKey');
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: { data: { current: { pollution: 'mockPollutionData' } } },
      });

      const longitude = 'mockLongitude';
      const latitude = 'mockLatitude';

      const result = await controller.getNearestCityAirQuality(longitude, latitude);

      expect(result).toEqual({ Results: { pollution: 'mockPollutionData' } });
      expect(configService.get).toHaveBeenCalledWith('IQAIR_API_URL');
      expect(configService.get).toHaveBeenCalledWith('API_KEY');
      expect(axios.get).toHaveBeenCalledWith(
        `mockIqairApiUrlnearest_city?lat=${latitude}&lon=${longitude}&key=mockApiKey`
      );
    });

    it('should throw an error if failed to fetch air quality data', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('mockIqairApiUrl').mockReturnValueOnce('mockApiKey');
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('mockError'));

      const longitude = 'mockLongitude';
      const latitude = 'mockLatitude';

      await expect(controller.getNearestCityAirQuality(longitude, latitude)).rejects.toThrowError(
        'Failed to fetch air quality data'
      );
      expect(configService.get).toHaveBeenCalledWith('IQAIR_API_URL');
      expect(configService.get).toHaveBeenCalledWith('API_KEY');
      expect(axios.get).toHaveBeenCalledWith(
        `mockIqairApiUrlnearest_city?lat=${latitude}&lon=${longitude}&key=mockApiKey`
      );
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