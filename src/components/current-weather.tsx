import { useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Wind,
  Thermometer,
  Compass,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
} from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { getWeatherIconUrl } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShareWeatherDialog } from "./share-weather-dialog";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { speed, deg },
  } = data;

  const cityName = locationName?.name || data.name;
  const stateOrCountry = locationName?.state
    ? `${locationName.state}, ${locationName.country || data.sys.country}`
    : locationName?.country || data.sys.country;

  // Favorites handling without needing login
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(data.coord.lat, data.coord.lon, cityName);

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite.mutate(cityName);
      toast.error(`${cityName} removido dos favoritos`);
    } else {
      addFavorite.mutate({
        name: cityName,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
        state: locationName?.state,
      });
      toast.success(`${cityName} salvo como favorito! Acesse no carrossel acima.`);
    }
  };

  // Convert wind degree to direction
  const getWindDirection = (degree?: number) => {
    if (degree === undefined) return "N";
    const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
    const index = Math.round(((degree % 360) + 360) % 360 / 45) % 8;
    return directions[index];
  };

  const formatTemp = (val: number) => `${Math.round(val)}°`;
  const speedKmh = Math.round(speed * 3.6);

  return (
    <>
      <Card
        ref={cardRef}
        className="relative overflow-hidden flex-1 rounded-3xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors duration-300"
      >
        {/* Ambient background glow effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/15 dark:bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />

        <CardContent className="relative z-10 p-6 md:p-8 space-y-6">
          {/* Top Header Row: Location, Date, Share & Favorite Buttons */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 shadow-sm">
                  <MapPin className="h-4 w-4" />
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                  {cityName}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pl-10">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{stateOrCountry}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>

            {/* Actions: Favorite & Share Buttons */}
            <div className="flex items-center gap-2">
              {/* Quick Favorite Star Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
                className={`h-9 px-3 gap-1.5 rounded-full border transition-all duration-300 shadow-sm ${
                  isFav
                    ? "bg-amber-500/15 border-amber-400/60 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25"
                    : "bg-white/80 dark:bg-white/5 border-border/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
                title={isFav ? "Remover dos favoritos" : "Salvar nos favoritos (1 clique)"}
              >
                <Star
                  className={`h-4 w-4 transition-transform ${
                    isFav ? "fill-amber-400 text-amber-500 dark:text-amber-400 scale-110" : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs font-semibold hidden sm:inline">
                  {isFav ? "Favorito" : "Favoritar"}
                </span>
              </Button>

              {/* Share Weather Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareOpen(true)}
                className="h-9 px-3 gap-1.5 rounded-full border border-border/60 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm group"
                title="Compartilhar foto do clima em tempo real com link"
              >
                <Share2 className="h-4 w-4 text-blue-500 dark:text-blue-400 group-hover:text-white transition-colors" />
                <span className="text-xs font-semibold hidden sm:inline">Compartilhar</span>
              </Button>
            </div>
          </div>

          {/* Center Main Stage: Huge Temp + 3D Weather Art */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 py-2">
            {/* Temperature & Sensação (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                  {formatTemp(temp)}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 self-start mt-2">
                  C
                </span>
              </div>

              {/* Condition Pill with Live Pulse Dot */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 dark:border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs md:text-sm font-semibold text-blue-700 dark:text-blue-200 backdrop-blur-md shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                  <span className="capitalize">{currentWeather.description}</span>
                </div>

                {/* Min & Max Badges */}
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold shadow-sm">
                  <span className="flex items-center text-blue-600 dark:text-blue-400 font-bold" title="Mínima">
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="flex items-center text-red-600 dark:text-red-400 font-bold" title="Máxima">
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Art Illustration (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative flex aspect-square w-44 md:w-52 items-center justify-center">
                {/* Backlight ring */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 blur-xl animate-pulse" />
                <img
                  src={getWeatherIconUrl(currentWeather.icon, "4x", currentWeather.description)}
                  alt={currentWeather.description}
                  className="relative z-10 h-full w-full object-contain filter drop-shadow-[0_15px_30px_rgba(59,130,246,0.25)] dark:drop-shadow-[0_15px_30px_rgba(59,130,246,0.35)] transition-transform hover:scale-105 duration-500 animate-float-medium"
                />
              </div>
            </div>
          </div>

          {/* Bottom Atmospheric Grid: 4 Modern Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Sensação Térmica */}
            <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/80 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] p-3.5 transition-all duration-300 backdrop-blur-sm shadow-sm group">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Thermometer className="h-4 w-4 text-amber-500 dark:text-amber-400 transition-transform group-hover:scale-110" />
                <span className="font-semibold">Sensação</span>
              </div>
              <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatTemp(feels_like)}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {feels_like > temp ? "Mais quente" : feels_like < temp ? "Mais fresco" : "Igual à temp."}
              </p>
            </div>

            {/* Umidade */}
            <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/80 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] p-3.5 transition-all duration-300 backdrop-blur-sm shadow-sm group">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110" />
                <span className="font-semibold">Umidade</span>
              </div>
              <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {humidity}%
              </p>
              {/* Visual Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(humidity, 100)}%` }}
                />
              </div>
            </div>

            {/* Vento */}
            <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/80 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] p-3.5 transition-all duration-300 backdrop-blur-sm shadow-sm group">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Wind className="h-4 w-4 text-cyan-500 dark:text-cyan-400 transition-transform group-hover:scale-110" />
                <span className="font-semibold">Vento</span>
              </div>
              <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {speedKmh} <span className="text-xs font-normal text-muted-foreground">km/h</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 font-medium">
                <Compass className="h-3 w-3 text-cyan-500" />
                <span>Direção {getWindDirection(deg)}</span>
              </p>
            </div>

            {/* Pressão */}
            <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/80 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] p-3.5 transition-all duration-300 backdrop-blur-sm shadow-sm group">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400 transition-transform group-hover:scale-110" />
                <span className="font-semibold">Pressão</span>
              </div>
              <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {pressure} <span className="text-xs font-normal text-muted-foreground">hPa</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {pressure >= 1013 ? "Alta pressão" : "Baixa pressão"}
              </p>
            </div>
          </div>

          {/* Bottom Branding Stamp for Live Snapshots & Shares */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40 dark:border-white/5 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <img src="/favicon/favicon-96x96.png" alt="OCLIMA" className="h-3.5 w-3.5" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">OCLIMA</span>
              <span>• Previsão do Tempo Oficial</span>
            </div>
            <span className="font-mono text-muted-foreground font-medium">
              {typeof window !== "undefined" ? window.location.host : "oclima.app"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Share Weather Modal */}
      <ShareWeatherDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        cityName={cityName}
        temp={temp}
        condition={currentWeather.description}
        feelsLike={feels_like}
        humidity={humidity}
        windKmh={speedKmh}
        pressure={pressure}
        stateOrCountry={stateOrCountry}
        icon={currentWeather.icon}
      />
    </>
  );
}
