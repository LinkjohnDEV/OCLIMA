import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

const STORAGE_KEY = "favorites";

function getStoredFavorites(): FavoriteCity[] {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
}

function saveFavorites(favorites: FavoriteCity[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
}

export function useFavorites() {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getStoredFavorites,
    initialData: getStoredFavorites,
  });

  const favorites = favoritesQuery.data || [];

  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const current = getStoredFavorites();
      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat.toFixed(4)}-${city.lon.toFixed(4)}`,
        addedAt: Date.now(),
      };

      // Prevent duplicates by name or coordinates
      const exists = current.some(
        (fav) =>
          fav.id === newFavorite.id ||
          fav.name.toLowerCase() === city.name.toLowerCase()
      );
      if (exists) return current;

      const updated = [...current, newFavorite];
      saveFavorites(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["favorites"], data);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (idOrName: string) => {
      const current = getStoredFavorites();
      const updated = current.filter(
        (city) =>
          city.id !== idOrName &&
          city.name.toLowerCase() !== idOrName.toLowerCase()
      );
      saveFavorites(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["favorites"], data);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const isFavorite = (lat: number, lon: number, cityName?: string) => {
    return favorites.some(
      (city) =>
        (Math.abs(city.lat - lat) < 0.05 && Math.abs(city.lon - lon) < 0.05) ||
        (cityName && city.name.toLowerCase() === cityName.toLowerCase())
    );
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
