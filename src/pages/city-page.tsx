import { FavoriteButton } from "@/components/favorite-button";
import { SeoHelmet } from "@/components/seo-helmet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";

export function CityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const cityName = params.cityName || "Cidade Desconhecida";

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  const handleRefresh = () => {
    weatherQuery.refetch();
    forecastQuery.refetch();
  };

  const seoTitle = `${cityName} - Previsão do Tempo | OCLIMA`;
  const seoDescription = weatherQuery.data
    ? `Clima atual em ${cityName}: ${Math.round(
        weatherQuery.data.main.temp
      )}°C, ${
        weatherQuery.data.weather[0].description
      }. Veja previsão horária e dos próximos 5 dias no OCLIMA.`
    : `Consulte a previsão do tempo completa para ${cityName} no OCLIMA.`;

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <>
        <SeoHelmet
          title={`Clima Indisponível | OCLIMA`}
          description="Informações meteorológicas temporariamente indisponíveis."
          url={`/city/${encodeURIComponent(cityName)}`}
          type="website"
        />
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <p>Não foi possível carregar a previsão para {cityName}.</p>
              <Button variant="outline" onClick={handleRefresh} className="w-fit">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <>
      <SeoHelmet
        title={seoTitle}
        description={seoDescription}
        url={`/city/${encodeURIComponent(cityName)}`}
        type="website"
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              title="Voltar ao início"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {cityName}, {weatherQuery.data.sys.country}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={weatherQuery.isFetching || forecastQuery.isFetching}
              title="Atualizar dados"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  weatherQuery.isFetching ? "animate-spin" : ""
                }`}
              />
            </Button>
            <FavoriteButton
              data={{ ...weatherQuery.data, name: cityName }}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <CurrentWeather
              data={weatherQuery.data}
              locationName={{
                name: cityName,
                country: weatherQuery.data.sys.country,
                lat,
                lon,
              }}
            />
            <HourlyTemperature data={forecastQuery.data} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            <WeatherDetails data={weatherQuery.data} />
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>
      </div>
    </>
  );
}
