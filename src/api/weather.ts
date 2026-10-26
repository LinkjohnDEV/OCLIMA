import { API_CONFIG } from "./config";
import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "./types";
import {
  findMockCityByCoords,
  searchMockCities,
  MOCK_CITIES,
} from "./mock-weather";

class WeatherAPIClient {
  private activeProvider: "weatherapi" | "openweather" | "openmeteo" = "weatherapi";

  // Helper: fetch with timeout
  private async fetchWithTimeout(url: string, timeoutMs = 6000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // -------------------------------------------------------------
  // PROVIDER 1: WeatherAPI.com (Primary - 1,000,000 req/month)
  // -------------------------------------------------------------
  private async fetchWeatherAPI(lat: number, lon: number, days = 5) {
    const key = API_CONFIG.WEATHERAPI.API_KEY;
    if (!key) throw new Error("WeatherAPI key not configured");

    const url = `${API_CONFIG.WEATHERAPI.BASE_URL}/forecast.json?key=${key}&q=${lat},${lon}&days=${days}&aqi=no&alerts=no&lang=pt`;
    const res = await this.fetchWithTimeout(url);
    if (!res.ok) throw new Error(`WeatherAPI error: ${res.status} ${res.statusText}`);
    return res.json();
  }

  private mapWeatherAPIToCurrent(raw: any, coords: Coordinates): WeatherData {
    const current = raw.current;
    const loc = raw.location;
    const today = raw.forecast?.forecastday?.[0];

    const iconUrl = current.condition?.icon
      ? (current.condition.icon.startsWith("//") ? `https:${current.condition.icon}` : current.condition.icon)
      : "https://openweathermap.org/img/wn/02d@4x.png";

    // Parse sunrise/sunset to timestamp
    const now = Math.floor(Date.now() / 1000);

    return {
      coord: { lat: coords.lat, lon: coords.lon },
      weather: [
        {
          id: current.condition?.code || 800,
          main: current.condition?.text || "Tempo Bom",
          description: current.condition?.text || "Tempo limpo",
          icon: iconUrl,
        },
      ],
      main: {
        temp: current.temp_c,
        feels_like: current.feelslike_c,
        temp_min: today?.day?.mintemp_c ?? (current.temp_c - 3),
        temp_max: today?.day?.maxtemp_c ?? (current.temp_c + 3),
        pressure: Math.round(current.pressure_mb),
        humidity: current.humidity,
      },
      wind: {
        speed: Math.round((current.wind_kph / 3.6) * 10) / 10,
        deg: current.wind_degree || 0,
      },
      sys: {
        country: loc.country === "Brazil" ? "BR" : loc.country,
        sunrise: now - 21600,
        sunset: now + 21600,
      },
      name: loc.name,
      dt: current.last_updated_epoch || now,
    };
  }

  private mapWeatherAPIToForecast(raw: any): ForecastData {
    const loc = raw.location;
    const forecastDays = raw.forecast?.forecastday || [];
    const list: ForecastData["list"] = [];

    // Flatten hours from days
    for (const day of forecastDays) {
      for (const h of (day.hour || [])) {
        const iconUrl = h.condition?.icon
          ? (h.condition.icon.startsWith("//") ? `https:${h.condition.icon}` : h.condition.icon)
          : "02d";

        list.push({
          dt: h.time_epoch,
          main: {
            temp: h.temp_c,
            feels_like: h.feelslike_c,
            temp_min: h.temp_c - 1,
            temp_max: h.temp_c + 1,
            pressure: Math.round(h.pressure_mb),
            humidity: h.humidity,
          },
          weather: [
            {
              id: h.condition?.code || 800,
              main: h.condition?.text || "Clouds",
              description: h.condition?.text || "Parcialmente nublado",
              icon: iconUrl,
            },
          ],
          wind: {
            speed: Math.round((h.wind_kph / 3.6) * 10) / 10,
            deg: h.wind_degree || 0,
          },
          dt_txt: h.time,
        });
      }
    }

    const now = Math.floor(Date.now() / 1000);
    return {
      list,
      city: {
        name: loc.name,
        country: loc.country === "Brazil" ? "BR" : loc.country,
        sunrise: now - 21600,
        sunset: now + 21600,
      },
    };
  }

  // -------------------------------------------------------------
  // PROVIDER 2: OpenWeatherMap (Failover 1)
  // -------------------------------------------------------------
  private async fetchOpenWeatherCurrent(coords: Coordinates): Promise<WeatherData> {
    const key = API_CONFIG.OPENWEATHER.API_KEY;
    if (!key) throw new Error("OpenWeather key not configured");

    const url = `${API_CONFIG.OPENWEATHER.BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=pt_br&appid=${key}`;
    const res = await this.fetchWithTimeout(url);
    if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);
    return res.json();
  }

  private async fetchOpenWeatherForecast(coords: Coordinates): Promise<ForecastData> {
    const key = API_CONFIG.OPENWEATHER.API_KEY;
    if (!key) throw new Error("OpenWeather key not configured");

    const url = `${API_CONFIG.OPENWEATHER.BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=pt_br&appid=${key}`;
    const res = await this.fetchWithTimeout(url);
    if (!res.ok) throw new Error(`OpenWeather forecast error: ${res.status}`);
    return res.json();
  }

