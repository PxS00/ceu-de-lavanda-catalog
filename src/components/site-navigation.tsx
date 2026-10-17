import Link from "next/link";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/catalogo/", label: "Catálogo" },
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
        onClick={() => onNavigate(href)}
      >
        {label}
      </Link>
    );
  });
}
