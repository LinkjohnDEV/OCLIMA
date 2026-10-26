import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CalendarDays, Droplets, Wind } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ForecastData } from "@/api/types";
import { getWeatherIconUrl } from "@/lib/utils";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  // Group forecast by day and get daily min/max
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  // Get next 5 days
  const nextDays = Object.values(dailyForecasts).slice(0, 5);

  // Overall min and max for relative temperature bar calculation
  const allMins = nextDays.map((d) => d.temp_min);
  const allMaxs = nextDays.map((d) => d.temp_max);
  const overallMin = Math.min(...(allMins.length ? allMins : [10]));
  const overallMax = Math.max(...(allMaxs.length ? allMaxs : [30]));
  const totalRange = Math.max(1, overallMax - overallMin);

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  const getDayLabel = (dateTimestamp: number) => {
    const d = new Date(dateTimestamp * 1000);
    if (isToday(d)) return "Hoje";
    if (isTomorrow(d)) return "Amanhã";
    return format(d, "EEE", { locale: ptBR });
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors duration-300">
      <CardHeader className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 shadow-sm">
              <CalendarDays className="h-4 w-4" />
            </span>
            Previsão para 5 Dias
          </CardTitle>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Amplitude térmica da semana
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <div className="space-y-3">
          {nextDays.map((day) => {
            const leftOffset = Math.max(
              0,
              Math.min(100, ((day.temp_min - overallMin) / totalRange) * 100)
            );
            const barWidth = Math.max(
              15,
              Math.min(100 - leftOffset, ((day.temp_max - day.temp_min) / totalRange) * 100)
            );

            const dayDate = new Date(day.date * 1000);
            const isCurrentDay = isToday(dayDate);

            return (
              <div
                key={day.date}
                className={`grid grid-cols-12 items-center gap-3 rounded-2xl border p-3.5 transition-all duration-300 shadow-sm ${
                  isCurrentDay
                    ? "border-blue-500/40 bg-blue-500/[0.08]"
                    : "border-border/60 dark:border-white/5 bg-white/70 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05]"
                }`}
              >
                {/* Day name & Date (3 cols) */}
                <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                  <div className="w-16">
                    <p className={`font-bold text-sm capitalize ${isCurrentDay ? "text-blue-600 dark:text-cyan-400" : "text-foreground"}`}>
                      {getDayLabel(day.date)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(dayDate, "d MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                {/* Weather 3D Icon & Description (2 cols) */}
                <div className="col-span-2 sm:col-span-2 flex items-center gap-2">
                  <img
                    src={getWeatherIconUrl(day.weather.icon, "2x", day.weather.description)}
                    alt={day.weather.description}
                    className="h-8 w-8 object-contain filter drop-shadow hover:scale-110 transition-transform"
                  />
                  <span className="text-[11px] text-foreground/80 capitalize truncate hidden md:inline font-medium">
                    {day.weather.description}
                  </span>
                </div>

                {/* Temperature Range Bar (Apple Weather Style) (5 cols) */}
                <div className="col-span-5 sm:col-span-5 flex items-center gap-2">
                  <span className="w-7 text-right text-xs font-bold text-blue-600 dark:text-cyan-400">
                    {formatTemp(day.temp_min)}
                  </span>

                  {/* Horizontal Bar Track */}
                  <div className="relative flex-1 bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 shadow-sm transition-all duration-700"
                      style={{
                        left: `${leftOffset}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="w-7 text-left text-xs font-bold text-amber-600 dark:text-amber-400">
                    {formatTemp(day.temp_max)}
                  </span>
                </div>

                {/* Humidity & Wind Badges (2 cols) */}
                <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-2 text-[11px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400" title="Umidade">
                    <Droplets className="h-3.5 w-3.5" />
                    <span className="font-semibold">{day.humidity}%</span>
                  </span>
                  <span className="hidden lg:flex items-center gap-0.5 text-cyan-600 dark:text-cyan-400" title="Vento">
                    <Wind className="h-3.5 w-3.5" />
                    <span>{Math.round(day.wind * 3.6)}km/h</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
