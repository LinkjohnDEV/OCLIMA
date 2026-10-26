import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "./types";

export const MOCK_CITIES: Array<GeocodingResponse & { weather: WeatherData; forecast: ForecastData }> = [
  {
    name: "São Paulo",
    country: "BR",
    state: "São Paulo",
    lat: -23.5505,
    lon: -46.6333,
    local_names: { pt: "São Paulo", en: "Sao Paulo" },
    weather: createMockWeather("São Paulo", "BR", -23.5505, -46.6333, 24, "Parcialmente nublado", "03d", 68, 4.2),
    forecast: createMockForecast("São Paulo", "BR", 24),
  },
  {
    name: "Rio de Janeiro",
    country: "BR",
    state: "Rio de Janeiro",
    lat: -22.9068,
    lon: -43.1729,
    local_names: { pt: "Rio de Janeiro", en: "Rio de Janeiro" },
    weather: createMockWeather("Rio de Janeiro", "BR", -22.9068, -43.1729, 29, "Ensolarado", "01d", 62, 5.1),
    forecast: createMockForecast("Rio de Janeiro", "BR", 29),
  },
  {
    name: "Curitiba",
    country: "BR",
    state: "Paraná",
    lat: -25.4284,
    lon: -49.2733,
    local_names: { pt: "Curitiba", en: "Curitiba" },
    weather: createMockWeather("Curitiba", "BR", -25.4284, -49.2733, 18, "Chuva leve", "10d", 84, 3.8),
    forecast: createMockForecast("Curitiba", "BR", 18),
  },
  {
    name: "Brasília",
    country: "BR",
    state: "Distrito Federal",
    lat: -15.7975,
    lon: -47.8919,
    local_names: { pt: "Brasília", en: "Brasilia" },
    weather: createMockWeather("Brasília", "BR", -15.7975, -47.8919, 26, "Poucas nuvens", "02d", 55, 3.5),
    forecast: createMockForecast("Brasília", "BR", 26),
  },
  {
    name: "Salvador",
    country: "BR",
    state: "Bahia",
    lat: -12.9777,
    lon: -38.5016,
    local_names: { pt: "Salvador", en: "Salvador" },
    weather: createMockWeather("Salvador", "BR", -12.9777, -38.5016, 28, "Céu limpo", "01d", 70, 6.2),
    forecast: createMockForecast("Salvador", "BR", 28),
  },
  {
    name: "Lisboa",
    country: "PT",
    state: "Lisboa",
    lat: 38.7223,
    lon: -9.1393,
    local_names: { pt: "Lisboa", en: "Lisbon" },
    weather: createMockWeather("Lisboa", "PT", 38.7223, -9.1393, 21, "Ensolarado", "01d", 58, 4.0),
    forecast: createMockForecast("Lisboa", "PT", 21),
  },
  {
    name: "Nova York",
    country: "US",
    state: "New York",
    lat: 40.7128,
    lon: -74.006,
    local_names: { pt: "Nova York", en: "New York" },
    weather: createMockWeather("Nova York", "US", 40.7128, -74.006, 16, "Nuvens dispersas", "03d", 52, 4.8),
    forecast: createMockForecast("Nova York", "US", 16),
  },
  {
    name: "Londres",
    country: "GB",
    state: "England",
    lat: 51.5074,
    lon: -0.1278,
    local_names: { pt: "Londres", en: "London" },
    weather: createMockWeather("Londres", "GB", 51.5074, -0.1278, 14, "Garoa", "09d", 78, 4.5),
    forecast: createMockForecast("Londres", "GB", 14),
  },
  {
    name: "Tóquio",
    country: "JP",
    state: "Tokyo",
    lat: 35.6762,
    lon: 139.6503,
    local_names: { pt: "Tóquio", en: "Tokyo" },
    weather: createMockWeather("Tóquio", "JP", 35.6762, 139.6503, 19, "Céu limpo", "01n", 60, 2.9),
    forecast: createMockForecast("Tóquio", "JP", 19),
  },
];

