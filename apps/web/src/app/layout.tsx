import "@profesional/ui/styles";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
