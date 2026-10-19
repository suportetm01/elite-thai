import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Bebas_Neue, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const bebas = Bebas_Neue({ variable: "--font-bebas", weight: "400", subsets: ["latin"], display: "swap" });
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Elite Thai | Muay Thai e Artes Marciais em Castelo/ES",
    template: "%s | Elite Thai — Castelo/ES",
  },
  description:
    "Elite Thai — Centro de Artes Marciais em Santo Andrezinho, Castelo/ES. Muay Thai, Boxe, MMA, Karatê e Taekwondo para crianças e adultos. Agende uma aula experimental.",
  applicationName: "Elite Thai",
  keywords: ["Muay Thai Castelo ES", "academia de Muay Thai", "artes marciais Castelo", "Boxe", "MMA", "Karatê", "Taekwondo", "Elite Thai"],
  openGraph: { type: "website", locale: "pt_BR", siteName: "Elite Thai" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`dark ${inter.variable} ${bebas.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-ink">
        {children}
      </body>
    </html>
  );
}
