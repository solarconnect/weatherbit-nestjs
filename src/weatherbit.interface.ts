/**
 * Weatherbit 의 서비스 컨텍스트
 *
 */
export enum WeatherbitContext {
  // 현재날씨
  CURRENT = 'current',
}

/**
 *
 */
export const WeatherbitCodes: {
  [code: number]: {
    description: string;
    icons: string[];
  };
} = {
  200: {
    description: 'Thunderstorm with light rain',
    icons: ['t01d', 't01n'],
  },
  201: {
    description: 'Thunderstorm with rain',
    icons: ['t02d', 't02n'],
  },
  202: {
    description: 'Thunderstorm with heavy rain',
    icons: ['t03d', 't03n'],
  },
  230: {
    description: 'Thunderstorm with light drizzle',
    icons: ['t04d', 't04n'],
  },
  231: {
    description: 'Thunderstorm with drizzle',
    icons: ['t04d', 't04n'],
  },
  232: {
    description: 'Thunderstorm with heavy drizzle',
    icons: ['t04d', 't04n'],
  },
  233: {
    description: 'Thunderstorm with Hail',
    icons: ['t05d', 't05n'],
  },
  300: {
    description: 'Light Drizzle',
    icons: ['d01d', 'd01n'],
  },
  301: {
    description: 'Drizzle',
    icons: ['d02d', 'd02n'],
  },
  302: {
    description: 'Heavy Drizzle',
    icons: ['d03d', 'd03n'],
  },
  500: {
    description: 'Light Rain',
    icons: ['r01d', 'r01n'],
  },
  501: {
    description: 'Moderate Rain',
    icons: ['r02d', 'r02n'],
  },
  502: {
    description: 'Heavy Rain',
    icons: ['r03d', 'r03n'],
  },
  511: {
    description: 'Freezing rain',
    icons: ['f01d', 'f01n'],
  },
  520: {
    description: 'Light shower rain',
    icons: ['r04d', 'r04n'],
  },
  521: {
    description: 'Shower rain',
    icons: ['r05d', 'r05n'],
  },
  522: {
    description: 'Heavy shower rain',
    icons: ['r06d', 'r06n'],
  },
  600: {
    description: 'Light snow',
    icons: ['s01d', 's01n'],
  },
  601: {
    description: 'Snow',
    icons: ['s02d', 's02n'],
  },
  602: {
    description: 'Heavy Snow',
    icons: ['s03d', 's03n'],
  },
  610: {
    description: 'Mix snow/rain',
    icons: ['s04d', 's04n'],
  },
  611: {
    description: 'Sleet',
    icons: ['s05d', 's05n'],
  },
  612: {
    description: 'Heavy sleet',
    icons: ['s05d', 's05n'],
  },
  621: {
    description: 'Snow shower',
    icons: ['s01d', 's01n'],
  },
  622: {
    description: 'Heavy snow shower',
    icons: ['s02d', 's02n'],
  },
  623: {
    description: 'Flurries',
    icons: ['s06d', 's06n'],
  },
  700: {
    description: 'Mist',
    icons: ['a01d', 'a01n'],
  },
  711: {
    description: 'Smoke',
    icons: ['a02d', 'a02n'],
  },
  721: {
    description: 'Haze',
    icons: ['a03d', 'a03n'],
  },
  731: {
    description: 'Sand/dust',
    icons: ['a04d', 'a04n'],
  },
  741: {
    description: 'Fog',
    icons: ['a05d', 'a05n'],
  },
  751: {
    description: 'Freezing Fog',
    icons: ['a06d', 'a06n'],
  },
  800: {
    description: 'Clear sky',
    icons: ['c01d', 'c01n'],
  },
  801: {
    description: 'Few clouds',
    icons: ['c02d', 'c02n'],
  },
  802: {
    description: 'Scattered clouds',
    icons: ['c02d', 'c02n'],
  },
  803: {
    description: 'Broken clouds',
    icons: ['c03d', 'c03n'],
  },
  804: {
    description: 'Overcast clouds',
    icons: ['c04d', 'c04n'],
  },
};

/**
 * Weatherbit 의 현재날씨 response structure
 */
export interface WeatherbitCurrentResponse {
  count: number;
  data: WeatherbitCurrentData[];
}

/**
 * Weatherbit 의 현재날씨 structure
 */
export interface WeatherbitCurrentWeather {
  icon: string;
  code: number;
  description: string;
}

/**
 *
 */
