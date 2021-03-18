import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { WEATHERBIT_MODULE_CONFIG } from './constants';
import {
  EmptyResultException,
  WeatherbitContext,
  WeatherbitCurrentDataForSC,
  WeatherbitCurrentResponse,
  WeatherbitException,
  WeatherbitForecastDataForSC,
  WeatherbitForecastResponse,
  WeatherbitLanguage,
  WeatherbitUnit,
} from './weatherbit.interface';
import { WeatherbitModuleConfig } from './weatherbit.module';

// TODO fixme
dayjs.extend(utc);
dayjs.extend(timezone);

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
    { apiKey, useHttps = false, lang = WeatherbitLanguage.en, unit = WeatherbitUnit.Metric }: WeatherbitModuleConfig,
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
   * 문서에서 찾을 수 없었지만, timezone 항목이 UTC 가 아니어도 응답에 포함되어있는 날짜, 시간 값은 항상 UTC 로 추정됩니다.
   * https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
   * Current milliseconds
   * @param latitude
   * @param longitude
   */
  async nowByCoordinates(latitude: number, longitude: number): Promise<WeatherbitCurrentResponse> {
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

      this.logger.debug(`status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(data)}`);

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
   * 좌표로 현재 날씨를 조회합니다. (SAEM 에서 현재 날씨 조회를 목적으로 사용합니다.)
   *
   * @param latitude
   * @param longitude
   */
  async nowByCoordinatesForSC(latitude: number, longitude: number): Promise<WeatherbitCurrentDataForSC> {
    try {
      const response = await this.nowByCoordinates(latitude, longitude);

      if (response.count < 0) {
        throw new EmptyResultException();
      }

      const data = response.data[0];

      const now = dayjs().tz('Asia/Seoul');

      const datetime = dayjs.utc(data.datetime, 'YYYY-MM-DD HH');
      const _sunrise = dayjs.tz(dayjs.utc(`${datetime.format('YYYY-MM-DD')} ${data.sunrise}`), 'Asia/Seoul');
      const _sunset = dayjs.tz(dayjs.utc(`${datetime.format('YYYY-MM-DD')} ${data.sunset}`), 'Asia/Seoul');

      const sunrise = now.set('hour', _sunrise.hour()).set('minutes', _sunrise.minute());
      const sunset = now.set('hour', _sunset.hour()).set('minutes', _sunset.minute());

      // icon 이 주간/야간 여부에 상관없이 조회되는 경우가 있어서 이를 보정합니다.
      let icon: string;
      if (now.isAfter(sunrise) && now.isBefore(sunset)) {
        // 주간
        icon = data.weather.icon.replace(/n/gi, 'd');
      } else {
        // 야간
        icon = data.weather.icon.replace(/d/gi, 'n');
      }

      return {
        original: response,
        sc: {
          weather: {
            icon,
            code: data.weather.code,
            description: data.weather.description,
          },
          sunrise: sunrise.format(),
          sunset: sunset.format(),
          temperature: data.temp,
        },
      };
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
  async nowByCityName(city: string, state?: string, country?: string): Promise<WeatherbitCurrentResponse> {
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

      this.logger.debug(`status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(data)}`);

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
  async nowByPostalCode(postalCode: string, country?: string): Promise<WeatherbitCurrentResponse> {
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

      this.logger.debug(`status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(data)}`);

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

      this.logger.debug(`status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(data)}`);

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
   * 좌표로 날씨예보를 조회합니다.
   * days 값 설정에 따라 최대 16일 까지의 예보 데이터를 조회할 수 있습니다.
   *
   * @param latitude
   * @param longitude
   * @param days
   */
  async forecastDailyByCoordinates(
    latitude: number,
    longitude: number,
    days: number,
  ): Promise<WeatherbitForecastResponse> {
    const apiUrl = this.makeUrl(WeatherbitContext.FORECAST_DAILY);

    try {
      const response = await this.httpService
        .get<WeatherbitForecastResponse>(apiUrl, {
          params: {
            lon: longitude,
            lat: latitude,
            days,
          },
        })
        .toPromise();

      const { status, statusText, data } = response;

      // TODO 필요 시 WeatherbitException 을 생성합니다.

      this.logger.debug(`status: ${status}, statusText: ${statusText}, data: ${JSON.stringify(data)}`);

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
   * 좌표로 오늘 날씨예보를 조회합니다. (SAEM 에서 최저/최대 기온 조회 목적)
   *
   * @param latitude
   * @param longitude
   */
  async forecastDailyByCoordinatesForSC(latitude: number, longitude: number): Promise<WeatherbitForecastDataForSC> {
    try {
      const response = await this.forecastDailyByCoordinates(latitude, longitude, 1);

      if (!(Array.isArray(response.data) && response.data.length > 0)) {
        throw new EmptyResultException();
      }

      const data = response.data[0];

      const { valid_date, min_temp, max_temp } = data;
      return {
        original: response,
        sc: {
          date: valid_date,
          minimumTemperature: min_temp,
          maximumTemperature: max_temp,
        },
      };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof WeatherbitException) {
        throw e;
      }
      throw new Error('UnhandledError');
    }
  }
}
