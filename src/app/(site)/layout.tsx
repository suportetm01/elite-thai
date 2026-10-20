import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileCtaBar } from "@/components/site/mobile-cta-bar";
import { SoundProvider } from "@/components/site/sound-provider";
import { MotionProvider } from "@/components/site/motion-provider";
import { getSettings } from "@/lib/data/public";
import { whatsappLink } from "@/lib/format";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  const whatsappHref = whatsappLink(settings.whatsapp, "Olá! Vim pelo site da Elite Thai e quero saber mais sobre as aulas.");

  return (
    <MotionProvider>
      <SoundProvider>
        {/* site estático: o cabeçalho já sai pronto no HTML de cada página (sem versão provisória) */}
        <SiteHeader logoUrl={settings.logoUrl} instagramUrl={settings.instagramUrl} whatsappHref={whatsappHref} />
        <main id="conteudo" className="relative overflow-x-clip">
          {children}
        </main>
        <SiteFooter />
        <MobileCtaBar whatsappHref={whatsappHref} />
      </SoundProvider>
    </MotionProvider>
  );
}
