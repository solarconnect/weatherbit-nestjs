import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { WEATHERBIT_MODULE_CONFIG } from './constants';
import { WeatherbitLanguage, WeatherbitUnit } from './weatherbit.interface';
import { WeatherbitService } from './weatherbit.service';

/**
 * Weatherbit module option
 */
export interface WeatherbitModuleConfig {
  /**
   * api key
   * required
   */
  apiKey: string;

  /**
   * https 사용할거예용?
   * optional. false as default
   */
  useHttps?: boolean;

  /**
   * language
   * optional. 'en' as default
   */
  lang?: WeatherbitLanguage;

  /**
   * unit
   * optional. 'M' as default
   */
  unit?: WeatherbitUnit;
}

/**
 * Weatherbit module option
 */
export interface WeatherbitModuleAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Function returning options (or a Promise resolving to options) to configure the Weatherbit module.
   * @param args
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<WeatherbitModuleConfig> | WeatherbitModuleConfig;
  /**
   * Dependencies that a Factory may inject.
   */
  inject?: any[];
}

/**
 * Weatherbit NestJS Module
 */
@Module({})
export class WeatherbitModule {
  /**
   *
   * @param config
   */
  static register(config: WeatherbitModuleConfig): DynamicModule {
    return {
      module: WeatherbitModule,
      imports: [HttpModule],
      providers: [
        {
          provide: WEATHERBIT_MODULE_CONFIG,
          useValue: config,
        },
        WeatherbitService,
      ],
      exports: [WeatherbitService],
    };
  }

  /**
   *
   * @param options
   */
  static registerAsync({
    useFactory,
    imports,
    inject,
  }: WeatherbitModuleAsyncConfig): DynamicModule {
    return {
      module: WeatherbitModule,
      imports: [HttpModule, ...imports],
      providers: [
        {
          provide: WEATHERBIT_MODULE_CONFIG,
          useFactory,
          inject,
        },
        WeatherbitService,
      ],
      exports: [WeatherbitService],
    };
  }
}
