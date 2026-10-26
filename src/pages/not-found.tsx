import { SeoHelmet } from "@/components/seo-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/theme-provider";
import { ArrowLeft, Cloud, CloudRain, CloudSnow, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <SeoHelmet
        title="Página Não Encontrada | OCLIMA"
        description="A página que você está procurando não foi encontrada. Você será redirecionado para a página inicial em breve."
        url="/404"
        type="website"
      />
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center relative overflow-hidden shadow-lg border">
          {/* Animated Weather Icons Background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="animate-float-slow absolute -top-4 left-4">
              <Cloud className="w-16 h-16" />
            </div>
            <div className="animate-float-medium absolute top-1/4 right-4">
              <CloudRain className="w-12 h-12" />
            </div>
            <div className="animate-float-fast absolute bottom-4 left-1/4">
              <CloudSnow className="w-10 h-10" />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`text-8xl md:text-9xl font-extrabold mb-2 select-none pointer-events-none leading-none ${
                theme === "dark"
                  ? "bg-gradient-to-b from-blue-400 to-blue-600"
                  : "bg-gradient-to-b from-blue-500 to-blue-700"
              } bg-clip-text text-transparent animate-pulse`}
            >
              404
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Página Não Encontrada
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Ops! Parece que você navegou em céu nublado e a página solicitada não existe.
            </p>

            <div className="space-y-5 w-full">
              <p className="text-xs text-muted-foreground">
                Redirecionando automaticamente em <strong>{countdown}</strong> segundos...
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="group transition-all"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Voltar
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="group bg-blue-600 hover:bg-blue-700 text-white transition-all"
                >
                  <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Página Inicial
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