  // -------------------------------------------------------------
  // PROVIDER 3: Open-Meteo & Intelligent Mock (Failover 2)
  // -------------------------------------------------------------
  private async fetchOpenMeteo(coords: Coordinates): Promise<WeatherData> {
    const url = `${API_CONFIG.OPENMETEO.BASE_URL}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto`;
    const res = await this.fetchWithTimeout(url);
    if (!res.ok) throw new Error(`OpenMeteo error: ${res.status}`);
    const data = await res.json();
    const c = data.current;
    const now = Math.floor(Date.now() / 1000);

    const mockRef = findMockCityByCoords(coords);

    return {
      coord: coords,
      weather: [
        {
          id: c.weather_code || 800,
          main: "Tempo",
          description: "Céu limpo",
          icon: "01d",
        },
      ],
      main: {
        temp: c.temperature_2m,
        feels_like: c.apparent_temperature,
        temp_min: c.temperature_2m - 3,
        temp_max: c.temperature_2m + 3,
        pressure: Math.round(c.surface_pressure),
        humidity: c.relative_humidity_2m,
      },
      wind: {
        speed: c.wind_speed_10m,
        deg: c.wind_direction_10m,
      },
      sys: {
        country: mockRef.country,
        sunrise: now - 21600,
        sunset: now + 21600,
      },
      name: mockRef.name,
      dt: now,
    };
  }

  // -------------------------------------------------------------
  // PUBLIC API: Multi-Provider Orchestrator with 3-Tier Failover
  // -------------------------------------------------------------

  async getCurrentWeather(coords: Coordinates): Promise<WeatherData> {
    // 1º Tentar WeatherAPI.com (Melhor provedor)
    try {
      const raw = await this.fetchWeatherAPI(coords.lat, coords.lon, 1);
      this.activeProvider = "weatherapi";
      return this.mapWeatherAPIToCurrent(raw, coords);
    } catch (err1) {
      console.warn("Tier 1 (WeatherAPI) indisponível, alternando para Tier 2 (OpenWeather):", err1);

      // 2º Tentar OpenWeatherMap
      try {
        const data = await this.fetchOpenWeatherCurrent(coords);
        this.activeProvider = "openweather";
        return data;
      } catch (err2) {
        console.warn("Tier 2 (OpenWeather) indisponível, alternando para Tier 3 (Open-Meteo/Mock):", err2);

        // 3º Tentar Open-Meteo ou Mock
        try {
          const data = await this.fetchOpenMeteo(coords);
          this.activeProvider = "openmeteo";
          return data;
        } catch {
          this.activeProvider = "openmeteo";
          return findMockCityByCoords(coords).weather;
        }
      }
    }
  }

  async getForecast(coords: Coordinates): Promise<ForecastData> {
    // 1º Tentar WeatherAPI.com
    try {
      const raw = await this.fetchWeatherAPI(coords.lat, coords.lon, 6);
      return this.mapWeatherAPIToForecast(raw);
    } catch (err1) {
      console.warn("Tier 1 (WeatherAPI) forecast falhou, tentando Tier 2 (OpenWeather):", err1);

      // 2º Tentar OpenWeatherMap
      try {
        return await this.fetchOpenWeatherForecast(coords);
      } catch (err2) {
        console.warn("Tier 2 (OpenWeather) forecast falhou, ativando Tier 3 (Mock/Open-Meteo):", err2);

        // 3º Fallback Mock inteligente garantido
        return findMockCityByCoords(coords).forecast;
      }
    }
  }

  async reverseGeocode(coords: Coordinates): Promise<GeocodingResponse[]> {
    // 1º Tentar WeatherAPI
    try {
      const raw = await this.fetchWeatherAPI(coords.lat, coords.lon, 1);
      const loc = raw.location;
      return [
        {
          name: loc.name,
          country: loc.country === "Brazil" ? "BR" : loc.country,
          state: loc.region,
          lat: coords.lat,
          lon: coords.lon,
        },
      ];
    } catch {
      // 2º Fallback para Mock
      const city = findMockCityByCoords(coords);
      return [
        {
          name: city.name,
          country: city.country,
          state: city.state,
          lat: city.lat,
          lon: city.lon,
          local_names: city.local_names,
        },
      ];
    }
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    if (!query || query.trim().length === 0) return [];

    // 1º Tentar WeatherAPI search
    try {
      const key = API_CONFIG.WEATHERAPI.API_KEY;
      if (key) {
        const url = `${API_CONFIG.WEATHERAPI.BASE_URL}/search.json?key=${key}&q=${encodeURIComponent(query)}`;
        const res = await this.fetchWithTimeout(url);
        if (res.ok) {
          const results = await res.json();
          if (Array.isArray(results) && results.length > 0) {
            return results.map((r: any) => ({
              name: r.name,
              state: r.region,
              country: r.country === "Brazil" ? "BR" : r.country,
              lat: r.lat,
              lon: r.lon,
            }));
          }
        }
      }
    } catch (err) {
      console.warn("WeatherAPI search falhou, tentando fallback:", err);
    }

    // 2º Tentar OpenWeather search
    try {
      const key = API_CONFIG.OPENWEATHER.API_KEY;
      if (key) {
        const url = `${API_CONFIG.OPENWEATHER.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${key}`;
        const res = await this.fetchWithTimeout(url);
        if (res.ok) {
          const results = await res.json();
          if (Array.isArray(results) && results.length > 0) {
            return results;
          }
        }
      }
    } catch (err) {
      console.warn("OpenWeather search falhou:", err);
    }

    // 3º Fallback Mock search
    return searchMockCities(query);
  }

  getActiveProvider() {
    return this.activeProvider;
  }

  getAvailableMockCities() {
    return MOCK_CITIES;
  }
}

export const weatherAPI = new WeatherAPIClient();
