# Elite Thai — site oficial

Site da **Elite Thai | Centro de Artes Marciais** (Santo Andrezinho, Castelo/ES): visual cinematográfico com fotos e vídeos da equipe e pedido de aula experimental pelo WhatsApp.

O site é **100% estático**: não tem painel, login, banco de dados nem servidor. O conteúdo fica em arquivos do projeto e `npm run build` gera a pasta `out/` com HTML, CSS, JS e mídias, pronta para qualquer hospedagem.

> As informações públicas vieram do perfil oficial [@elite_thaii](https://www.instagram.com/elite_thaii/). Atletas, professores, campeonatos, resultados, horários, fotos e depoimentos **não são inventados**: listas vazias mostram no site um estado honesto ("em atualização").

## Stack

- **Next.js 16** (App Router, exportação estática, Turbopack) · React 19 · TypeScript
- **Tailwind CSS 4** · shadcn/ui (Radix) · Motion · Lucide
- Áudio cinematográfico sintetizado com Web Audio API (sem arquivos, desligado por padrão)

## Rodando localmente

Pré-requisito: Node.js 20.9+.

```bash
npm install
npm run dev
```

Site em http://localhost:3000.

### Scripts

| Script | Função |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `out/` |
| `npm run lint` · `npm run typecheck` | ESLint e TypeScript |
| `npm test` | Testes (formatação, links e formulário de aula experimental) |

## Como editar o conteúdo

Tudo fica em `src/content/` (os tipos e exemplos estão comentados em cada arquivo):

| Arquivo | Conteúdo |
| --- | --- |
| `site.ts` | Informações da academia (textos, endereço, WhatsApp, Instagram) e modalidades |
| `team.ts` | Professores, grade de horários e atletas |
| `competitions.ts` | Campeonatos, resultados, notícias e próximos eventos |
| `media.ts` | Galeria, linha do tempo da história e depoimentos |

Fotos e vídeos vão em `public/` (de preferência em WebP, já no tamanho de exibição — o site estático não otimiza imagens sozinho). As fotos padrão do site (abertura, história, equipe, faixas de fundo e o vídeo de destaques) estão listadas em `src/lib/site-media.ts`.

Depois de editar, gere o site de novo com `npm run build`. Números como campeonatos e medalhas são calculados a partir dessas listas, e a agenda some com os eventos que já passaram a cada build.

**Imagens de pessoas:** publique somente com autorização de uso de imagem (e dos responsáveis, no caso de menores).

## Aula experimental

O formulário monta a mensagem no aparelho do visitante e abre o WhatsApp da academia (`whatsapp` em `src/content/site.ts`). Nenhum dado fica guardado no site.

## Publicação

1. Defina `NEXT_PUBLIC_SITE_URL` (veja `.env.example`) com o domínio final — usado no SEO, no sitemap e nas imagens de compartilhamento.
2. `npm run build` e publique a pasta `out/` (Netlify, Cloudflare Pages, Vercel, GitHub Pages, Hostinger, qualquer servidor de arquivos).
3. Os cabeçalhos de segurança estão em `public/_headers` (lido por Netlify e Cloudflare Pages). Em outras hospedagens, configure-os no servidor.

## Estrutura

```
src/
  app/(site)/          páginas (Início, História, Atletas, Campeonatos, Agenda, Treinos, Galeria, Aula experimental, Privacidade)
  content/             conteúdo do site (editável)
  components/site|home|brand|ui/  interface
  lib/                 leitura do conteúdo, formatação, formulário, mídias padrão
public/                imagens, vídeo, logotipo e _headers
tests/                 testes automatizados
```
