import { toast } from "sonner";

export function registerServiceWorker() {
  // 1. Checagem estrita de suporte para nunca quebrar navegadores antigos
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.info("[PWA] Service Worker não é suportado neste navegador.");
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registrado com sucesso:", registration.scope);

        // Monitorar novas versões disponíveis do app
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Nova versão encontrada! Exibir aviso elegante para atualizar
              toast.info("Nova versão do OCLIMA disponível!", {
                duration: 10000,
                action: {
                  label: "Atualizar Agora",
                  onClick: () => {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  },
                },
              });
            }
          });
        });
      })
      .catch((error) => {
        console.warn("[PWA] Falha ao registrar Service Worker:", error);
      });

    // Recarregar quando o novo service worker assumir
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}
