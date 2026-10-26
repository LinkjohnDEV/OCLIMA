import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { Clock, TrendingUp } from "lucide-react";
import { getWeatherIconUrl } from "@/lib/utils";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
  icon: string;
  desc: string;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  const items = data.list.slice(0, 8);

  const chartData: ChartData[] = items.map((item) => ({
    time: format(new Date(item.dt * 1000), "HH:mm"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    icon: item.weather[0]?.icon || "02d",
    desc: item.weather[0]?.description || "",
  }));

  const temps = chartData.map((d) => d.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const maxPoint = chartData.find((d) => d.temp === maxTemp);

  const yMin = minTemp - 1.5;
  const yMax = maxTemp + 1.5;

  return (
    <Card className="relative overflow-hidden flex-1 rounded-3xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 shadow-xl dark:shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <CardHeader className="p-6 md:p-8 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
            <span className="p-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 shadow-sm">
              <Clock className="h-4 w-4" />
            </span>
            Temperatura nas Próximas 24 Horas
          </CardTitle>

          {/* Peak Summary Badge */}
          {maxPoint && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-sm">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Pico: {maxTemp}° às {maxPoint.time}</span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Main Area Chart - Expanded to fill full middle height */}
      <CardContent className="flex-1 flex flex-col justify-center px-4 md:px-8 py-2 min-h-[220px] md:min-h-[250px]">
        <div className="h-full w-full min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[yMin, yMax]}
                tickFormatter={(val) => `${Math.round(val)}°`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as ChartData;
                    return (
                      <div className="rounded-xl border border-border/80 dark:border-white/10 bg-background/95 dark:bg-slate-950/95 backdrop-blur-md p-3 shadow-2xl space-y-1.5">
                        <p className="text-xs font-bold text-foreground border-b border-border/40 pb-1">
                          Horário: {d.time}
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Temp</span>
                            <p className="text-sm font-extrabold text-blue-600 dark:text-cyan-400">{d.temp}°C</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Sensação</span>
                            <p className="text-sm font-extrabold text-foreground/80">{d.feels_like}°C</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="natural"
                dataKey="temp"
                stroke="#0284c7"
                strokeWidth={3.5}
                fill="url(#tempAreaGradient)"
                dot={{ r: 4, fill: "#0284c7", strokeWidth: 1.5, stroke: "#ffffff" }}
                activeDot={{ r: 7, fill: "#06b6d4", stroke: "#ffffff", strokeWidth: 2 }}
              />
              <Line
                type="natural"
                dataKey="feels_like"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* Glanceable Hourly Strip at Bottom */}
      <div className="p-4 md:p-6 pt-0 border-t border-border/40 dark:border-white/5">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-3">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/60 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.06] border border-border/60 dark:border-white/[0.05] transition-all duration-200 shadow-sm group"
            >
              <span className="text-[10px] font-medium text-muted-foreground">{item.time}</span>
              <img
                src={getWeatherIconUrl(item.icon, "2x", item.desc)}
                alt={item.desc}
                className="h-8 w-8 object-contain my-1 filter drop-shadow group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-bold text-foreground">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
