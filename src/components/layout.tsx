import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Header } from "./header";
import { PwaInstallBanner } from "./pwa-install-banner";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { useTheme } from "@/context/theme-provider";

export function Layout({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  const handleRefreshGPS = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 text-foreground transition-colors duration-300 flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer Centralizado e Executivo com Suporte ao Modo Claro/Escuro */}
      <footer className="border-t border-border/40 backdrop-blur-xl bg-background/80 py-10 mt-auto transition-colors">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center space-y-4">
          {/* Logo Centralizado (Claro/Escuro) */}
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src={isDark ? "/logo.png" : "/logo2.png"}
              alt="O CLIMA - Previsão e Meteorologia"
              className="h-10 w-auto object-contain drop-shadow-md"
            />
          </Link>

          {/* Slogan */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
            Previsão do tempo inteligente em tempo real com alta precisão via satélite, alertas meteorológicos e gráficos dinâmicos.
          </p>

          {/* Créditos com Links Clicáveis */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <span>Um produto por</span>
            <a
              href="https://github.com/LinkjohnDEV"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              @Linkjohn
            </a>
            <span>•</span>
            <a
              href="https://ialauren.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline transition-colors"
            >
              ialauren.com
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-muted-foreground border-t border-border/40 pt-3 w-full max-w-xs">
            © {new Date().getFullYear()} OCLIMA. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* PWA Smart Install Banner */}
      <PwaInstallBanner />

      {/* Mobile Fixed CTA Bottom Bar */}
      <MobileBottomBar
        onOpenSearch={handleOpenSearch}
        onRefreshGPS={handleRefreshGPS}
      />
    </div>
  );
}