export enum WeatherbitPartOfDay {
  // 주간
  DAY = 'd',

  // 야간
  NIGHT = 'n',
}

/**
 *
 */
export interface WeatherbitCurrentData {
  lon: string; // Latitude (Degrees).
  lat: string; // Longitude (Degrees).
  sunrise: string; // Sunrise time (HH:MM).
  sunset: string; // Sunset time (HH:MM).
  timezone: string; // Local IANA Timezone.
  station: string; // Source station ID.
  ob_time: string; // Last observation time (YYYY-MM-DD HH:MM).
  datetime: string; // Current cycle hour (YYYY-MM-DD:HH).
  ts: number; // Last observation time (Unix timestamp).
  city_name: string; // City name.
  country_code: string; // Country abbreviation.
  state_code: string; // State abbreviation/code.
  pres: number; // Pressure (mb).
  slp: number; // Sea level pressure (mb).
  wind_spd: number; // Wind speed (Default m/s).
  wind_dir: number; // Wind direction (degrees).
  wind_cdir: string; // Abbreviated wind direction.
  wind_cdir_full: string; // Verbal wind direction.
  temp: number; // Temperature (default Celcius).
  app_temp: number; // Apparent/"Feels Like" temperature (default Celcius).
  rh: number; // Relative humidity (%).
  dewpt: number; // Dew point (default Celcius).
  clouds: number; // Cloud coverage (%).
  pod: WeatherbitPartOfDay; // Part of the day (d = day / n = night).
  weather: WeatherbitCurrentWeather; // 날씨
  vis: number; // Visibility (default KM).
  precip: number; // Liquid equivalent precipitation rate (default mm/hr).
  snow: string; // Snowfall (default mm/hr).
  uv: number; // UV Index (0-11+).
  aqi: number; // Air Quality Index [US - EPA standard 0 - +500]
  dhi: number; // Diffuse horizontal solar irradiance (W/m^2) [Clear Sky]
  dni: number; // Direct normal solar irradiance (W/m^2) [Clear Sky]
  ghi: number; // Global horizontal solar irradiance (W/m^2) [Clear Sky]
  solar_rad: number; // Estimated Solar Radiation (W/m^2).
  elev_angle: number; // Solar elevation angle (degrees).
  h_angle: number; // Solar hour angle (degrees).
}

/**
 *
 */
export enum WeatherbitLanguage {
  'en' = 'en', // en - [DEFAULT] English
  'ar' = 'ar', // ar - Arabic
  'az' = 'az', // az - Azerbaijani
  'be' = 'be', // be - Belarusian
  'bg' = 'bg', // bg - Bulgarian
  'bs' = 'bs', // bs - Bosnian
  'ca' = 'ca', // ca - Catalan
  'cz' = 'cz', // cz - Czech
  'da' = 'da', // da - Danish
  'de' = 'de', // de - German
  'fi' = 'fi', // fi - Finnish
  'fr' = 'fr', // fr - French
  'el' = 'el', // el - Greek
  'es' = 'es', // es - Spanish
  'et' = 'et', // et - Estonian
  'ja' = 'ja', // ja - Japanese
  'hr' = 'hr', // hr - Croation
  'hu' = 'hu', // hu - Hungarian
  'id' = 'id', // id - Indonesian
  'it' = 'it', // it - Italian
  'is' = 'is', // is - Icelandic
  'iw' = 'iw', // iw - Hebrew
  'kw' = 'kw', // kw - Cornish
  'lt' = 'lt', // lt - Lithuanian
  'nb' = 'nb', // nb - Norwegian Bokmål
  'nl' = 'nl', // nl - Dutch
  'pl' = 'pl', // pl - Polish
  'pt' = 'pt', // pt - Portuguese
  'ro' = 'ro', // ro - Romanian
  'ru' = 'ru', // ru - Russian
  'sk' = 'sk', // sk - Slovak
  'sl' = 'sl', // sl - Slovenian
  'sr' = 'sr', // sr - Serbian
  'sv' = 'sv', // sv - Swedish
  'tr' = 'tr', // tr - Turkish
  'uk' = 'uk', // uk - Ukrainian
  'zh' = 'zh', // zh - Chinese (Simplified)
  'zh-tw' = 'zh-tw', // zh-tw - Chinese (Traditional)
}

/**
 *
 */
export enum WeatherbitUnit {
  Metric = 'M',
  Scientific = 'S',
  Fahrenheit = 'I',
}

/**
 *
 */
export abstract class WeatherbitException extends Error {}
