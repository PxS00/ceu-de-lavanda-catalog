"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { SiteNavigation } from "./site-navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const element = header.current!;
    function onScroll() {
      element.dataset.scrolled = String(window.scrollY > 20);
    }
    function onHashChange() {
      setHash(window.location.hash);
    }
    const desktop = window.matchMedia("(min-width: 761px)");
    function onResize() {
      if (desktop.matches && dialog.current?.open) {
        dialog.current.close();
        const destination =
          element.querySelector<HTMLAnchorElement>(
            ".desktop-nav a[aria-current]",
          ) ?? element.querySelector<HTMLAnchorElement>(".logo");
        destination?.focus();
      }
    }
    onScroll();
    onHashChange();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  function closeMenu() {
    dialog.current?.close();
  }
  function navigate(href: string) {
    setHash(href.includes("#") ? "#sobre" : "");
    closeMenu();
  }

  return (
    <header className="site-header" ref={header}>
      <noscript>
        <style>{`.menu-toggle { display: none !important; } .site-header .desktop-nav { display: flex !important; }`}</style>
      </noscript>
      <div className="header-inner wrap">
        <Link
          className="logo"
          href="/"
          aria-label="Céu de Lavanda — início"
          onClick={() => {
            setHash("");
            closeMenu();
          }}
        >
          <Image
            src="/branding/ceu-de-lavanda-logo-graphite.svg"
            alt="Céu de Lavanda — sinta o toque da lavanda"
            width={513.77}
            height={271.81}
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <SiteNavigation pathname={pathname} hash={hash} onNavigate={navigate} />
        </nav>
        <button
          className="menu-toggle icon-button"
          aria-label="Abrir navegação"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-haspopup="dialog"
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          <Menu aria-hidden="true" />
        </button>
      </div>
      <MobileMenu
        dialog={dialog}
        onClose={() => setOpen(false)}
        pathname={pathname}
        hash={hash}
        onNavigate={navigate}
      />
    </header>
  );
}
