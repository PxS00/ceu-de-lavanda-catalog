import type { RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { SiteNavigation, type SiteNavigationProps } from "./site-navigation";

type MobileMenuProps = SiteNavigationProps & {
  dialog: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

export function MobileMenu({
  dialog,
  onClose,
  pathname,
  hash,
  onNavigate,
}: MobileMenuProps) {
  function closeMenu() {
    dialog.current?.close();
  }
  return (
    <dialog
      id="mobile-menu"
      className="mobile-menu"
      ref={dialog}
      aria-labelledby="menu-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeMenu();
      }}
    >
      <div className="menu-panel">
        <div className="menu-top">
          <span className="eyebrow" id="menu-title">
            CÉU DE LAVANDA
          </span>
          <button
            className="icon-button"
            aria-label="Fechar navegação"
            onClick={closeMenu}
            autoFocus
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Navegação móvel">
          <SiteNavigation pathname={pathname} hash={hash} onNavigate={onNavigate} />
        </nav>
        <div className="menu-bottom">
          <Image
            src="/brand/emblem.svg"
            alt=""
            width={111.56}
            height={176.35}
          />
          <p>
            Uma descoberta
            <br />
            <em>de cada vez.</em>
          </p>
        </div>
        <Link className="text-link" href="/catalogo/" onClick={closeMenu}>
          Explorar a coleção <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </dialog>
  );
}
