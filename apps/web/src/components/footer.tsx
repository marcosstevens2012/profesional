import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profesional</h3>
            <p className="text-sm text-muted-foreground">
              Conecta con profesionales de confianza para todos tus proyectos.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Enlaces Rápidos</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/explorar"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Explorar Profesionales
              </Link>
              <Link
                href="/como-funciona"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cómo Funciona
              </Link>
              <Link
                href="/precios"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Precios
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Soporte</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/ayuda"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Centro de Ayuda
              </Link>
              <Link
                href="/contacto"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </Link>
              <Link
                href="/terminos"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Términos y Condiciones
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/privacidad"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Política de Cookies
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Profesional. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
