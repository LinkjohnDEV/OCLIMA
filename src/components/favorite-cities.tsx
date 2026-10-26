import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { getWeatherIconUrl } from "@/lib/utils";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  const handleClick = () => {
    navigate(`/city/${encodeURIComponent(name)}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex min-w-[240px] cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border/60 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 p-4 pr-10 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 hover:border-blue-400/50 hover:scale-[1.02]"
      role="button"
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 rounded-full p-0 text-muted-foreground opacity-60 hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`${name} removido dos favoritos`);
        }}
        title="Remover favorito"
      >
        <X className="h-4 w-4" />
      </Button>

      {isLoading ? (
        <div className="flex h-12 items-center justify-center w-full">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-3">
            <img
              src={getWeatherIconUrl(weather.weather[0].icon, "2x", weather.weather[0].description)}
              alt={weather.weather[0].description}
              className="h-10 w-10 object-contain filter drop-shadow group-hover:scale-110 transition-transform"
            />
            <div className="space-y-0.5">
              <p className="font-bold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                {name}
              </p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span>{weather.sys.country}</span>
                <span>•</span>
                <span className="capitalize text-foreground/80 truncate max-w-[90px]">
                  {weather.weather[0].description}
                </span>
              </p>
            </div>
          </div>
          <div className="text-right pl-2">
            <p className="text-2xl font-black text-foreground tracking-tight">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Sens. {Math.round(weather.main.feels_like)}°
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites.length) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
          <span className="text-foreground font-bold text-sm">Cidades Favoritas</span>
        </span>
        <span className="text-[11px] text-muted-foreground/80">
          Acesso rápido • Salvo no seu navegador
        </span>
      </div>
      <ScrollArea className="w-full pb-2">
        <div className="flex gap-3">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-1" />
      </ScrollArea>
    </div>
  );
}
