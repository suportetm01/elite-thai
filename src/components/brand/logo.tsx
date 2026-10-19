import Image from "@/components/site/smart-image";
import { Emblem } from "@/components/brand/emblem";
import { cn } from "@/lib/utils";

/** Usa o logotipo cadastrado no painel quando houver; caso contrário, a logo oficial padrão. */
export function BrandMark({ logoUrl, className, priority }: { logoUrl?: string | null; className?: string; priority?: boolean }) {
  if (logoUrl) {
    return (
      <span className={cn("relative block overflow-hidden rounded-full", className)}>
        <Image src={logoUrl} alt="Logotipo Elite Thai" fill sizes="160px" className="object-contain" priority={priority} />
      </span>
    );
  }
  return <Emblem className={className} priority={priority} />;
}
