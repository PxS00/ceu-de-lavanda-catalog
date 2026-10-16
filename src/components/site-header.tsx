"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/catalogo/", label: "Catálogo" },
  { href: "/#sobre", label: "Sobre a marca" },
];

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
  function links() {
    return navigation.map(({ href, label }) => {
      const about = pathname === "/" && hash === "#sobre";
      const active =
        href === "/#sobre"
          ? about
          : href === "/"
            ? pathname === "/" && !about
            : pathname.startsWith("/catalogo") ||
              pathname.startsWith("/produtos/");
      return (
        <Link
          href={href}
          key={href}
          aria-current={
            active
              ? href === "/catalogo/" && pathname.startsWith("/produtos/")
                ? "location"
                : "page"
              : undefined
          }
          onClick={() => {
            setHash(href.includes("#") ? "#sobre" : "");
            closeMenu();
          }}
        >
          {label}
        </Link>
      );
    });
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
          {links()}
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
      <dialog
        id="mobile-menu"
        className="mobile-menu"
        ref={dialog}
        aria-labelledby="menu-title"
        onClose={() => setOpen(false)}
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
          <nav aria-label="Navegação móvel">{links()}</nav>
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
    </header>
  );
}
