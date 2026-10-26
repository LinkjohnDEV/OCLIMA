import { useState } from "react";
import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Layers,
  MapPin,
  Search,
  Star,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Monitor,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
} from "lucide-react";

export function MockupPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "city" | "search" | "notfound" | "components">("dashboard");

  return (
    <>
      <SeoHelmet
        title="Mockup & Mapa de Telas do Sistema | OCLIMA"
        description="Especificação visual e mockup navegável de todas as telas e componentes do OCLIMA."
        url="/mockup"
        type="website"
      />

      <div className="space-y-8 pb-12">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 md:p-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
              <Layers className="h-3.5 w-3.5" />
              Documentação & Mockup Visual das Telas
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Mapa de Páginas & Design do <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">OCLIMA</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Estrutura completa das telas, fluxos de usuário, componentes de interface e regras de negócio implementadas na aplicação.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b pb-4">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
            className="gap-2"
          >
            <Monitor className="h-4 w-4" />
            1. Dashboard Principal (Home)
          </Button>

          <Button
            variant={activeTab === "city" ? "default" : "outline"}
            onClick={() => setActiveTab("city")}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            2. Página da Cidade
          </Button>

          <Button
            variant={activeTab === "search" ? "default" : "outline"}
            onClick={() => setActiveTab("search")}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            3. Busca & Favoritos
          </Button>

          <Button
            variant={activeTab === "notfound" ? "default" : "outline"}
            onClick={() => setActiveTab("notfound")}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            4. Página 404 (Erro)
          </Button>

          <Button
            variant={activeTab === "components" ? "default" : "outline"}
            onClick={() => setActiveTab("components")}
            className="gap-2"
          >
            <Layers className="h-4 w-4" />
            5. Design System & UI Kit
          </Button>
        </div>

        {/* Tab 1: Dashboard Principal */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-blue-500" />
                  Página 1: Dashboard Principal (Rota: <code>/</code>)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Página de entrada com geolocalização automática, carrossel de favoritos, clima atual e previsões.
                </p>
              </div>
              <Link to="/">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Tela Ao Vivo <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Wireframe Mockup Preview Box */}
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3 text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Representação Estrutural (Mockup Wireframe)</span>
                <span className="rounded bg-muted px-2 py-0.5 font-mono">desktop / mobile responsive</span>
              </div>

              {/* Mockup Header Bar */}
              <div className="rounded-lg border bg-muted/40 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">OC</div>
                  <span className="font-bold">OCLIMA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded border bg-background px-3 py-1 text-muted-foreground">🔍 Buscar cidades...</span>
                  <span className="rounded-md border p-1">🌓</span>
                </div>
              </div>

              {/* Mockup Favorites Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> Cidades Favoritas
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border bg-card p-2.5 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold">São Paulo</p>
                      <p className="text-[10px] text-muted-foreground">BR</p>
                    </div>
                    <span className="text-base font-extrabold text-blue-500">24°</span>
                  </div>
                  <div className="rounded-lg border bg-card p-2.5 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold">Rio de Janeiro</p>
                      <p className="text-[10px] text-muted-foreground">BR</p>
                    </div>
                    <span className="text-base font-extrabold text-amber-500">29°</span>
                  </div>
                  <div className="rounded-lg border bg-card p-2.5 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold">Curitiba</p>
                      <p className="text-[10px] text-muted-foreground">BR</p>
                    </div>
                    <span className="text-base font-extrabold text-blue-400">18°</span>
                  </div>
                  <div className="rounded-lg border bg-card p-2.5 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold">Lisboa</p>
                      <p className="text-[10px] text-muted-foreground">PT</p>
                    </div>
                    <span className="text-base font-extrabold text-cyan-500">21°</span>
                  </div>
                </div>
              </div>

              {/* Mockup Main Weather & Hourly Chart Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Current Weather Card */}
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">São Paulo, BR</h3>
                      <p className="text-xs text-muted-foreground">Clima em tempo real</p>
                    </div>
                    <span className="text-3xl">⛅</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black">24°</span>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Sensação: 25°</p>
                      <p className="text-blue-500 font-semibold">↓ 21° | ↑ 28°</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5 text-blue-500" />
                      <span>Umidade: 68%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Vento: 4.2 m/s</span>
                    </div>
                  </div>
                </div>

                {/* Hourly Chart Card */}
                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" /> Temperatura nas Próximas 24 Horas
                  </h3>
                  <div className="h-32 flex items-end justify-between gap-1 pt-6 px-2 border-b">
                    {[
                      { h: "12:00", t: 24, hgt: "65%" },
                      { h: "15:00", t: 26, hgt: "80%" },
                      { h: "18:00", t: 23, hgt: "60%" },
                      { h: "21:00", t: 20, hgt: "45%" },
                      { h: "00:00", t: 18, hgt: "35%" },
                      { h: "03:00", t: 17, hgt: "30%" },
                      { h: "06:00", t: 19, hgt: "40%" },
                      { h: "09:00", t: 22, hgt: "55%" },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-blue-500">{item.t}°</span>
                        <div className="w-full max-w-[20px] rounded-t bg-blue-500/20 hover:bg-blue-500 transition-all" style={{ height: item.hgt }} />
                        <span className="text-[9px] text-muted-foreground">{item.h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mockup Details & 5-Day Forecast Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Details */}
                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Compass className="h-4 w-4 text-blue-500" /> Condições Atmosféricas
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded border p-2 flex items-center gap-2">
                      <Sunrise className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Nascer do Sol</p>
                        <p className="font-bold">05:42</p>
                      </div>
                    </div>
                    <div className="rounded border p-2 flex items-center gap-2">
                      <Sunset className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Pôr do Sol</p>
                        <p className="font-bold">18:25</p>
                      </div>
                    </div>
                    <div className="rounded border p-2 flex items-center gap-2">
                      <Wind className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Direção do Vento</p>
                        <p className="font-bold">SE (140°)</p>
                      </div>
                    </div>
                    <div className="rounded border p-2 flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-indigo-500" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Pressão</p>
                        <p className="font-bold">1015 hPa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Day Forecast */}
                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" /> Previsão para os Próximos 5 Dias
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { day: "Terça", status: "Ensolarado", icon: "☀️", min: 19, max: 28 },
                      { day: "Quarta", status: "Parcialmente nublado", icon: "⛅", min: 20, max: 26 },
                      { day: "Quinta", status: "Chuva fraca", icon: "🌦️", min: 18, max: 23 },
                      { day: "Sexta", status: "Tempo limpo", icon: "🌤️", min: 19, max: 27 },
                      { day: "Sábado", status: "Poucas nuvens", icon: "⛅", min: 21, max: 29 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded border p-2">
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="font-semibold">{item.day}</span>
                          <span className="text-[11px] text-muted-foreground hidden sm:inline">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-500 font-semibold">{item.min}°</span>
                          <span className="text-red-500 font-semibold">{item.max}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist of Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Geolocalização com Fallback
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Se o GPS estiver bloqueado ou não for concedido, o app utiliza automaticamente uma cidade de referência e botões de atalho rápido sem quebrar a tela.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Modo Demonstração
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Funciona 100% de imediato mesmo sem chave da API do OpenWeather configurada, exibindo dados climáticos realistas.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Totalmente Responsivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Grade fluida com Tailwind CSS que se adapta de telas mobile de 360px a monitores ultrawide.
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Página da Cidade */}
        {activeTab === "city" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  Página 2: Detalhes por Cidade (Rota: <code>/city/:cityName?lat=X&lon=Y</code>)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Página dedicada com rota parametrizada, botão de favoritar cidade, navegação de retorno e previsão completa.
                </p>
              </div>
              <Link to="/city/Rio%20de%20Janeiro?lat=-22.9068&lon=-43.1729">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Testar Cidade (Rio de Janeiro) <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
              {/* City Page Mockup */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border p-2 text-xs flex items-center gap-1 font-semibold">
                    ← Voltar
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Rio de Janeiro, BR</h3>
                    <p className="text-xs text-muted-foreground">Coordenadas: -22.9068, -43.1729</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-md border p-2 text-xs">🔄 Atualizar</div>
                  <div className="rounded-md bg-yellow-500 text-white p-2 text-xs flex items-center gap-1 font-semibold">
                    ⭐ Favorito
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-bold text-sm">Clima Atual & Sensação</h4>
                  <p className="text-4xl font-extrabold text-blue-500">29°C</p>
                  <p className="text-xs text-muted-foreground">Ensolarado • Sensação de 31°C</p>
                  <p className="text-xs text-emerald-500">Umidade 62% • Vento 5.1 m/s</p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-bold text-sm">Curva de Temperatura 24h</h4>
                  <div className="h-20 flex items-end gap-2 border-b pb-2">
                    <div className="flex-1 bg-blue-500/20 h-10 rounded-t" />
                    <div className="flex-1 bg-blue-500/40 h-14 rounded-t" />
                    <div className="flex-1 bg-blue-500/80 h-18 rounded-t" />
                    <div className="flex-1 bg-blue-500 h-16 rounded-t" />
                    <div className="flex-1 bg-blue-500/40 h-12 rounded-t" />
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">Interpolação contínua com Recharts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Modal de Busca & Favoritos */}
        {activeTab === "search" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Search className="h-6 w-6 text-blue-500" />
                Página 3: Modal de Busca (CommandDialog) & Favoritos
              </h2>
              <p className="text-sm text-muted-foreground">
                Mecanismo de busca acessível com teclado (CmdK), histórico de buscas recentes e lista de favoritos.
              </p>
            </div>

            <div className="max-w-2xl mx-auto rounded-xl border bg-card p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="text-base text-foreground font-medium">Digite o nome de uma cidade...</span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cidades Favoritas</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded-md border p-2.5 text-xs hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">Curitiba, Paraná, BR</span>
                    </div>
                    <span className="text-muted-foreground font-mono">18°C</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Buscas Recentes</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded-md border p-2.5 text-xs hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">🕒</span>
                      <span className="font-medium">Salvador, Bahia, BR</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Hoje, 14:30</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Sugestões de Cidades</div>
                <div className="space-y-1">
                  {["São Paulo, BR", "Rio de Janeiro, BR", "Brasília, DF, BR", "Lisboa, PT", "Nova York, US"].map((c, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-2.5 text-xs hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                        <span className="font-medium">{c}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Página 404 */}
        {activeTab === "notfound" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-blue-500" />
                  Página 4: Página 404 Personalizada (Rota: <code>*</code>)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tela de erro amigável com animações flutuantes de nuvens e contador de redirecionamento automático.
                </p>
              </div>
              <Link to="/rota-inexistente-teste">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Testar Rota 404 Ao Vivo <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="max-w-md mx-auto rounded-xl border bg-card p-8 text-center space-y-4 shadow-md">
              <div className="text-7xl font-black bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">
                404
              </div>
              <h3 className="text-xl font-bold">Página Não Encontrada</h3>
              <p className="text-xs text-muted-foreground">
                Ops! Parece que você navegou em céu nublado e a página não existe.
              </p>
              <div className="rounded bg-muted/60 p-2 text-[11px] text-muted-foreground">
                Redirecionamento automático em 10 segundos...
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" size="sm">Voltar</Button>
                <Button size="sm" className="bg-blue-600 text-white">Página Inicial</Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Design System */}
        {activeTab === "components" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Layers className="h-6 w-6 text-blue-500" />
                Página 5: Design System & UI Kit do OCLIMA
              </h2>
              <p className="text-sm text-muted-foreground">
                Paleta de cores, tipografia, tokens e biblioteca de componentes reutilizáveis baseados em Radix UI e Tailwind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Paleta de Cores & Tokens</CardTitle>
                  <CardDescription>Cores primárias, acentos e estados de clima.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-blue-600 p-3 text-white font-semibold">
                      Primary (Azul Céu) <br /><span className="text-[10px] opacity-80">#2563eb</span>
                    </div>
                    <div className="rounded-lg bg-cyan-500 p-3 text-white font-semibold">
                      Accent (Ciano Claro) <br /><span className="text-[10px] opacity-80">#06b6d4</span>
                    </div>
                    <div className="rounded-lg bg-amber-500 p-3 text-white font-semibold">
                      Warning / Calor <br /><span className="text-[10px] opacity-80">#f59e0b</span>
                    </div>
                    <div className="rounded-lg bg-emerald-500 p-3 text-white font-semibold">
                      Success / Vento <br /><span className="text-[10px] opacity-80">#10b981</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Typography & Icons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tipografia & Ícones Meteorológicos</CardTitle>
                  <CardDescription>Ícones Lucide React e imagens oficiais OpenWeather.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-semibold">Família Tipográfica:</span>
                    <span className="font-mono">Inter, system-ui, sans-serif</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-semibold">Biblioteca de Ícones:</span>
                    <span>Lucide React (450+ ícones SVG nativos)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Temas:</span>
                    <span>Modo Escuro (Dark) e Modo Claro (Light)</span>
                  </div>
                </CardContent>
              </Card>

              {/* 3D Weather Icon Gallery */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Galeria Oficial de Ícones 3D (Categorias Distintas)</CardTitle>
                  <CardDescription>Cada condição climática possui sua ilustração 3D própria, todas com o mesmo padrão e renderização de alta resolução.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
                    {[
                      { name: "Sol / Ensolarado", icon: "/weather/sun.png" },
                      { name: "Sol c/ Nuvens", icon: "/weather/partly-cloudy.png" },
                      { name: "Encoberto", icon: "/weather/cloud.png" },
                      { name: "Garoa / Chuvisco", icon: "/weather/drizzle.png" },
                      { name: "Chuva / Pancadas", icon: "/weather/rain.png" },
                      { name: "Tempestade", icon: "/weather/thunder.png" },
                      { name: "Nevoeiro / Névoa", icon: "/weather/fog.png" },
                      { name: "Noite Limpa", icon: "/weather/moon.png" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-all">
                        <img src={item.icon} alt={item.name} className="h-12 w-12 object-contain filter drop-shadow hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-[11px] font-semibold text-slate-300">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Links Footer */}
        <div className="rounded-xl border bg-muted/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Pronto para testar todas as páginas ao vivo?</h4>
            <p className="text-xs text-muted-foreground">Navegue pelas rotas da aplicação ou teste com diferentes cidades.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Ir para o Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
