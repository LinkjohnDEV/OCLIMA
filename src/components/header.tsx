import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "@/context/theme-provider";

export function Header() {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 py-2 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link to={"/"} className="flex items-center gap-3 group">
          <img
            src={isDark ? "/logo.png" : "/logo2.png"}
            alt="O CLIMA - Previsão e Meteorologia"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <CitySearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