function createMockWeather(
  name: string,
  country: string,
  lat: number,
  lon: number,
  baseTemp: number,
  description: string,
  icon: string,
  humidity: number,
  windSpeed: number
): WeatherData {
  const now = Math.floor(Date.now() / 1000);
  return {
    coord: { lat, lon },
    weather: [
      {
        id: 800,
        main: "Clouds",
        description,
        icon,
      },
    ],
    main: {
      temp: baseTemp,
      feels_like: baseTemp + 1,
      temp_min: baseTemp - 3,
      temp_max: baseTemp + 4,
      pressure: 1015,
      humidity,
    },
    wind: {
      speed: windSpeed,
      deg: 140,
    },
    sys: {
      country,
      sunrise: now - 21600,
      sunset: now + 21600,
    },
    name,
    dt: now,
  };
}

function createMockForecast(name: string, country: string, baseTemp: number): ForecastData {
  const now = Math.floor(Date.now() / 1000);
  const list: ForecastData["list"] = [];

  const weatherVariations = [
    { desc: "Ensolarado", icon: "01d", diff: 2 },
    { desc: "Parcialmente nublado", icon: "02d", diff: 1 },
    { desc: "Nuvens dispersas", icon: "03d", diff: 0 },
    { desc: "Chuva fraca", icon: "10d", diff: -2 },
    { desc: "Tempo limpo", icon: "01d", diff: 3 },
    { desc: "Poucas nuvens", icon: "02d", diff: 1 },
    { desc: "Encoberto", icon: "04d", diff: -1 },
    { desc: "Céu claro", icon: "01n", diff: -3 },
  ];

  // 40 entries (5 days, every 3 hours)
  for (let i = 0; i < 40; i++) {
    const time = now + i * 3 * 3600;
    const hour = new Date(time * 1000).getHours();
    const isNight = hour < 6 || hour > 18;
    const variation = weatherVariations[i % weatherVariations.length];
    const tempOffset = isNight ? -4 : (hour === 14 ? 3 : 0);
    const temp = baseTemp + variation.diff + tempOffset;

    list.push({
      dt: time,
      main: {
        temp: Math.round(temp * 10) / 10,
        feels_like: Math.round((temp + (isNight ? -1 : 1)) * 10) / 10,
        temp_min: Math.round((temp - 2) * 10) / 10,
        temp_max: Math.round((temp + 2) * 10) / 10,
        pressure: 1013 + (i % 5),
        humidity: isNight ? 75 : 55 + (i % 20),
      },
      weather: [
        {
          id: 800 + (i % 4),
          main: isNight ? "Clear" : "Clouds",
          description: variation.desc,
          icon: isNight ? variation.icon.replace("d", "n") : variation.icon,
        },
      ],
      wind: {
        speed: Math.round((3 + (i % 4) * 0.8) * 10) / 10,
        deg: (120 + i * 15) % 360,
      },
      dt_txt: new Date(time * 1000).toISOString().replace("T", " ").substring(0, 19),
    });
  }

  return {
    list,
    city: {
      name,
      country,
      sunrise: now - 21600,
      sunset: now + 21600,
    },
  };
}

export function findMockCityByCoords(coords: Coordinates) {
  let closest = MOCK_CITIES[0];
  let minDistance = Number.MAX_VALUE;

  for (const city of MOCK_CITIES) {
    const dist = Math.hypot(city.lat - coords.lat, city.lon - coords.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  // If reasonably close or default fallback
  return closest;
}

export function searchMockCities(query: string): GeocodingResponse[] {
  const q = query.toLowerCase().trim();
  return MOCK_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.state && c.state.toLowerCase().includes(q)) ||
      c.country.toLowerCase().includes(q) ||
      (c.local_names?.pt && c.local_names.pt.toLowerCase().includes(q)) ||
      (c.local_names?.en && c.local_names.en.toLowerCase().includes(q))
  ).map((c) => ({
    name: c.name,
    country: c.country,
    state: c.state,
    lat: c.lat,
    lon: c.lon,
    local_names: c.local_names,
  }));
}
