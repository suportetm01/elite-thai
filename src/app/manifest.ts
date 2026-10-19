import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elite Thai — Centro de Artes Marciais",
    short_name: "Elite Thai",
    description: "Muay Thai, Boxe, MMA, Karatê e Taekwondo em Castelo/ES.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    lang: "pt-BR",
    icons: [{ src: "/images/logo-elite-thai.png", sizes: "512x512", type: "image/png" }],
  };
}
