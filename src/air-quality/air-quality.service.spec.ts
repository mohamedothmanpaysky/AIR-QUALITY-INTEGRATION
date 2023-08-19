import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air-quality.service';
import { Repository } from 'typeorm';
import { AirQuality } from './air-quality.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AirQualityService', () => {
  let service: AirQualityService;
  let airQualityRepository: Repository<AirQuality>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: getRepositoryToken(AirQuality),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    airQualityRepository = module.get<Repository<AirQuality>>(getRepositoryToken(AirQuality));
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('checkAirQuality', () => {
    it('should save air quality data to the repository', async () => {
      const mockResponse = {
        data: {
          data: {
            current: {
              pollution: {
                // Mock pollution data
              },
            },
          },
        },
      };

      jest.spyOn(configService, 'get').mockReturnValueOnce('mock_api_url');
      jest.spyOn(configService, 'get').mockReturnValueOnce('mock_api_key');
      jest.spyOn(axios, 'get').mockResolvedValueOnce(mockResponse);
        jest.spyOn(airQualityRepository, 'save').mockResolvedValueOnce(Promise.resolve({
            id:1,
            pollution: {
                ts: '2023-08-19T14:00:00.000Z',
                aqius: 25,
                mainus: 'o3',
                aqicn: 19,
                maincn: 'o3'
            },
            dateTime: '2023-08-19 15:00:00'
        }));

      await service.checkAirQuality();

      expect(configService.get).toHaveBeenCalledWith('IQAIR_API_URL');
      expect(configService.get).toHaveBeenCalledWith('API_KEY');
      expect(axios.get).toHaveBeenCalledWith('mock_api_urlnearest_city?lat=48.856613&lon=2.352222&key=mock_api_key');
      expect(airQualityRepository.save).toHaveBeenCalled();
    });

    it('should handle errors when fetching air quality data', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('mock_api_url');
      jest.spyOn(configService, 'get').mockReturnValueOnce('mock_api_key');
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Failed to fetch air quality data'));

      await service.checkAirQuality();

      expect(configService.get).toHaveBeenCalledWith('IQAIR_API_URL');
      expect(configService.get).toHaveBeenCalledWith('API_KEY');
      expect(axios.get).toHaveBeenCalledWith('mock_api_urlnearest_city?lat=48.856613&lon=2.352222&key=mock_api_key');
    });
  });

  describe('getMostPollutedDateTime', () => {
    it('should return the most polluted date and time', async () => {
      const mockMostPolluted = {
        dateTime: '2023-08-19 12:00:00',
      };

      jest.spyOn(airQualityRepository, 'createQueryBuilder').mockReturnValueOnce({
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(mockMostPolluted),
      } as any);

      const result = await service.getMostPollutedDateTime();

      expect(result).toEqual({ mostPolluted: '2023-08-19 12:00:00' });
      expect(airQualityRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
