import { createIntl, createIntlCache } from "react-intl";
import { messages } from "./messages";

// Cache para mejorar performance
const cache = createIntlCache();

// Configuración para Argentina (es-AR)
export const intl = createIntl(
  {
    locale: "es-AR",
    messages,
    defaultLocale: "es-AR",
  },
  cache
);

// Helper para formatear moneda argentina
export const formatCurrency = (amount: number): string => {
  return intl.formatNumber(amount, {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

// Helper para formatear fecha
export const formatDate = (date: Date): string => {
  return intl.formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper para formatear fecha con hora
export const formatDateTime = (date: Date): string => {
  return intl.formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
