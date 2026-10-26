import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Loader2, Clock, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorite";

export function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { favorites } = useFavorites();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  // Global keyboard shortcut: Ctrl+K or Cmd+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = () => setOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    // Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${encodeURIComponent(name)}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-between text-sm text-muted-foreground sm:pr-3 md:w-52 lg:w-72 h-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-blue-400" />
          <span className="truncate">Buscar cidades...</span>
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/10 px-1.5 font-mono text-[10px] font-semibold text-slate-300 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-2xl border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
          <CommandInput
            placeholder="Digite o nome de qualquer cidade do mundo..."
            value={query}
            onValueChange={setQuery}
            className="text-sm h-12"
          />
          <CommandList className="max-h-[350px]">
            {query.length > 2 && !isLoading && (!locations || locations.length === 0) && (
              <CommandEmpty className="py-6 text-center text-sm text-slate-400">
                Nenhuma cidade encontrada para "{query}".
              </CommandEmpty>
            )}

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <CommandGroup heading="Cidades Favoritas">
                {favorites.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                    onSelect={handleSelect}
                    className="cursor-pointer hover:bg-white/10 rounded-lg p-2.5"
                  >
                    <Star className="mr-2 h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-white">{city.name}</span>
                    {city.state && (
                      <span className="text-xs text-slate-400">
                        , {city.state}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-bold ml-0.5">
                      , {city.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Search History Section */}
            {history.length > 0 && (
              <>
                <CommandSeparator className="bg-white/10" />
                <CommandGroup>
                  <div className="flex items-center justify-between px-2 my-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Buscas Recentes
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearHistory.mutate()}
                      className="h-6 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Limpar Histórico
                    </Button>
                  </div>
                  {history.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                      onSelect={handleSelect}
                      className="cursor-pointer hover:bg-white/10 rounded-lg p-2.5"
                    >
                      <Clock className="mr-2 h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-200">{item.name}</span>
                      {item.state && (
                        <span className="text-xs text-slate-400">
                          , {item.state}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-semibold ml-0.5">
                        , {item.country}
                      </span>
                      <span className="ml-auto text-[11px] text-slate-500 font-mono">
                        {format(item.searchedAt, "d 'de' MMM, HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Search Results */}
            <CommandSeparator className="bg-white/10" />
            {locations && locations.length > 0 && (
              <CommandGroup heading="Sugestões de Cidades">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                )}
                {locations?.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}-${location.name}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                    className="cursor-pointer hover:bg-blue-600/20 hover:border-blue-500/30 rounded-lg p-2.5 transition-colors"
                  >
                    <Search className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="font-bold text-white">{location.name}</span>
                    {location.state && (
                      <span className="text-xs text-slate-300 ml-1">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-xs text-cyan-400 font-semibold ml-1">
                      , {location.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
