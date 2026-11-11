import Link from "next/link";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/catalogo/", label: "Catálogo" },
  { href: "/familias-olfativas/", label: "Famílias olfativas" },
  { href: "/#sobre", label: "Sobre a marca" },
];

export type SiteNavigationProps = {
  pathname: string;
  hash: string;
  onNavigate: (href: string) => void;
};

export function SiteNavigation({
  pathname,
  hash,
  onNavigate,
}: SiteNavigationProps) {
  return navigation.map(({ href, label }) => {
    const about = pathname === "/" && hash === "#sobre";
    const active =
      href === "/#sobre"
        ? about
        : href === "/"
          ? pathname === "/" && !about
          : href === "/catalogo/"
            ? pathname.startsWith("/catalogo") || pathname.startsWith("/produtos/")
            : pathname.startsWith(href);
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
        onClick={() => onNavigate(href)}
      >
        {label}
      </Link>
    );
  });
}
