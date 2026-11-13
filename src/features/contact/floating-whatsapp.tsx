"use client";

import { usePathname } from "next/navigation";
import { products } from "@/features/catalog/lib/catalog";
import { whatsappUrl } from "@/shared/contact";
import { WhatsAppIcon } from "./whatsapp-icon";
import { useFloatingPosition } from "./use-floating-position";

export function FloatingWhatsApp() {
  const position = useFloatingPosition();
  const pathname = usePathname();
  const slug = pathname?.match(/^\/produtos\/([^/]+)\/?$/)?.[1];
  const product = products.find((item) => item.slug === slug);
  return (
    <>
    <a className="whatsapp-float" href={whatsappUrl(product)} draggable={false} {...position}
      aria-describedby="whatsapp-move-hint" title="Arraste para mudar de lugar"
      aria-label={product ? `Conversar no WhatsApp sobre ${product.name}` : "Conversar no WhatsApp"}
      target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon />
    </a>
    <span id="whatsapp-move-hint" className="sr-only">Arraste para mover ou use as teclas de seta.</span>
    </>
  );
}
