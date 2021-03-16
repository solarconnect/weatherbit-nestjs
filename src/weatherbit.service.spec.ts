import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherbitModule } from './weatherbit.module';
import { WeatherbitService } from './weatherbit.service';

describe('WeatherbitService', () => {
  let service: WeatherbitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WeatherbitModule.registerAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const apiKey = configService.get<string>('API_KEY');
            return {
              apiKey,
            };
          },
        }),
      ],
    }).compile();

    service = module.get<WeatherbitService>(WeatherbitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * test code 작성
   */
  it('now', async () => {
    const result = await service.nowByCoordinates(36, 127);
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('data');
    expect(Array.isArray(result.data)).toBeTruthy();
    expect(result.data.length).toBeGreaterThan(0);
  });
});
