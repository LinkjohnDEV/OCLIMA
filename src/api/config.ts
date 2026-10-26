export const API_CONFIG = {
  // 1º Provedor (Principal): WeatherAPI.com
  WEATHERAPI: {
    BASE_URL: import.meta.env.VITE_WEATHERAPI_BASE_URL || "https://api.weatherapi.com/v1",
    API_KEY: import.meta.env.VITE_WEATHERAPI_KEY || "",
  },

  // 2º Provedor (Failover 1): OpenWeatherMap
  OPENWEATHER: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://api.openweathermap.org/data/2.5",
    GEO_URL: import.meta.env.VITE_API_GEO_URL || "https://api.openweathermap.org/geo/1.0",
    API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || "",
    UNITS: import.meta.env.VITE_API_UNITS || "metric",
  },

  // 3º Provedor (Failover 2): Open-Meteo & Intelligent Mock
  OPENMETEO: {
    BASE_URL: "https://api.open-meteo.com/v1",
  },
};
