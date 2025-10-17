import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { I18nProvider } from "@/lib/i18n-provider";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Profesional",
    default: "Profesional - Conecta con Profesionales de Confianza",
  },
  description:
    "Encuentra y contrata servicios profesionales de calidad en tu área. Marketplace de profesionales verificados.",
  keywords: [
    "servicios profesionales",
    "marketplace",
    "Argentina",
    "profesionales",
  ],
  authors: [{ name: "Profesional Team" }],
  creator: "Profesional",
  publisher: "Profesional",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Profesional",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <I18nProvider>
              <div className="relative min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" richColors closeButton />
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
