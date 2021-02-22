import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { WEATHERBIT_MODULE_CONFIG } from './constants';
import {
  WeatherbitContext,
  WeatherbitCurrentResponse,
  WeatherbitException,
  WeatherbitLanguage,
  WeatherbitUnit,
} from './weatherbit.interface';
import { WeatherbitModuleConfig } from './weatherbit.module';

/**
 * Documentation https://www.weatherbit.io/api/weather-current
 */
@Injectable()
export class WeatherbitService {
  private readonly logger: Logger = new Logger(this.constructor.name);

  private readonly API_HOST = 'api.weatherbit.io';
  private readonly API_VERSION = 'v2.0';
  private readonly API_HTTP_SCHEMA: string;
  private readonly API_KEY: string;

  private readonly config: WeatherbitModuleConfig;

  constructor(
    @Inject(WEATHERBIT_MODULE_CONFIG)
    {
      apiKey,
      useHttps = false,
      lang = WeatherbitLanguage.en,
      unit = WeatherbitUnit.Metric,
    }: WeatherbitModuleConfig,
    private readonly httpService: HttpService,
  ) {
    this.API_KEY = apiKey;
    this.API_HTTP_SCHEMA = useHttps === true ? 'https' : 'http';

    this.config = {
      apiKey,
      useHttps,
      unit,
      lang,
    };
  }

  /**
   * 서비스별 api url 을 생성합니다.
   * @private
   */
  private makeUrl(context: WeatherbitContext): string {
    return `${this.API_HTTP_SCHEMA}://${this.API_HOST}/${this.API_VERSION}/${context}?key=${this.API_KEY}`;
  }

  /**
   * 좌표로 현재 날씨를 조회합니다.
   * https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
   * Current milliseconds
   * @param latitude
   * @param longitude
   */
  async nowByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherbitCurrentResponse> {
    const apiUrl = this.makeUrl(WeatherbitContext.CURRENT);

    try {
      const response = await this.httpService
        .get<WeatherbitCurrentResponse>(apiUrl, {
          params: {
            lon: longitude,
            lat: latitude,
          },
        })
        .toPromise();

      const { status, statusText, data } = response;

      // TODO 필요 시 WeatherbitException 을 생성합니다.

      this.logger.debug(
        `status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(
          data,
        )}`,
      );

      return data;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof WeatherbitException) {
        throw e;
      }
      throw new Error('UnhandledError');
    }
  }

  /**
   * 도시명으로 현재 날씨를 조회합니다.
   * https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
   * Current milliseconds
   * @param city
   * @param state
   * @param country
   */
  async nowByCityName(
    city: string,
    state?: string,
    country?: string,
  ): Promise<WeatherbitCurrentResponse> {
    const apiUrl = this.makeUrl(WeatherbitContext.CURRENT);

    // TODO state, country 처리
    try {
      const response = await this.httpService
        .get<WeatherbitCurrentResponse>(apiUrl, {
          params: {
            city: city,
          },
        })
        .toPromise();

      const { status, statusText, data } = response;

      // TODO 필요 시 WeatherbitException 을 생성합니다.

      this.logger.debug(
        `status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(
          data,
        )}`,
      );

      return data;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof WeatherbitException) {
        throw e;
      }
      throw new Error('UnhandledError');
    }
  }

  /**
   * 우편번호로로 현재 날씨를 조회합니다.
   * https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
   * Current milliseconds
   * @param postalCode
   * @param country
   */
  async nowByPostalCode(
    postalCode: string,
    country?: string,
  ): Promise<WeatherbitCurrentResponse> {
    const apiUrl = this.makeUrl(WeatherbitContext.CURRENT);

    // TODO country 처리
    try {
      const response = await this.httpService
        .get<WeatherbitCurrentResponse>(apiUrl, {
          params: {
            postal_code: postalCode,
          },
        })
        .toPromise();

      const { status, statusText, data } = response;

      // TODO 필요 시 WeatherbitException 을 생성합니다.

      this.logger.debug(
        `status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(
          data,
        )}`,
      );

      return data;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof WeatherbitException) {
        throw e;
      }
      throw new Error('UnhandledError');
    }
  }

  /**
   * 우편번호로로 현재 날씨를 조회합니다.
   * https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
   * Current milliseconds
   * @param cities
   */
  async nowByCities(cities: string[]): Promise<WeatherbitCurrentResponse> {
    const apiUrl = this.makeUrl(WeatherbitContext.CURRENT);

    // TODO cities 처리
    try {
      const response = await this.httpService
        .get<WeatherbitCurrentResponse>(apiUrl, {
          params: {
            cities: cities.join(','),
          },
        })
        .toPromise();

      const { status, statusText, data } = response;

      // TODO 필요 시 WeatherbitException 을 생성합니다.

      this.logger.debug(
        `status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(
          data,
        )}`,
      );

      return data;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof WeatherbitException) {
        throw e;
      }
      throw new Error('UnhandledError');
    }
  }
}
