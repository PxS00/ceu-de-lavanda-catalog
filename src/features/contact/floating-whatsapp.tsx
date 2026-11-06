"use client";

import { usePathname } from "next/navigation";
import { products } from "@/features/catalog/lib/catalog";
import { whatsappUrl } from "./contact";
import { WhatsAppIcon } from "./whatsapp-icon";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const slug = pathname?.match(/^\/produtos\/([^/]+)\/?$/)?.[1];
  const product = products.find((item) => item.slug === slug);
  return (
    <a className="whatsapp-float" href={whatsappUrl(product)}
      aria-label={product ? `Conversar no WhatsApp sobre ${product.name}` : "Conversar no WhatsApp"}
      target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon />
    </a>
  );
}
