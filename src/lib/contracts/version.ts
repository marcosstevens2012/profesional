/**
 * Contracts version for API compatibility
 * Format: MAJOR.MINOR.PATCH
 *
 * MAJOR: Breaking changes to schema structure
 * MINOR: New schemas or non-breaking additions
 * PATCH: Bug fixes, optimizations
 */
export const CONTRACTS_VERSION = "1.0.0";

/**
 * Version history and migration notes
 */
export const VERSION_HISTORY = {
  "1.0.0": {
    date: "2025-08-19",
    description: "Initial comprehensive contract definitions",
    changes: [
      "User, Profile, and ProfessionalProfile schemas",
      "ServiceCategory and ServiceTag schemas",
      "Location with Argentina provinces support",
      "AvailabilitySlot for professional scheduling",
      "Booking with complete status lifecycle",
      "Payment integration with MercadoPago",
      "PaymentEvent for webhook audit trail",
      "Conversation and Message for chat system",
      "Review system with professional responses",
      "Notification system with types",
      "CommissionRule for platform fees",
      "Search and pagination utilities",
    ],
  },
} as const;

/**
 * Check if current version is compatible with required version
 */
export function isCompatible(requiredVersion: string): boolean {
  const [currentMajor] = CONTRACTS_VERSION.split(".").map(Number);
  const [requiredMajor] = requiredVersion.split(".").map(Number);

  return currentMajor === requiredMajor;
}

/**
 * Get the current contracts version
 */
export function getVersion(): string {
  return CONTRACTS_VERSION;
}
