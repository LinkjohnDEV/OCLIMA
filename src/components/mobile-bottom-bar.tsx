import { Search, Navigation, Home, Star, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileBottomBarProps {
  onOpenSearch: () => void;
  onRefreshGPS?: () => void;
  onOpenInstall?: () => void;
}

export function MobileBottomBar({
  onOpenSearch,
  onRefreshGPS,
  onOpenInstall,
}: MobileBottomBarProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollToFavorites = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav aria-label="Navegação mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-5px_20px_rgba(0,0,0,0.4)]">
      <div className="grid grid-cols-5 items-center justify-around h-14 px-2">
        {/* 1. Início */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
            isHome ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Início</span>
        </Link>

        {/* 2. Buscar */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </button>

        {/* 3. Meu GPS (Central Action Highlight) */}
        <button
          onClick={onRefreshGPS}
          className="flex flex-col items-center justify-center -mt-3 text-[10px] font-bold text-white transition-transform active:scale-95"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-slate-950">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <span className="text-[9px] mt-0.5 text-cyan-300">Meu GPS</span>
        </button>

        {/* 4. Favoritos */}
        <button
          onClick={scrollToFavorites}
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <Star className="h-4 w-4 text-amber-400" />
          <span>Favoritos</span>
        </button>

        {/* 5. Instalar PWA */}
        <button
          onClick={onOpenInstall}
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>Instalar</span>
        </button>
      </div>
    </nav>
  );
}
