"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Si no hay items personalizados, generar desde la ruta
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground py-4">
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <Fragment key={item.label}>
          <ChevronRight className="h-4 w-4" />
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Mapear segmentos a labels más amigables
    const labelMap: Record<string, string> = {
      explorar: "Explorar",
      profesionales: "Profesionales",
      ingresar: "Ingresar",
      panel: "Panel",
      perfil: "Perfil",
      pagos: "Pagos",
      solicitudes: "Solicitudes",
    };

    const label = labelMap[segment] || segment;

    breadcrumbs.push({
      label,
      href: index < segments.length - 1 ? currentPath : undefined,
    } as BreadcrumbItem);
  });

  return breadcrumbs;
}
