import { Helmet } from "react-helmet";

interface SeoHelmetProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  keywords?: string;
  author?: string;
  type?: string;
}

const defaultProps: Partial<SeoHelmetProps> = {
  image: "/og-image.png",
  author: "Lauren ia (ialauren.com)",
  type: "website",
  keywords:
    "previsão do tempo, clima, meteorologia, temperatura, oclima, tempo real, chuva, umidade, vento, brasil, radar, pwa",
};

export function SeoHelmet({
  title,
  description,
  image = defaultProps.image!,
  url,
  keywords = defaultProps.keywords,
  author = defaultProps.author,
  type = defaultProps.type,
}: SeoHelmetProps) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://oclima.app";
  const fullUrl = `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang="pt-BR" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="OCLIMA" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
