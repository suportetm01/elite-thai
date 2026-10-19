import { hostname, networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/**
 * Em desenvolvimento, o Next.js bloqueia scripts/HMR quando a página é aberta por um
 * endereço diferente de localhost (ex.: celular acessando http://192.168.x.x:3001).
 * Liberamos os IPs desta máquina e o nome dela na rede local.
 */
const localDevOrigins = (() => {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((i): i is NonNullable<typeof i> => Boolean(i && i.family === "IPv4" && !i.internal))
    .map((i) => i.address);
  const host = hostname().toLowerCase();
  return [...new Set([...ips, host, `${host}.local`])];
})();

/**
 * Site 100% estático: `npm run build` gera a pasta `out/` com HTML, CSS, JS e mídias,
 * pronta para qualquer hospedagem. Os cabeçalhos de segurança ficam em `public/_headers`
 * (Netlify, Cloudflare Pages) — em outras hospedagens, configure-os no servidor.
 */
const nextConfig: NextConfig = {
  output: "export",
  // pastas com index.html (ex.: /historia/index.html) funcionam em qualquer servidor estático
  trailingSlash: true,
  allowedDevOrigins: localDevOrigins,
  // sem servidor não há otimização sob demanda: as imagens já vão otimizadas em public/
  images: { unoptimized: true },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
