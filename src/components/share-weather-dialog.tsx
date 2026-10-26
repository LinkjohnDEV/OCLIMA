import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toPng } from "html-to-image";
import {
  Download,
  Share2,
  Copy,
  Check,
  Loader2,
  MessageCircle,
  MapPin,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getWeatherIconUrl } from "@/lib/utils";

interface ShareWeatherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardRef?: React.RefObject<HTMLDivElement>;
  cityName: string;
  temp: number;
  condition: string;
  feelsLike?: number;
  humidity?: number;
  windKmh?: number;
  pressure?: number;
  stateOrCountry?: string;
  icon?: string;
}

export function ShareWeatherDialog({
  open,
  onOpenChange,
  cityName,
  temp,
  condition,
  feelsLike,
  humidity,
  windKmh,
  pressure,
  stateOrCountry,
  icon,
}: ShareWeatherDialogProps) {
  const exportCardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [base64Icon, setBase64Icon] = useState<string>("");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://clima.linkjohn.com";
  const shareText = `Confira a previsão do tempo para ${cityName}: ${Math.round(temp)}°C, ${condition}. Acompanhe em tempo real no OCLIMA:`;

  // Converter o ícone 3D para Base64 para garantir renderização perfeita
  useEffect(() => {
    if (!open) {
      setImageUrl(null);
      return;
    }

    const loadIconAsBase64 = async () => {
      try {
        const iconPath = getWeatherIconUrl(icon, "4x", condition);
        const res = await fetch(iconPath);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Icon(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.warn("Fallback icon base64:", err);
      }
    };

    loadIconAsBase64();
  }, [open, icon, condition]);

  useEffect(() => {
    if (open && base64Icon && exportCardRef.current) {
      generateImage();
    }
  }, [open, base64Icon]);

  const generateImage = async () => {
    if (!exportCardRef.current) return;
    setIsGenerating(true);

    try {
      await new Promise((r) => setTimeout(r, 200));

      const dataUrl = await toPng(exportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#020817",
      });

      setImageUrl(dataUrl);
    } catch (err) {
      console.error("Erro ao gerar imagem de compartilhamento:", err);
      toast.error("Não foi possível gerar a foto do clima.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.download = `OCLIMA-${cityName.replace(/\s+/g, "_")}.png`;
    link.href = imageUrl;
    link.click();
    toast.success("Foto do clima salva na sua galeria!");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast.success("Legenda e link copiados para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar link.");
    }
  };

  const handleSharePhoto = async () => {
    if (!imageUrl) return;

    // Copiar automaticamente a legenda e o link para a área de transferência
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    } catch {}

    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `clima-${cityName}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        toast.info("Legenda copiada! Basta colar junto com a foto no WhatsApp.", { duration: 6000 });
        await navigator.share({
          title: `Clima em ${cityName} - OCLIMA`,
          text: `${shareText}\n${shareUrl}`,
          files: [file],
        });
        return;
      }
    } catch (err) {
      console.warn("Compartilhamento nativo cancelado:", err);
    }

    // Fallback se não suportar envio direto de arquivo: abre WhatsApp com o link
    handleWhatsAppDirect();
  };

  const handleWhatsAppDirect = () => {
    const textWithLink = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${textWithLink}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-950/95 border-slate-800 text-white shadow-2xl backdrop-blur-xl p-5 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
            <Share2 className="h-5 w-5 text-blue-400" />
            Compartilhar Previsão do Tempo
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Foto em tempo real gerada para {cityName} com dados e link do site embutidos.
          </DialogDescription>
        </DialogHeader>

        {/* Live Photo Preview */}
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-2 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[300px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-xs py-12">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              <span className="font-medium">Criando sua foto em alta resolução...</span>
            </div>
          ) : imageUrl ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={imageUrl}
                alt={`Clima em ${cityName}`}
                className="rounded-xl max-h-[270px] w-auto object-contain shadow-2xl border border-white/5"
              />
            </div>
          ) : (
            <p className="text-xs text-slate-400">Gerando pré-visualização...</p>
          )}
        </div>

        {/* Link Bar with 1-click Copy */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-xs">
          <span className="truncate text-slate-300 font-mono flex-1 pl-1">
            {shareUrl}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="h-7 px-3 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            {copied ? "Copiado!" : "Copiar"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* Send Photo (Native share to WhatsApp / Gallery) */}
          <Button
            onClick={handleSharePhoto}
            disabled={!imageUrl || isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-10 rounded-xl font-semibold shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar Foto
          </Button>

          {/* WhatsApp Direct Link with Rich Preview */}
          <Button
            onClick={handleWhatsAppDirect}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs h-10 rounded-xl font-semibold shadow-md"
          >
            <ExternalLink className="h-4 w-4" />
            Link c/ Prévia
          </Button>

          {/* Download Photo */}
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!imageUrl || isGenerating}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-1.5 text-xs h-10 rounded-xl font-semibold"
          >
            <Download className="h-4 w-4 text-blue-400" />
            Baixar
          </Button>
        </div>

        {/* Hidden Dedicated Capture Template with Prominent Link Stamp */}
        <div className="absolute -left-[9999px] top-0 pointer-events-none">
          <div
            ref={exportCardRef}
            className="w-[460px] p-8 rounded-3xl border border-white/15 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />

            {/* Header: Logo & City */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    {cityName}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 pl-8">
                  {stateOrCountry || "Brasil"} • {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
              </div>

              {/* Logo Official */}
              <img src="/logo.png" alt="OCLIMA" className="h-9 w-auto object-contain" />
            </div>

            {/* Main Temp & 3D Art */}
            <div className="relative z-10 grid grid-cols-12 items-center gap-4 py-2">
              <div className="col-span-7 space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    {Math.round(temp)}°
                  </span>
                  <span className="text-3xl font-bold text-cyan-400">C</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-200">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="capitalize">{condition}</span>
                </div>
              </div>

              {/* 3D Weather Art using in-memory Base64 */}
              <div className="col-span-5 flex items-center justify-center">
                {base64Icon && (
                  <img
                    src={base64Icon}
                    alt={condition}
                    className="h-36 w-36 object-contain filter drop-shadow-[0_15px_25px_rgba(59,130,246,0.4)]"
                  />
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="relative z-10 grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
                <Thermometer className="h-3.5 w-3.5 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Sensação</span>
                <p className="text-sm font-bold text-white">{Math.round(feelsLike ?? temp)}°</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
                <Droplets className="h-3.5 w-3.5 text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Umidade</span>
                <p className="text-sm font-bold text-white">{humidity ?? 80}%</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
                <Wind className="h-3.5 w-3.5 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Vento</span>
                <p className="text-sm font-bold text-white">{windKmh ?? 15} km/h</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
                <Gauge className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Pressão</span>
                <p className="text-sm font-bold text-white">{pressure ?? 1015} hPa</p>
              </div>
            </div>

            {/* Prominent High-Contrast Link Banner inside the Photo */}
            <div className="relative z-10 rounded-2xl border border-blue-400/30 bg-blue-500/15 p-3 flex items-center justify-between text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-slate-200">
                  Acompanhe a previsão ao vivo em:
                </span>
              </div>
              <span className="font-mono text-cyan-300 font-extrabold text-sm tracking-wide">
                clima.linkjohn.com
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
