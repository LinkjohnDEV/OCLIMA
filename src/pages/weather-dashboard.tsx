import { useState } from "react";
import { FavoriteCities } from "@/components/favorite-cities";
import { SeoHelmet } from "@/components/seo-helmet";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import {
  AlertTriangle,
  MapPin,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import type { Coordinates } from "@/api/types";

const POPULAR_CITIES = [
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
  { name: "Brasília", lat: -15.7975, lon: -47.8919 },
  { name: "Curitiba", lat: -25.4284, lon: -49.2733 },
  { name: "Salvador", lat: -12.9777, lon: -38.5016 },
  { name: "Lisboa", lat: 38.7223, lon: -9.1393 },
];

export function WeatherDashboard() {
  const {
    coordinates: geoCoordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  // Custom selected coordinate override when user picks a quick city
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(null);

  // Default fallback if geolocation is unavailable or denied
  const defaultCoords: Coordinates = { lat: -23.5505, lon: -46.6333 }; // São Paulo

  const effectiveCoordinates = selectedCoords || geoCoordinates || defaultCoords;
  const isUsingDefault = !geoCoordinates && !selectedCoords;

  const weatherQuery = useWeatherQuery(effectiveCoordinates);
  const forecastQuery = useForecastQuery(effectiveCoordinates);
  const locationQuery = useReverseGeocodeQuery(effectiveCoordinates);

  const handleRefresh = () => {
    weatherQuery.refetch();
    forecastQuery.refetch();
    locationQuery.refetch();
  };

  const cityName = locationQuery.data?.[0]?.name || weatherQuery.data?.name || "Localização";
  const seoTitle = `${cityName} - Previsão do Tempo | OCLIMA`;
  const seoDescription = weatherQuery.data
    ? `Clima atual em ${cityName}: ${Math.round(
        weatherQuery.data.main.temp
      )}°C, ${
        weatherQuery.data.weather[0].description
      }. Veja previsão em tempo real, temperaturas por hora e próximos dias no OCLIMA.`
    : "Acompanhe previsões meteorológicas em tempo real, temperaturas hora a hora e previsão para 5 dias no OCLIMA.";

  if (locationLoading && !selectedCoords) {
    return <WeatherSkeleton />;
  }

  const locationName = locationQuery.data?.[0] || {
    name: cityName,
    country: weatherQuery.data?.sys?.country || "BR",
    lat: effectiveCoordinates.lat,
    lon: effectiveCoordinates.lon,
  };

  return (
    <>
      <SeoHelmet
        title={seoTitle}
        description={seoDescription}
        url="/"
        type="website"
      />
      <div className="space-y-6">
        {/* Location Banner if GPS is denied or default is used */}
        {locationError && isUsingDefault && (
          <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300">
            <MapPin className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <AlertTitle className="text-amber-600 dark:text-amber-400 font-semibold">Localização Automática Indisponível</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs md:text-sm mt-1">
              <span>Exibindo clima padrão (São Paulo). Ative o GPS ou escolha uma cidade rápida:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={getLocation}
                className="w-fit border-amber-500/40 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200"
              >
                <Navigation className="mr-2 h-3.5 w-3.5" />
                Ativar Meu GPS
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Favorite Cities Bar */}
        <FavoriteCities />

        {/* Header Bar with Current Location & Quick Cities */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-1">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 shadow-sm" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                {cityName}
              </h1>
              <span className="rounded-full border border-border/60 bg-muted/50 dark:bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {geoCoordinates && !selectedCoords ? "Seu GPS" : "Cidade Ativa"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-full border border-border/60 bg-card/90 dark:bg-white/[0.03] backdrop-blur-md shadow-sm">
              {POPULAR_CITIES.slice(0, 5).map((city) => {
                const isActive = cityName === city.name;
                return (
                  <Button
                    key={city.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCoords({ lat: city.lat, lon: city.lon })}
                    className={`text-xs h-7 px-3 rounded-full font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/10"
                    }`}
                  >
                    {city.name}
                  </Button>
                );
              })}
            </div>

            {selectedCoords && geoCoordinates && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCoords(null)}
                className="text-xs h-8 px-3 rounded-full border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-500/20"
                title="Voltar para meu GPS"
              >
                <Navigation className="h-3.5 w-3.5 mr-1" />
                Meu GPS
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={weatherQuery.isFetching || forecastQuery.isFetching}
              title="Atualizar clima agora"
              className="h-8 w-8 rounded-full border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted ml-auto shadow-sm"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  weatherQuery.isFetching ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Weather Content */}
        {weatherQuery.error || forecastQuery.error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>Não foi possível obter dados meteorológicos. Tente novamente.</p>
              <Button variant="outline" onClick={handleRefresh} className="w-fit">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        ) : !weatherQuery.data || !forecastQuery.data ? (
          <WeatherSkeleton />
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              <CurrentWeather
                data={weatherQuery.data}
                locationName={locationName}
              />
              <HourlyTemperature data={forecastQuery.data} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 items-start">
              <WeatherDetails data={weatherQuery.data} />
              <WeatherForecast data={forecastQuery.data} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
