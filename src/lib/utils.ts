import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mapeamento universal de ícones meteorológicos 3D HD.
 * Cada categoria possui sua própria identidade visual distinta:
 * - Sol Dourado para Ensolarado / Céu Limpo
 * - Nuvem com gotas finas para Garoa / Chuvisco
 * - Nuvem com chuva diagonal e sol para Chuva / Pancadas
 * - Nuvem azul para Encoberto / Nublado
 * - Sol com nuvem para Parcialmente Nublado
 * - Nuvem com névoa para Nevoeiro
 * - Nuvem com raio para Tempestade
 * - Nuvem com cristais para Neve
 * - Lua com estrelas para Noite
 */
export function getWeatherIconUrl(
  icon?: string,
  _size: "2x" | "4x" = "4x",
  description?: string
) {
  const combined = `${icon || ""} ${description || ""}`.toLowerCase();

  // 1. Garoa / Chuvisco / Chuva Passageira Fraca (Drizzle) -> Ícone de garoa com gotinhas delicadas
  if (
    combined.includes("garoa") ||
    combined.includes("chuvisco") ||
    combined.includes("drizzle") ||
    combined.includes("chuva fraca") ||
    combined.includes("chuva passageira fraca") ||
    combined.includes("chuva leve") ||
    combined.includes("266") ||
    combined.includes("263") ||
    combined.includes("281") ||
    combined.includes("284")
  ) {
    return "/weather/drizzle.png";
  }

  // 2. Chuva / Pancadas de Chuva / Chuva Irregular (Rain / Showers) -> Ícone de chuva com sol e gotas diagonais
  if (
    combined.includes("rain") ||
    combined.includes("chuva") ||
    combined.includes("shower") ||
    combined.includes("pancada") ||
    combined.includes("176") ||
    combined.includes("1063") ||
    combined.includes("293") ||
    combined.includes("296") ||
    combined.includes("302") ||
    combined.includes("308") ||
    combined.includes("353") ||
    combined.includes("356") ||
    combined.includes("10d") ||
    combined.includes("10n") ||
    combined.includes("09d") ||
    combined.includes("09n")
  ) {
    return "/weather/rain.png";
  }

  // 3. Tempestade / Trovoadas / Relâmpagos (Thunderstorm)
  if (
    combined.includes("thunder") ||
    combined.includes("trovo") ||
    combined.includes("tempestade") ||
    combined.includes("raio") ||
    combined.includes("386") ||
    combined.includes("389") ||
    combined.includes("11d") ||
    combined.includes("11n")
  ) {
    return "/weather/thunder.png";
  }

  // 4. Nevoeiro / Neblina / Névoa (Fog / Mist / Haze)
  if (
    combined.includes("fog") ||
    combined.includes("mist") ||
    combined.includes("nevo") ||
    combined.includes("neblina") ||
    combined.includes("haze") ||
    combined.includes("143") ||
    combined.includes("248") ||
    combined.includes("260") ||
    combined.includes("50d") ||
    combined.includes("50n")
  ) {
    return "/weather/fog.png";
  }

  // 5. Neve / Granizo (Snow / Sleet / Ice)
  if (
    combined.includes("snow") ||
    combined.includes("neve") ||
    combined.includes("sleet") ||
    combined.includes("ice") ||
    combined.includes("granizo") ||
    combined.includes("13d") ||
    combined.includes("13n")
  ) {
    return "/weather/snow.png";
  }

  // 6. Parcialmente Nublado / Poucas Nuvens (Partly Cloudy) -> Sol com nuvem
  if (
    combined.includes("partly") ||
    combined.includes("parcial") ||
    combined.includes("poucas") ||
    combined.includes("dispers") ||
    combined.includes("02d") ||
    combined.includes("03d") ||
    combined.includes("116")
  ) {
    return "/weather/partly-cloudy.png";
  }

  // 7. Encoberto / Totalmente Nublado (Overcast / Cloudy) -> Apenas a nuvem azul suave
  if (
    combined.includes("overcast") ||
    combined.includes("encoberto") ||
    combined.includes("cloud") ||
    combined.includes("nublado") ||
    combined.includes("04d") ||
    combined.includes("04n") ||
    combined.includes("119") ||
    combined.includes("122")
  ) {
    return "/weather/cloud.png";
  }

  // 8. Noite Limpa (Clear Night) -> Lua com estrelas
  if (
    combined.includes("night") ||
    combined.includes("noite") ||
    combined.includes("01n")
  ) {
    return "/weather/moon.png";
  }

  // 9. Ensolarado / Céu Limpo (Clear / Sunny) -> Sol Dourado 3D Vibrante
  if (
    combined.includes("sun") ||
    combined.includes("clear") ||
    combined.includes("limpo") ||
    combined.includes("ensolarado") ||
    combined.includes("01d") ||
    combined.includes("113")
  ) {
    return "/weather/sun.png";
  }

  // Fallback padrão
  return "/weather/partly-cloudy.png";
}
