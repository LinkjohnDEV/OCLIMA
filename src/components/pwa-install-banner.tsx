import { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "oclima_pwa_dismissed_at";
const DISMISS_DAYS = 7;

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const daysPassed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysPassed < DISMISS_DAYS) {
        return;
      }
    }

    // 3. Detect iOS platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    setIsIOS(isIOSDevice);

    // If iOS and not standalone, show banner with instructions button
    if (isIOSDevice) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }

    // 4. Android / Chrome / Edge: Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback: show instructions if prompt not triggered
      setShowIOSModal(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn("Erro ao acionar prompt de instalação:", err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Installation Banner */}
      <aside aria-label="Instalar aplicativo" className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-in slide-in-from-bottom duration-500">
        <div className="relative flex items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-blue-500/30 bg-slate-950/95 shadow-2xl backdrop-blur-xl text-white">
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent pointer-events-none" />

          {/* App Icon */}
          <div className="relative flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
            <img
              src="/favicon/favicon-96x96.png"
              alt="OCLIMA"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>

          {/* Texts */}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              Instalar OCLIMA
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              Acesso rápido e offline na sua tela inicial
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="h-8 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isIOS ? "Como Instalar" : "Instalar"}</span>
            </Button>

            <button
              onClick={handleDismiss}
              className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Fechar banner"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Step-by-Step Installation Modal */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="max-w-sm sm:max-w-md bg-slate-950/95 border-slate-800 text-white shadow-2xl backdrop-blur-xl p-6">
          <DialogHeader className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
              <Smartphone className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Instalar OCLIMA no seu Dispositivo
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Siga os 3 passos simples para adicionar o app à sua tela inicial:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.03]">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <div className="space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Toque no botão <Share className="h-3.5 w-3.5 text-blue-400 inline" /> Compartilhar
                </p>
                <p className="text-slate-400 text-[11px]">
                  Localizado na barra de ferramentas do seu navegador (Safari ou Chrome).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.03]">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <div className="space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Selecione <PlusSquare className="h-3.5 w-3.5 text-emerald-400 inline" /> "Adicionar à Tela de Início"
                </p>
                <p className="text-slate-400 text-[11px]">
                  Role as opções do menu para baixo até encontrar o ícone de adicionar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.03]">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                3
              </span>
              <div className="space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Toque em <CheckCircle className="h-3.5 w-3.5 text-cyan-400 inline" /> "Adicionar"
                </p>
                <p className="text-slate-400 text-[11px]">
                  No canto superior direito. O ícone oficial do OCLIMA será instalado!
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowIOSModal(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold h-10"
          >
            Entendi, vou adicionar!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
