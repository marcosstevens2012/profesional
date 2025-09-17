"use client";

import { useAuth } from "@/lib/auth/auth-hooks";
import { getButtonClasses } from "@/lib/utils";
import { Button } from "@profesional/ui";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntl } from "react-intl";

export function Header() {
  const { theme, setTheme } = useTheme();
  const intl = useIntl();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const navigation = [
    { name: intl.formatMessage({ id: "nav.home" }), href: "/" },
    { name: intl.formatMessage({ id: "nav.explore" }), href: "/explorar" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Profesional</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive(item.href) ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth buttons */}
            {user ? (
              // Usuario autenticado - mostrar botón de logout
              <div className="flex items-center space-x-2">
                <Link href="/panel" className={getButtonClasses("ghost", "sm")}>
                  {intl.formatMessage({ id: "nav.panel" })}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  disabled={loading}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{intl.formatMessage({ id: "nav.logout" })}</span>
                </Button>
              </div>
            ) : (
              // Usuario no autenticado - mostrar botones de login y panel
              <>
                <Link
                  href="/ingresar"
                  className={getButtonClasses("ghost", "sm")}
                >
                  {intl.formatMessage({ id: "nav.login" })}
                </Link>
                <Link
                  href="/panel"
                  className={getButtonClasses("default", "sm")}
                >
                  {intl.formatMessage({ id: "nav.panel" })}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
