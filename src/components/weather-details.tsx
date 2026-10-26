import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset, Compass, Gauge, Activity, Sun, Wind } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { wind, main, sys } = data;

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "HH:mm");
  };

  // Convert wind degree to direction
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
    const index = Math.round(((degree % 360) + 360) % 360 / 45) % 8;
    return directions[index];
  };

  // Wind strength description
  const getWindStrength = (speedMs: number) => {
    const kmh = speedMs * 3.6;
    if (kmh < 5) return "Quase calmo";
    if (kmh < 15) return "Brisa leve";
    if (kmh < 29) return "Brisa moderada";
    if (kmh < 40) return "Vento forte";
    return "Ventania";
  };

  // Daylight progress calculation
  const now = Math.floor(Date.now() / 1000);
  const dayLength = sys.sunset - sys.sunrise;
  const elapsed = Math.max(0, Math.min(now - sys.sunrise, dayLength));
  const sunProgress = dayLength > 0 ? Math.round((elapsed / dayLength) * 100) : 50;
  const isDay = now >= sys.sunrise && now <= sys.sunset;

  const speedKmh = Math.round(wind.speed * 3.6);

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors duration-300">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 shadow-sm">
            <Activity className="h-4 w-4" />
          </span>
          Condições Atmosféricas Detalhadas
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 1. Sol & Ciclo da Luz do Dia */}
          <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/70 dark:bg-white/[0.03] p-4 space-y-3 hover:bg-white dark:hover:bg-white/[0.06] transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500" /> Ciclo Solar
              </span>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">
                {isDay ? "Dia em curso" : "Período noturno"}
              </span>
            </div>

            {/* Sun progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1 font-bold">
                  <Sunrise className="h-3.5 w-3.5 text-amber-500" /> {formatTime(sys.sunrise)}
                </span>
                <span className="flex items-center gap-1 font-bold">
                  {formatTime(sys.sunset)} <Sunset className="h-3.5 w-3.5 text-orange-500" />
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 via-orange-400 to-blue-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, sunProgress))}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-right">
                {isDay ? `${sunProgress}% do dia decorrido` : "Aguardando novo amanhecer"}
              </p>
            </div>
          </div>

          {/* 2. Bússola de Vento com Rotação Real */}
          <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/70 dark:bg-white/[0.03] p-4 space-y-3 hover:bg-white dark:hover:bg-white/[0.06] transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Wind className="h-4 w-4 text-cyan-500 dark:text-cyan-400" /> Direção & Dinâmica do Vento
              </span>
              <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5">
                {getWindStrength(wind.speed)}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              {/* Rotating Compass Ring */}
              <div className="relative h-12 w-12 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center shadow-sm">
                <Compass
                  className="h-6 w-6 text-cyan-600 dark:text-cyan-400 transition-transform duration-700"
                  style={{ transform: `rotate(${wind.deg || 0}deg)` }}
                />
                <span className="absolute -top-1 text-[8px] font-extrabold text-cyan-600 dark:text-cyan-300">N</span>
              </div>

              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {getWindDirection(wind.deg)} • {speedKmh} km/h
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ângulo exato: {wind.deg}° • {wind.speed} m/s
                </p>
              </div>
            </div>
          </div>

          {/* 3. Barômetro / Pressão Atmosférica */}
          <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/70 dark:bg-white/[0.03] p-4 space-y-3 hover:bg-white dark:hover:bg-white/[0.06] transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-indigo-500 dark:text-indigo-400" /> Pressão Atmosférica
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5">
                {main.pressure >= 1013 ? "Estável" : "Baixa Pressão"}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{main.pressure}</span>
                <span className="text-xs font-semibold text-muted-foreground">hPa (mbar)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((main.pressure - 970) / 80) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Padrão ao nível do mar: 1013.25 hPa
              </p>
            </div>
          </div>

          {/* 4. Conforto Térmico & Amplitude */}
          <div className="rounded-2xl border border-border/60 dark:border-white/5 bg-white/70 dark:bg-white/[0.03] p-4 space-y-3 hover:bg-white dark:hover:bg-white/[0.06] transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Conforto & Umidade
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                {main.humidity > 70 ? "Úmido" : main.humidity < 40 ? "Seco" : "Agradável"}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{main.humidity}%</span>
                <span className="text-xs font-semibold text-muted-foreground">Umidade Relativa</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, main.humidity)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Ponto de orvalho estimado favorável
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
