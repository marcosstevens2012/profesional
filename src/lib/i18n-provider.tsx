"use client";

import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { messages } from "./messages";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <IntlProvider locale="es-AR" messages={messages} defaultLocale="es-AR">
      {children}
    </IntlProvider>
  );
}
