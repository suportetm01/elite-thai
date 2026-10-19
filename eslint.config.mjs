import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber atualiza objetos Three.js (câmera, materiais, luzes) a cada quadro
    // dentro de useFrame, fora do estado do React — padrão oficial da biblioteca.
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Código gerado e bibliotecas de terceiros copiadas
    "src/generated/**",
    "public/libs/**",
  ]),
]);

export default eslintConfig;
